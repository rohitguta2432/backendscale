import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Contact | Rohit Raj",
    description: "Get in touch — Email, LinkedIn, GitHub.",
};

export default function ContactPage() {
    return (
        <>
            <Header />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">Contact</h1>
                        <p className="page-description">
                            Interested in working together or have a question? Reach out.
                        </p>
                    </div>
                </div>

                <section>
                    <div className="container">
                        <div className="contact-card">
                            <div className="contact-list">
                                <div className="contact-item">
                                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    </svg>
                                    <a
                                        href="https://wa.me/918130313297"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-link"
                                    >
                                        +91 81303 13297
                                    </a>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <a href="mailto:rohitguta2432@gmail.com" className="contact-link">
                                        rohitguta2432@gmail.com
                                    </a>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect x="2" y="9" width="4" height="12" />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                    <a
                                        href="https://www.linkedin.com/in/rohitraj2/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-link"
                                    >
                                        linkedin.com/in/rohitraj2
                                    </a>
                                </div>

                                <div className="contact-item">
                                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                    </svg>
                                    <a
                                        href="https://github.com/rohitguta2432"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-link"
                                    >
                                        github.com/rohitguta2432
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
