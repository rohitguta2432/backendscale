// MCPGuard rules engine — deterministic, zero-network checks.
//
// Faithful TypeScript port of the Python `mcpguard/rules.py` core. Each check
// receives a parsed tool object and returns Finding[]. No third-party deps, no
// LLM — the exact same rules that the Python eval suite scores 100% recall on.

export type Severity = "critical" | "high" | "medium" | "low";

export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

export interface Finding {
    id: string; // unique check slug
    severity: Severity;
    tool: string; // tool name or "<unknown>"
    evidence: string; // excerpt that triggered the finding
    remediation: string;
}

type Tool = Record<string, unknown>;
export interface Manifest {
    tools?: unknown[];
    name?: unknown;
    [k: string]: unknown;
}

// --- helpers -------------------------------------------------------------

function str(v: unknown): string {
    return typeof v === "string" ? v : "";
}

const ZERO_WIDTH = /[​‌‍⁠﻿­]/;
const UNICODE_TAGS = /[\u{E0000}-\u{E007F}]/u;

const INJECTION_PHRASES = [
    "ignore previous", "disregard previous", "ignore all previous", "disregard all previous",
    "ignore the above", "disregard the above", "forget previous", "forget all previous",
    "override instructions", "new instructions", "system prompt", "you are now", "act as",
    "pretend you are", "pretend to be", "roleplay as", "[system]", "<system>", "<!-- ", "/* ",
    "do not tell", "keep this secret", "do not reveal", "never mention", "without informing",
    "without telling the user", "hidden instruction",
];

const EXFIL_PHRASES = [
    "send to", "exfiltrate", "post to", "transmit to", "upload to", "forward to",
    "call this url", "http://", "https://", "webhook", "before using any tool",
    "before calling any", "first call", "always call", "call this tool first",
    "invoke this tool", "read the file", "read ~/.ssh", "read /etc", "read env",
    "read environment", "$env", "process.env", "os.environ", "read secrets",
    "read credentials", "get credentials", "access credentials", "steal", "harvest",
];

const CROSS_TOOL_PHRASES = [
    "before using any tool", "before calling any tool", "call this tool before",
    "must be called first", "always invoke", "always call this", "inject into",
    "replace the output", "override the result",
];

const DANGEROUS_BINS = [
    "sh", "bash", "zsh", "fish", "dash", "curl", "wget", "python", "python3", "ruby",
    "perl", "node", "nc", "netcat", "rm", "dd", "chmod", "chown", "sudo", "eval", "exec",
];
const DANGEROUS_BIN_RE = new RegExp(
    "\\b(" + [...DANGEROUS_BINS].sort((a, b) => b.length - a.length).map(escapeRe).join("|") + ")\\b",
);

const SECRET_RES: [string, RegExp][] = [
    ["openai-key", /sk-[A-Za-z0-9]{20,}/],
    ["github-pat", /ghp_[A-Za-z0-9]{30,}/],
    ["github-oauth", /gho_[A-Za-z0-9]{30,}/],
    ["aws-access-key", /AKIA[A-Z0-9]{16}/],
    ["jwt", /eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/],
    ["private-key", /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ["generic-secret", /(password|passwd|secret|token|api_key|apikey)\s*[=:]\s*["']?[A-Za-z0-9+/=_\-]{8,}["']?/i],
    ["slack-token", /xox[baprs]-[A-Za-z0-9\-]+/],
    ["stripe-key", /sk_live_[A-Za-z0-9]{20,}/],
];

const DANGEROUS_SCOPES = [
    "shell", "exec", "execute", "subprocess", "file_write", "write_file", "write_files",
    "file_read", "read_file", "network_egress", "network_access", "env_read", "read_env",
    "environment", "secret_read", "read_secrets", "admin", "root", "superuser",
    "arbitrary_code", "code_execution",
];

const WILDCARD_RE = /(\*{1,2}|\/\.\.\.|~\/|\/root\/|\/home\/\*\/)/;

const DANGEROUS_TOOL_NAMES = /\b(exec|shell|run_command|execute|system|write_file|delete_file|drop_table|send_email|send_message|post_webhook|upload|deploy|eval_code|run_script|arbitrary)\b/i;

function escapeRe(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasSuspiciousB64(text: string): string | null {
    const re = /[A-Za-z0-9+/]{40,}={0,2}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const blob = m[0];
        try {
            const decoded = Buffer.from(blob + "==", "base64").toString("latin1").toLowerCase();
            if (INJECTION_PHRASES.slice(0, 6).some((p) => decoded.includes(p))) {
                return blob.slice(0, 60) + "...";
            }
        } catch {
            // ignore undecodable blobs
        }
    }
    return null;
}

// --- Check 1: prompt injection in description ---------------------------

function checkPromptInjection(tool: Tool): Finding[] {
    const findings: Finding[] = [];
    const name = str(tool.name) || "<unknown>";
    const desc = str(tool.description);
    const descLower = desc.toLowerCase();

    for (const phrase of INJECTION_PHRASES) {
        if (descLower.includes(phrase)) {
            findings.push({
                id: "prompt_injection_in_description",
                severity: "critical",
                tool: name,
                evidence: `Found phrase '${phrase}' in description`,
                remediation:
                    "Remove any instructions directed at the LLM from tool descriptions. Descriptions must only document the tool's purpose and parameters.",
            });
            break;
        }
    }

    if (ZERO_WIDTH.test(desc) || UNICODE_TAGS.test(desc)) {
        findings.push({
            id: "prompt_injection_hidden_chars",
            severity: "critical",
            tool: name,
            evidence: "Zero-width or Unicode tag characters detected in description",
            remediation:
                "Strip all zero-width characters (U+200B–U+200D, U+2060, U+FEFF, U+00AD) and Unicode tag codepoints (U+E0000–U+E007F) from tool descriptions.",
        });
    }

    const blob = hasSuspiciousB64(desc);
    if (blob) {
        findings.push({
            id: "prompt_injection_base64_payload",
            severity: "critical",
            tool: name,
            evidence: `Suspicious base64 blob in description: ${blob}`,
            remediation: "Remove base64-encoded content from tool descriptions.",
        });
    }

    return findings;
}

// --- Check 2: tool poisoning / rug-pull --------------------------------

function checkToolPoisoning(tool: Tool): Finding[] {
    const findings: Finding[] = [];
    const name = str(tool.name) || "<unknown>";
    const descLower = str(tool.description).toLowerCase();

    for (const phrase of EXFIL_PHRASES) {
        if (descLower.includes(phrase)) {
            findings.push({
                id: "tool_poisoning",
                severity: "critical",
                tool: name,
                evidence: `Exfiltration/cross-tool directive '${phrase}' in description`,
                remediation:
                    "Tool descriptions must not instruct the model to send data externally, read secrets, or perform actions beyond the tool's stated function.",
            });
            break;
        }
    }

    for (const phrase of CROSS_TOOL_PHRASES) {
        if (descLower.includes(phrase)) {
            findings.push({
                id: "tool_poisoning_cross_tool_hijack",
                severity: "critical",
                tool: name,
                evidence: `Cross-tool hijack directive '${phrase}' in description`,
                remediation:
                    "Remove any instruction that tells the model to call other tools or to execute this tool unconditionally before others.",
            });
            break;
        }
    }

    return findings;
}

// --- Check 3: over-permissioned tools ----------------------------------

function checkOverPermissioned(tool: Tool): Finding[] {
    const findings: Finding[] = [];
    const name = str(tool.name) || "<unknown>";

    const command = str(tool.command);
    const argsRaw = tool.args;
    const argsArr = Array.isArray(argsRaw) ? argsRaw : argsRaw === undefined ? [] : [argsRaw];
    const argsStr = argsArr.map((a) => String(a)).join(" ");
    const cmdText = `${command} ${argsStr}`.trim().toLowerCase();

    const m = DANGEROUS_BIN_RE.exec(cmdText);
    if (m) {
        const pipey = ["| bash", "| sh", "|bash", "|sh", "bash -c", "sh -c", "eval "].some((x) =>
            cmdText.includes(x),
        );
        findings.push({
            id: "over_permissioned_dangerous_command",
            severity: pipey ? "critical" : "high",
            tool: name,
            evidence: pipey
                ? `Shell injection pattern in command/args: '${cmdText.slice(0, 80)}'`
                : `Dangerous binary '${m[0]}' in command/args: '${cmdText.slice(0, 80)}'`,
            remediation:
                "Avoid exposing shell interpreters (sh/bash), curl-pipe-bash, or arbitrary code execution in tool commands. Prefer purpose-built binaries with narrow interfaces.",
        });
    }

    if (/rm\s+-[rRfF]{1,4}/.test(cmdText) || cmdText.includes("rm -rf")) {
        findings.push({
            id: "over_permissioned_destructive_command",
            severity: "critical",
            tool: name,
            evidence: `Destructive command (rm -rf) found: '${cmdText.slice(0, 80)}'`,
            remediation: "Never include destructive file system commands in tool definitions.",
        });
    }

    const permsRaw = tool.permissions;
    const permsStr = (Array.isArray(permsRaw) ? permsRaw.map((p) => String(p)).join(" ") : String(permsRaw ?? "")).toLowerCase();
    for (const scope of DANGEROUS_SCOPES) {
        if (permsStr.includes(scope)) {
            findings.push({
                id: "over_permissioned_scope",
                severity: "high",
                tool: name,
                evidence: `Dangerous permission scope '${scope}' granted to tool`,
                remediation:
                    "Apply the principle of least privilege. Grant only the exact permissions required; avoid shell, exec, arbitrary file write/read, or broad network egress.",
            });
            break;
        }
    }

    const descLower = str(tool.description).toLowerCase();
    if (
        ["arbitrary file", "any file", "write to any", "read any file", "run any command", "execute any", "full disk", "full filesystem"].some(
            (p) => descLower.includes(p),
        )
    ) {
        findings.push({
            id: "over_permissioned_description",
            severity: "high",
            tool: name,
            evidence: "Description claims overly broad access (arbitrary/any file, any command)",
            remediation: "Narrow the tool's scope; document exact paths and operations permitted.",
        });
    }

    return findings;
}

// --- Check 4: secret exposure ------------------------------------------

function checkSecretExposure(tool: Tool): Finding[] {
    const findings: Finding[] = [];
    const name = str(tool.name) || "<unknown>";
    const toolText = JSON.stringify(tool);

    for (const [label, pat] of SECRET_RES) {
        const m = pat.exec(toolText);
        if (m) {
            let snippet = m[0].slice(0, 40);
            if (m[0].length > 40) snippet += "...";
            findings.push({
                id: `secret_exposure_${label.replace(/-/g, "_")}`,
                severity: "critical",
                tool: name,
                evidence: `${label} pattern detected: '${snippet}'`,
                remediation:
                    "Never embed credentials, API keys, tokens, or private keys in MCP manifests. Use environment variable references (e.g. $MY_API_KEY) and inject secrets at runtime via a secrets manager.",
            });
        }
    }

    return findings;
}

// --- Check 5: excessive scope / wildcard paths -------------------------

function checkExcessiveScope(tool: Tool): Finding[] {
    const findings: Finding[] = [];
    const name = str(tool.name) || "<unknown>";
    const toolText = JSON.stringify(tool);

    const m = WILDCARD_RE.exec(toolText);
    if (m) {
        findings.push({
            id: "excessive_scope_wildcard",
            severity: "high",
            tool: name,
            evidence: `Wildcard or broad glob path detected: '${m[0]}'`,
            remediation:
                "Replace wildcard paths (**, /home/*) with explicit, minimal allow-lists. Scope file access to the directories the tool genuinely needs.",
        });
    }

    const scopes = tool.scopes ?? tool.permissions ?? [];
    const wildcardScope =
        (Array.isArray(scopes) && scopes.includes("*")) || (typeof scopes === "string" && scopes.trim() === "*");
    if (wildcardScope) {
        findings.push({
            id: "excessive_scope_wildcard_permission",
            severity: "high",
            tool: name,
            evidence: "'*' wildcard in scopes/permissions",
            remediation: "Replace the '*' wildcard scope with an explicit list of required permissions.",
        });
    }

    return findings;
}

// --- Check 6: unauthenticated dangerous tools --------------------------

function checkUnauthenticatedDangerous(tool: Tool): Finding[] {
    const name = str(tool.name) || "<unknown>";
    const descLower = str(tool.description).toLowerCase();
    const dangerousDesc = [
        "execute", "run command", "shell", "arbitrary", "admin", "delete all", "drop", "deploy", "send email", "post to",
    ].some((p) => descLower.includes(p));
    const dangerousName = DANGEROUS_TOOL_NAMES.test(name);

    if (!dangerousName && !dangerousDesc) return [];

    let hasAuth = ["auth", "authentication", "authorization", "requires_auth", "api_key_required"].some((k) => k in tool);
    if (!hasAuth) {
        const schema = tool.inputSchema;
        const props =
            schema && typeof schema === "object" && "properties" in schema && typeof (schema as Record<string, unknown>).properties === "object"
                ? ((schema as Record<string, Record<string, unknown>>).properties)
                : {};
        hasAuth = Object.keys(props).some((k) =>
            ["api_key", "token", "auth_token", "authorization", "bearer"].includes(k.toLowerCase()),
        );
    }

    if (!hasAuth) {
        return [
            {
                id: "unauthenticated_dangerous_tool",
                severity: "high",
                tool: name,
                evidence: `Dangerous tool '${name}' has no authentication requirement`,
                remediation:
                    "Add an 'auth' field or require an api_key/token parameter for any tool that executes commands, modifies data, sends messages, or has admin-level access.",
            },
        ];
    }
    return [];
}

// --- top-level scanner -------------------------------------------------

export function runAllChecks(manifest: Manifest): Finding[] {
    const tools = Array.isArray(manifest.tools) ? (manifest.tools as Tool[]) : [];
    const all: Finding[] = [];
    for (const tool of tools) {
        if (!tool || typeof tool !== "object") continue;
        all.push(...checkPromptInjection(tool));
        all.push(...checkToolPoisoning(tool));
        all.push(...checkOverPermissioned(tool));
        all.push(...checkSecretExposure(tool));
        all.push(...checkExcessiveScope(tool));
        all.push(...checkUnauthenticatedDangerous(tool));
    }
    return all;
}
