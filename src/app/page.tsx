import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Credibility from "@/components/Credibility";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problems />
        <Services />
        <CaseStudies />
        <Credibility />
        <Contact />
      </main>
    </>
  );
}
