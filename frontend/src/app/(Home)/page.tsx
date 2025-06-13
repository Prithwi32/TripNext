import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import Destinations from "./components/Destinations";
import StatsBanner from "./components/StatsBanner";
import FloatingElements from "./components/FloatingElements";
import FeatureShowcase from "./components/FeatureShowcase";
import Testimonials from "./components/Testimonials";
import ScrollEffect from "./components/ScrollEffect";
import CallToAction from "./components/CallToAction";

export default function Home() {
  return (
    <>
      <FloatingElements />
      <ScrollEffect />
      <main className="min-h-screen">
        <Hero />
        <div className="container mx-auto px-4 -mt-8 sm:-mt-16 relative z-20">
          <SearchBar />
        </div>
        <StatsBanner />
        <Destinations />
        <FeatureShowcase />
        <Testimonials />
        <CallToAction />
      </main>
    </>
  );
}