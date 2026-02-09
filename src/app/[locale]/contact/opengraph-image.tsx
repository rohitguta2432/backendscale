import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Contact Rohit Raj - Freelance Founding Engineer';
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
                    backgroundImage: 'radial-gradient(circle at 25% 25%, #10b98115 0%, transparent 50%), radial-gradient(circle at 75% 75%, #34d39910 0%, transparent 50%)',
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
                            background: 'linear-gradient(135deg, #10b981, #34d399)',
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
                            background: 'linear-gradient(135deg, #10b98130, #34d39920)',
                            border: '1px solid #10b98150',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            color: '#34d399',
                            fontSize: '16px',
                            fontWeight: '500',
                        }}
                    >
                        GET IN TOUCH
                    </div>
                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            margin: 0,
                            lineHeight: 1.1,
                            background: 'linear-gradient(135deg, #ffffff 0%, #6ee7b7 50%, #34d399 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Let&apos;s Build Together
                    </h1>
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#a3a3a3',
                            margin: 0,
                            maxWidth: '800px',
                        }}
                    >
                        Hire a founding engineer for your next AI-powered product
                    </p>
                </div>

                {/* Bottom - Badges */}
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
                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: '100px',
                            fontSize: '20px',
                            fontWeight: '600',
                        }}
                    >
                        Available for Projects
                    </div>
                    <div
                        style={{
                            border: '2px solid #404040',
                            color: '#a3a3a3',
                            padding: '10px 24px',
                            borderRadius: '100px',
                            fontSize: '18px',
                        }}
                    >
                        WhatsApp · Email · LinkedIn
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
