import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <p className="footer-brand">Rohit Raj — Backend & AI Systems</p>
                <div className="footer-links">
                    <a
                        href="https://github.com/rohitguta2432"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com/in/rohitguta2432"
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
