import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ProjectGrid from "@/components/ProjectGrid";
import Timeline from "@/components/Timeline";
import CertificateGrid from "@/components/CertificateGrid";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <ProjectGrid />
      <Timeline />
      <CertificateGrid />
      <ContactForm />
    </main>
  );
}
