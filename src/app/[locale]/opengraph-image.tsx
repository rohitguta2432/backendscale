import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Rohit Raj — Founding Engineer & AI Systems Architect';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '80px',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #1f2937 100%)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#fff',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 800,
                        }}
                    >
                        R
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
                        rohitraj.tech
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontSize: 80,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: -2,
                            maxWidth: 1000,
                        }}
                    >
                        <div style={{ display: 'flex' }}>Founding Engineer &amp;</div>
                        <div style={{ display: 'flex' }}>AI Systems Architect</div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 32,
                            color: '#9ca3af',
                            maxWidth: 1000,
                            lineHeight: 1.3,
                        }}
                    >
                        Building production AI systems, RAG pipelines, and distributed backends for startups.
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 24,
                        fontSize: 22,
                        color: '#d1d5db',
                    }}
                >
                    <span>6+ years shipping</span>
                    <span style={{ color: '#4b5563' }}>·</span>
                    <span>Java · Next.js · Kafka · GPT-4</span>
                    <span style={{ color: '#4b5563' }}>·</span>
                    <span>India · Worldwide</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
