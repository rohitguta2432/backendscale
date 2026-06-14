// Sample tickets for the Agent-Lab demo — chosen to walk the full decision
// matrix: clean self-serve resolves, a refund that needs authority, and two
// hard-gate escalations (security, legal).

import type { CustomerTier } from "./types";

export interface TicketPreset {
    id: string;
    label: string;
    subject: string;
    body: string;
    customerTier: CustomerTier;
    /** What the agent is expected to do — shown as a hint, not enforced. */
    expect: "resolve" | "escalate";
}

export const PRESETS: TicketPreset[] = [
    {
        id: "password",
        label: "Password reset",
        subject: "Can't log in",
        body: "Hi, I forgot my password and can't sign in to my account. How do I reset it?",
        customerTier: "pro",
        expect: "resolve",
    },
    {
        id: "invoice",
        label: "Invoice download",
        subject: "Need last month's invoice",
        body: "Where do I download my invoice? My finance team needs the PDF receipt for our records.",
        customerTier: "enterprise",
        expect: "resolve",
    },
    {
        id: "refund",
        label: "Refund request",
        subject: "Want a refund",
        body: "I was charged for the annual plan but changed my mind. I'd like a refund of last month's payment please.",
        customerTier: "pro",
        expect: "escalate",
    },
    {
        id: "hacked",
        label: "Hacked account",
        subject: "I think I've been hacked",
        body: "Someone changed the email on my account and I can't get in. I didn't recognize the last login — I think my account was hacked. Help!",
        customerTier: "pro",
        expect: "escalate",
    },
    {
        id: "legal",
        label: "Legal threat",
        subject: "This is unacceptable",
        body: "Your product lost my data and I've had enough. I'll see you in court — my lawyer will be in touch.",
        customerTier: "enterprise",
        expect: "escalate",
    },
];
