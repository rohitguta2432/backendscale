import { ImageResponse } from 'next/og';
import { projects } from '@/data/projects';

export const runtime = 'edge';

export const alt = 'Project - Rohit Raj';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);
    const projectName = project?.name || 'Project';
    const projectDescription = project?.solves || 'Building production-ready AI systems';

    // Determine accent color based on project
    const getAccentColor = (slug: string) => {
        switch (slug) {
            case 'stellarmind':
                return ['#8b5cf6', '#a855f7']; // Purple for AI/SQL
            case 'microitinerary':
                return ['#10b981', '#34d399']; // Green for travel
            default:
                return ['#3b82f6', '#60a5fa']; // Blue default
        }
    };
    const [accentStart, accentEnd] = getAccentColor(slug);

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
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${accentStart}15 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${accentEnd}10 0%, transparent 50%)`,
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
                            background: `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
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

                {/* Center - Project Title */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '24px',
                        maxWidth: '1000px',
                    }}
                >
                    {/* Project Label */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: `linear-gradient(135deg, ${accentStart}30, ${accentEnd}20)`,
                            border: `1px solid ${accentStart}50`,
                            padding: '8px 20px',
                            borderRadius: '100px',
                            color: accentEnd,
                            fontSize: '16px',
                            fontWeight: '500',
                        }}
                    >
                        AI PROJECT
                    </div>

                    {/* Project Name */}
                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: 0,
                            lineHeight: 1.1,
                        }}
                    >
                        {projectName.split('—')[0].trim()}
                    </h1>

                    {/* Subtitle if exists */}
                    {projectName.includes('—') && (
                        <p
                            style={{
                                fontSize: '32px',
                                color: '#a3a3a3',
                                margin: 0,
                            }}
                        >
                            {projectName.split('—')[1]?.trim()}
                        </p>
                    )}

                    {/* Description */}
                    <p
                        style={{
                            fontSize: '22px',
                            color: '#737373',
                            margin: 0,
                            maxWidth: '800px',
                            lineHeight: 1.4,
                        }}
                    >
                        {projectDescription.length > 100
                            ? projectDescription.substring(0, 100) + '...'
                            : projectDescription}
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
                            background: `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
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
