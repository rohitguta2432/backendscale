// Resolvr knowledge base — a fixed set of support articles for a fictional
// project-management SaaS ("Northwind"). The agent grounds every drafted reply
// in these articles; nothing outside this KB may be asserted as policy.

import type { KBArticle } from "./types";

export const KB: KBArticle[] = [
    {
        id: "kb-password-reset",
        title: "Reset your password",
        category: "account",
        keywords: ["password", "reset", "forgot", "login", "sign in", "log in", "locked out", "credentials"],
        body: "To reset your password, open the sign-in page and click \"Forgot password\". Enter the email on your account and we email a reset link that stays valid for 30 minutes. Open it, choose a new password (12+ characters), and you're signed back in. If the email doesn't arrive within 5 minutes, check spam and confirm you used the address on the account.",
    },
    {
        id: "kb-2fa",
        title: "Set up or recover two-factor authentication (2FA)",
        category: "account",
        keywords: ["2fa", "two-factor", "two factor", "authenticator", "otp", "verification code", "mfa", "security code"],
        body: "Enable 2FA under Settings → Security → Two-factor authentication. Scan the QR code with any authenticator app and save the 10 backup codes shown — each works once if you lose your device. To recover access without your phone, sign in with a backup code, then re-enrol a new device.",
    },
    {
        id: "kb-invoice-download",
        title: "Download an invoice or receipt",
        category: "billing",
        keywords: ["invoice", "receipt", "download", "billing history", "tax invoice", "gst", "pdf"],
        body: "Every invoice lives under Settings → Billing → Invoices. Click any row to download a PDF receipt; enterprise workspaces can add a billing email under the same page to have invoices sent automatically each cycle. Invoices show your plan, the billing period, and applicable tax.",
    },
    {
        id: "kb-billing-cycle",
        title: "How billing and the billing cycle work",
        category: "billing",
        keywords: ["billing", "charged", "payment", "renew", "renewal", "subscription", "card", "cycle", "monthly", "annual"],
        body: "Paid plans renew automatically on the date you first subscribed — monthly or annually. We charge the card on file at the start of each period and email a receipt. Update the card under Settings → Billing → Payment method. A failed charge retries for 7 days before the workspace drops to the free plan.",
    },
    {
        id: "kb-refund-policy",
        title: "Refund policy",
        category: "refund",
        keywords: ["refund", "money back", "reimburse", "cancel charge", "overcharged", "double charged"],
        body: "Refunds are handled case by case under our 14-day policy: a first annual charge can be refunded in full within 14 days of purchase. Monthly charges and renewals are generally non-refundable, but billing mistakes (duplicate or wrong-amount charges) are always corrected. A support specialist reviews and authorises every refund — the agent cannot promise one.",
    },
    {
        id: "kb-cancel-subscription",
        title: "Cancel your subscription",
        category: "billing",
        keywords: ["cancel", "cancellation", "downgrade", "stop subscription", "end plan", "unsubscribe"],
        body: "Cancel anytime under Settings → Billing → Cancel plan. Your workspace keeps paid features until the end of the current billing period, then moves to the free plan — your data is never deleted on cancellation. You can re-subscribe at any time and pick up where you left off.",
    },
    {
        id: "kb-export-data",
        title: "Export your projects and data",
        category: "technical",
        keywords: ["export", "download data", "backup", "csv", "json", "migrate", "take out"],
        body: "Export a workspace under Settings → Data → Export. Choose CSV (per board) or a full JSON archive of every project, task, and comment. Large exports run in the background and email you a download link when ready; links expire after 24 hours.",
    },
    {
        id: "kb-plan-limits",
        title: "Plan limits (free vs Pro vs Enterprise)",
        category: "billing",
        keywords: ["limit", "limits", "plan", "free plan", "pro", "enterprise", "seats", "members", "upgrade", "projects"],
        body: "Free includes 3 projects and 5 members. Pro removes project limits and adds unlimited members, automations, and priority support. Enterprise adds SSO, audit logs, and a dedicated success manager. Upgrade or compare plans under Settings → Billing → Change plan.",
    },
    {
        id: "kb-sso",
        title: "Single sign-on (SSO / SAML)",
        category: "account",
        keywords: ["sso", "saml", "okta", "azure ad", "single sign-on", "identity provider", "scim"],
        body: "SSO is available on Enterprise. An admin configures SAML under Settings → Security → SSO using your identity provider's metadata URL (Okta, Azure AD, Google Workspace). Once enabled you can require SSO for all members and provision users automatically via SCIM.",
    },
    {
        id: "kb-api-rate-limits",
        title: "API rate limits and errors",
        category: "technical",
        keywords: ["api", "rate limit", "429", "token", "integration", "webhook", "throttled", "error"],
        body: "The REST API allows 600 requests/minute per workspace token. Exceeding it returns HTTP 429 with a Retry-After header — back off and retry after the stated seconds. Generate and rotate tokens under Settings → Developer → API keys. Webhooks retry failed deliveries with exponential backoff for up to 24 hours.",
    },
];

export const KB_BY_ID: Record<string, KBArticle> = Object.fromEntries(KB.map((a) => [a.id, a]));
