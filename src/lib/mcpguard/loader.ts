// MCPGuard manifest loader — normalise arbitrary parsed JSON into a manifest
// with a `tools` array. Faithful port of mcpguard/loader.py (file/dir IO dropped;
// the demo receives already-parsed JSON).
import type { Manifest } from "./rules";

export function normalizeManifest(raw: unknown): Manifest {
    if (Array.isArray(raw)) {
        return { tools: raw };
    }
    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (!("tools" in obj)) {
            if ("name" in obj) return { tools: [obj] };
            return { tools: [] };
        }
        return obj as Manifest;
    }
    throw new Error(`Unexpected top-level JSON type: ${typeof raw}`);
}
