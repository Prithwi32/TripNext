"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Map, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tripService } from "./api";
import { Trip } from "./types";
import TripCard from "./components/TripCard";
import DeleteTripDialog from "./components/DeleteTripDialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Fetch trips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const tripsData = await tripService.getAllTrips();
      setTrips(tripsData);
      setError(null);
    } catch (err) {      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again.");
      toast.error("Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrip = (tripId: string) => {
    router.push(`/user/dashboard/trips/edit/${tripId}`);
  };

  const handleDeleteTrip = (tripId: string) => {
    setDeletingTripId(tripId);
  };

  const confirmDeleteTrip = async () => {
    if (!deletingTripId) return;

    try {
      setIsDeleting(true);
      await tripService.deleteTrip(deletingTripId);      // Update the local state
      setTrips((prevTrips) =>
        prevTrips.filter((trip) => trip._id !== deletingTripId)
      );

      toast.success("Trip deleted successfully");
    } catch (err) {
      console.error("Error deleting trip:", err);
      toast.error("Failed to delete trip. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingTripId(null);
    }
  };
  return (
    <div className="container mx-auto max-w-7xl pb-20 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">
            Manage your travel plans and experiences
          </p>
        </div>
        <Button
          asChild
          className="rounded-full self-start sm:self-center"
          size="sm"
        >
          <Link href="/user/dashboard/trips/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Trip
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            Loading your trips...
          </p>
        </div>
      ) : error ? (
        <Card className="border-destructive/20">
          <CardHeader className="bg-destructive/5 border-b border-destructive/10">
            <CardTitle className="text-destructive flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-destructive"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </div>
              Error Loading Trips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchTrips} variant="outline" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 21h5v-5"></path>
              </svg>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : trips.length === 0 ? (
        <Card className="border-primary/10 bg-gradient-to-br from-background to-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Map className="h-4 w-4 text-primary" />
              </div>
              My Trips
            </CardTitle>
            <CardDescription>
              View all your planned and completed trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No trips found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't created any trips yet. Start planning your
                adventures by creating your first trip.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/user/dashboard/trips/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Trip
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteTripDialog
        isOpen={!!deletingTripId}
        onClose={() => setDeletingTripId(null)}
        onConfirm={confirmDeleteTrip}
        isDeleting={isDeleting}
      />
    </div>
  );
}
