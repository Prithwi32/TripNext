"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";
import TripForm from "../../components/TripForm";
import { Trip, UpdateTripFormData } from "../../types";
import { tripService } from "../../api";

interface EditTripPageProps {
  params: {
    tripId: string;
  };
}

export default function EditTripPage({ params }: EditTripPageProps) {
  const { tripId } = params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setIsLoading(true);
        const tripData = await tripService.getTripById(tripId);
        setTrip(tripData);
        setError(null);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("Failed to load trip details. Please try again.");
        toast.error("Failed to load trip details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);
  const handleUpdateTrip = async (data: UpdateTripFormData) => {
    try {
      setIsSubmitting(true);
      await tripService.updateTrip(tripId, data);

      toast.success("Trip updated successfully!");

      // Navigate back to trips list
      router.push("/user/dashboard/trips");
    } catch (error) {
      console.error("Failed to update trip:", error);
      toast.error("Failed to update trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto max-w-4xl pb-20">
        <Card>
          <CardContent className="text-center p-12">
            <h3 className="text-lg font-medium mb-2 text-destructive">Error</h3>
            <p className="text-muted-foreground">{error || "Trip not found"}</p>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="mr-2"
              >
                Go Back
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user/dashboard/trips">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm
            initialData={trip}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateTrip}
          />
        </CardContent>
      </Card>
    </div>
  );
}
