import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import Destinations from "./components/Destinations";
import StatsBanner from "./components/StatsBanner";
import FloatingElements from "./components/FloatingElements";
import FeatureShowcase from "./components/FeatureShowcase";
import ScrollEffect from "./components/ScrollEffect";
import CallToAction from "./components/CallToAction";
import World from "./components/GlobeSection"
import InteractiveGallery from "./components/InteractiveGallery";

export default function Home() {
  return (
    <>
      <FloatingElements />
      <ScrollEffect />
      <Hero />
      <div className="container mx-auto px-4 -mt-8 sm:-mt-16 relative z-20">
        <SearchBar />
      </div>
      <StatsBanner />
      <Destinations />
      <FeatureShowcase />
      <World
        globeConfig={{
          globeColor: "#010B36",
          atmosphereColor: "#5DD6FE",
          polygonColor: "rgba(0,100,255,0.7)",
          autoRotate: true,
          emissiveIntensity: 0.8,
        }}
        data={[]}
      />
      <CallToAction />
    </>
  );
}
