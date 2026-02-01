import type { CommonDictionary } from "@/lib/i18n";

interface FooterProps {
    dict: CommonDictionary;
}

export default function Footer({ dict }: FooterProps) {
    return (
        <footer className="footer">
            <div className="container footer-inner">
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
                    <a href="mailto:rohitguta2432@gmail.com" className="footer-link">
                        Email
                    </a>
                </div>
            </div>
        </footer>
    );
}
