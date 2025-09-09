import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
