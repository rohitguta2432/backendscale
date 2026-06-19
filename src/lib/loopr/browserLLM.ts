// Browser-side LLM clients for the "bring your own key" live demo. The key is
// read from a form field and sent DIRECTLY to the provider from the visitor's
// browser — it never touches this site's server and is never stored. Both
// provider domains are whitelisted in next.config.ts connect-src.

import type { Generate } from "@/lib/loopr/engine";

export type Provider = "openai" | "anthropic";

export const DEFAULT_MODELS: Record<Provider, string> = {
    openai: "gpt-4o-mini",
    anthropic: "claude-haiku-4-5-20251001",
};

export function makeBrowserClient(provider: Provider, apiKey: string, model: string): Generate {
    const key = apiKey.trim();
    const mdl = model.trim() || DEFAULT_MODELS[provider];

    if (provider === "openai") {
        return async (prompt, system) => {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
                body: JSON.stringify({
                    model: mdl,
                    temperature: 0,
                    messages: [
                        ...(system ? [{ role: "system", content: system }] : []),
                        { role: "user", content: prompt },
                    ],
                }),
            });
            if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 160)}`);
            const data = await res.json();
            return (data.choices?.[0]?.message?.content ?? "").trim();
        };
    }

    return async (prompt, system) => {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true",
            },
            body: JSON.stringify({
                model: mdl,
                max_tokens: 1024,
                temperature: 0,
                system: system || "",
                messages: [{ role: "user", content: prompt }],
            }),
        });
        if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 160)}`);
        const data = await res.json();
        return (data.content ?? []).map((b: { text?: string }) => b.text ?? "").join("").trim();
    };
}
