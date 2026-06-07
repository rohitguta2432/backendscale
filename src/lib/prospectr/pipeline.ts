// Prospectr outbound pipeline — faithful TS port of prospectr/prospectr/tools.py.
// Deterministic: enrich a lead's email, score it 0-100 against the ICP, draft a
// personalized pitch for keepers, and run the blocklist/dedupe safety gate.
// queue_send is a dry-run by design — it can never transmit.

export interface Lead {
    id: string;
    name: string;
    role: string;
    company: string;
    domain: string;
    industry: string;
    size: string;
    signals: string[];
}

export interface Icp {
    industries: string[];
    roles: string[];
    sizes: string[];
    signalKeywords: string[];
}

export const ICP: Icp = {
    industries: ["SaaS", "Agency", "Marketplace"],
    roles: ["Founder", "CEO", "VP Sales", "Head of Sales"],
    sizes: ["seed", "bootstrapped"],
    signalKeywords: ["outbound", "pipeline", "SDR", "BDR", "lead gen"],
};

export const OFFER =
    "Prospectr automates your outbound: finds leads, verifies emails, and drafts personalized pitches — at a fraction of SDR cost.";

export const LEADS: Lead[] = [
    { id: "lead_001", name: "Sarah Chen", role: "Founder", company: "NovaBuild", domain: "novabuild.io", industry: "SaaS", size: "seed", signals: ["recently raised seed round", "hiring SDR"] },
    { id: "lead_004", name: "Tom Bradley", role: "Founder", company: "AgencyEdge", domain: "agencyedge.co", industry: "Agency", size: "bootstrapped", signals: ["posted about outbound struggles", "looking for pipeline help"] },
    { id: "lead_007", name: "Diana Wu", role: "VP Sales", company: "LoopAgency", domain: "loopagency.com", industry: "Agency", size: "series_a", signals: ["posted about pipeline generation", "attending SaaStr"] },
    { id: "lead_003", name: "Priya Sharma", role: "Head of Sales", company: "DataMesh", domain: "datamesh.ai", industry: "AI/ML", size: "series_a", signals: ["expanding sales team", "hiring BDR"] },
    { id: "lead_010", name: "Raj Patel", role: "CEO", company: "OutboundOS", domain: "outboundos.com", industry: "SaaS", size: "seed", signals: ["posted need for lead gen help", "recently hired AE"] },
    { id: "lead_008", name: "Carlos Mendes", role: "Founder", company: "BadActorCorp", domain: "badactorcorp.com", industry: "Finance", size: "seed", signals: ["not ideal fit"] },
];

const MX_DOMAINS = new Set<string>([
    "novabuild.io",
    "freelancehq.com",
    "datamesh.ai",
    "agencyedge.co",
    "techstack.dev",
    "sprintsales.io",
    "loopagency.com",
    "pixelcraft.studio",
    "outboundos.com",
]);

const BLOCKLIST_DOMAINS = new Set<string>(["badactorcorp.com", "donotcontact.com", "noreply.io"]);
const BLOCKLIST_ROLE_PATTERNS = ["investor", "vc", "recruiter", "spam"];

export interface ScoreComponent {
    label: string;
    detail: string;
    points: number;
    max: number;
}

export interface PipelineResult {
    lead: Lead;
    email: string;
    emailCandidates: string[];
    emailConfidence: "verified" | "unverified";
    score: number;
    classification: "keep" | "skip";
    breakdown: ScoreComponent[];
    blocklisted: boolean;
    blockReason: string | null;
    pitch: { subject: string; body: string; wordCount: number; placeholderLeak: boolean } | null;
    queue: { status: "queued" | "suppressed" | "skipped"; label: string; tone: "ok" | "warn" | "bad" };
}

function permuteEmails(name: string, domain: string): string[] {
    const parts = name.toLowerCase().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return [`${parts[0]}@${domain}`];
    const first = parts[0];
    const last = parts[parts.length - 1];
    return [`${first}.${last}@${domain}`, `${first[0]}.${last}@${domain}`, `${first}@${domain}`];
}

function enrich(lead: Lead): { email: string; candidates: string[]; confidence: "verified" | "unverified" } {
    const candidates = permuteEmails(lead.name, lead.domain);
    // Mock MX check: a domain in the MX table verifies the standard permutations.
    const verified = MX_DOMAINS.has(lead.domain) ? candidates : [];
    return {
        email: verified[0] ?? candidates[0],
        candidates,
        confidence: verified.length > 0 ? "verified" : "unverified",
    };
}

function scoreFit(lead: Lead): { score: number; classification: "keep" | "skip"; breakdown: ScoreComponent[] } {
    const industryOk = ICP.industries.includes(lead.industry);
    const roleOk = ICP.roles.includes(lead.role);
    const sizeOk = ICP.sizes.includes(lead.size);

    const leadSignals = lead.signals.join(" ").toLowerCase();
    const keywords = ICP.signalKeywords.map((k) => k.toLowerCase());
    const matched = keywords.filter((k) => leadSignals.includes(k));
    const signalPoints = keywords.length ? Math.floor((25 * matched.length) / keywords.length) : 0;

    const breakdown: ScoreComponent[] = [
        { label: "Industry", detail: lead.industry, points: industryOk ? 30 : 0, max: 30 },
        { label: "Role", detail: lead.role, points: roleOk ? 25 : 0, max: 25 },
        { label: "Company size", detail: lead.size, points: sizeOk ? 20 : 0, max: 20 },
        {
            label: "Signal match",
            detail: matched.length ? matched.join(", ") : "no ICP signal",
            points: signalPoints,
            max: 25,
        },
    ];

    const score = breakdown.reduce((acc, c) => acc + c.points, 0);
    return { score, classification: score > 60 ? "keep" : "skip", breakdown };
}

function draftPitch(lead: Lead): { subject: string; body: string; wordCount: number; placeholderLeak: boolean } {
    const firstName = lead.name.split(/\s+/)[0] || "there";
    const signalRef = lead.signals[0] || "scaling your business";
    const subject = `Quick idea for ${lead.company}'s pipeline`;
    const body =
        `Hi ${firstName},\n\n` +
        `I noticed ${lead.company} is ${signalRef} — congrats on the momentum.\n\n` +
        `As ${lead.role} you're likely thinking about how to fill pipeline without ` +
        `hiring a full SDR team. ${OFFER}\n\n` +
        `Would a 20-minute call this week make sense? Happy to show you a ` +
        `live demo tailored to ${lead.company}.\n\n` +
        `Best,\nRohit`;
    return {
        subject,
        body,
        wordCount: body.split(/\s+/).filter(Boolean).length,
        placeholderLeak: /\{\{.*?\}\}/.test(body),
    };
}

function blockReasonFor(lead: Lead): string | null {
    if (BLOCKLIST_DOMAINS.has(lead.domain)) return `domain ${lead.domain} is blocklisted`;
    const role = lead.role.toLowerCase();
    const pat = BLOCKLIST_ROLE_PATTERNS.find((p) => role.includes(p));
    if (pat) return `role matches blocked pattern “${pat}”`;
    return null;
}

export function runPipeline(leadId: string): PipelineResult {
    const lead = LEADS.find((l) => l.id === leadId);
    if (!lead) throw new Error(`unknown lead '${leadId}'`);

    const { email, candidates, confidence } = enrich(lead);
    const { score, classification, breakdown } = scoreFit(lead);
    const blockReason = blockReasonFor(lead);
    const blocklisted = blockReason !== null;

    let pitch: PipelineResult["pitch"] = null;
    let queue: PipelineResult["queue"];

    if (blocklisted) {
        queue = { status: "suppressed", label: "Suppressed before send — blocklist", tone: "bad" };
    } else if (classification === "skip") {
        queue = { status: "skipped", label: "Not queued — below ICP threshold (score ≤ 60)", tone: "warn" };
    } else {
        pitch = draftPitch(lead);
        queue = { status: "queued", label: "Queued to outbox (dry-run — never transmits)", tone: "ok" };
    }

    return {
        lead,
        email,
        emailCandidates: candidates,
        emailConfidence: confidence,
        score,
        classification,
        breakdown,
        blocklisted,
        blockReason,
        pitch,
        queue,
    };
}
