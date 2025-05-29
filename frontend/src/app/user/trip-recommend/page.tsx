import Head from "next/head";
import TripRecommendation from "./components/TripRecommendationForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Trip Recommendation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-background text-foreground">
        <TripRecommendation />
      </main>
    </>
  );
}