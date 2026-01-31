import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIProjects from "@/components/AIProjects";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <AIProjects />
      </main>
      <Footer />
    </>
  );
}
