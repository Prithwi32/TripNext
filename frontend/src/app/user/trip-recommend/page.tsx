import { Metadata } from "next";
import TripRecommendation from "./components/TripRecommendationForm";
import { MountainSnow } from "lucide-react";

export const metadata: Metadata = {
  title: "Trip Recommendations | TripNext",
  description:
    "Get personalized travel recommendations based on your preferences",
};

export default function TripRecommendPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="flex items-center flex-wrap justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3 mr-3">
            <MountainSnow className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trip Recommendations
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized travel suggestions based on your preferences. Let us
          help you discover your perfect destination.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <TripRecommendation />
      </div>
    </div>
  );
}
