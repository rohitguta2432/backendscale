import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "About | Rohit Raj",
    description: "Rohit Raj — backend + AI systems builder.",
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">About</h1>
                    </div>
                </div>

                <section>
                    <div className="container about-content">
                        <h2 className="about-name">Rohit Raj</h2>
                        <p className="about-bio">
                            Backend and AI systems builder. I work on event-driven architectures,
                            distributed systems, and AI-enabled applications. Most of my work involves
                            making systems that are reliable at scale — Kafka pipelines, caching layers,
                            and the infrastructure that holds everything together.
                        </p>
                        <p className="about-bio" style={{ marginTop: "1rem" }}>
                            I document what I build because engineering work is often invisible.
                            This site is a living record of problems I&apos;ve solved, decisions I&apos;ve made,
                            and things I&apos;m still figuring out.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
