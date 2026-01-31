import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Services from "@/components/Services";
import Credibility from "@/components/Credibility";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Problems />
      <Services />
      <Credibility />
      <Contact />
    </main>
  );
}
