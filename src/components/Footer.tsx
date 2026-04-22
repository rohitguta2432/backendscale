import type { CommonDictionary, Locale } from "@/lib/i18n";
import SubscribeForm from "./SubscribeForm";

interface FooterProps {
    dict: CommonDictionary;
    locale: Locale;
}

export default function Footer({ dict, locale }: FooterProps) {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-content">
                    <div className="footer-main">
                        <p className="footer-brand">{dict.footer.brand}</p>
                        <div className="footer-links">
                            <a
                                href="https://wa.me/918130313297"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                WhatsApp
                            </a>
                            <a
                                href="https://github.com/rohitguta2432"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://www.linkedin.com/in/rohitraj2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                LinkedIn
                            </a>
                            <a href="mailto:rohitgupta2432@gmail.com" className="footer-link">
                                Email
                            </a>
                        </div>
                    </div>

                    <div className="footer-services mb-6">
                        <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-3">Services</p>
                        <div className="footer-links">
                            <a href={`/${locale}/services/mobile-app-development`} className="footer-link">
                                Mobile App Development
                            </a>
                            <a href={`/${locale}/services/ai-chatbot-development`} className="footer-link">
                                AI Chatbot Development
                            </a>
                            <a href={`/${locale}/services/full-stack-development`} className="footer-link">
                                Full-Stack Development
                            </a>
                        </div>
                    </div>

                    <div className="footer-subscribe">
                        <p className="footer-subscribe-title">{dict.subscribe?.title || 'Get Updates'}</p>
                        <SubscribeForm
                            locale={locale}
                            translations={{
                                placeholder: dict.subscribe?.placeholder || 'Enter your email',
                                button: dict.subscribe?.button || 'Subscribe',
                                success: dict.subscribe?.success || 'Thanks for subscribing!',
                                error: dict.subscribe?.error || 'Something went wrong. Try again.',
                            }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
