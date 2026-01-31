import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Services from "@/components/Services";
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
        <Credibility />
        <Contact />
      </main>
    </>
  );
}
