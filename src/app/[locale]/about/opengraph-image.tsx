import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'About Rohit Raj - Freelance Founding Engineer & AI Systems Architect';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    padding: '60px',
                }}
            >
                {/* Top left - Name */}
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                        }}
                    >
                        R
                    </div>
                    <span
                        style={{
                            color: '#e5e5e5',
                            fontSize: '24px',
                            fontWeight: '600',
                        }}
                    >
                        Rohit Raj
                    </span>
                </div>

                {/* Top right - Website */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50px',
                        right: '60px',
                        color: '#737373',
                        fontSize: '20px',
                    }}
                >
                    rohitraj.tech
                </div>

                {/* Center - Main Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '24px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #3b82f630, #8b5cf620)',
                            border: '1px solid #3b82f650',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            color: '#60a5fa',
                            fontSize: '16px',
                            fontWeight: '500',
                        }}
                    >
                        ABOUT
                    </div>
                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            margin: 0,
                            lineHeight: 1.1,
                            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #818cf8 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        6+ Years Building
                    </h1>
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#a3a3a3',
                            margin: 0,
                            maxWidth: '800px',
                        }}
                    >
                        Production AI systems & distributed architectures for startups
                    </p>
                </div>

                {/* Bottom - Badge */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: '100px',
                            fontSize: '20px',
                            fontWeight: '600',
                        }}
                    >
                        Freelance Founding Engineer
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
