"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trip } from "../types";
import { tripService } from "../api";
import toast from "react-hot-toast";
import DeleteTripDialog from "../components/DeleteTripDialog";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  Tag,
  IndianRupee,
  Mail,
  Star,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface TripDetailsPageProps {
  params: {
    tripId: string;
  };
}

export default function TripDetailsPage({ params }: TripDetailsPageProps) {
  const { tripId } = params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await tripService.deleteTrip(tripId);

      toast.success("Trip deleted successfully!");

      // Navigate back to trips list
      router.push("/user/dashboard/trips");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl pb-20 flex flex-col justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Loading trip details...
        </p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto max-w-4xl pb-20">
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
              Error Loading Trip
            </CardTitle>
            <CardDescription>
              We encountered a problem while loading your trip details
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground mb-6">
              {error ||
                "Trip not found. It may have been deleted or you may not have permission to view it."}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="gap-2"
              >
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
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl pb-20">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/user/dashboard/trips">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/user/dashboard/trips/edit/${tripId}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{trip.tripLocation}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-base">
                <MapPin className="h-4 w-4" />
                {trip.tripLocation}
              </CardDescription>
            </CardHeader>

            {/* Bento Grid for Images */}
            <CardContent>
              <div
                className={`grid gap-4 ${
                  trip?.tripImages?.length > 1
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {trip?.tripImages?.length > 0 && (
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden col-span-1 md:col-span-2 row-span-2">
                    <Image
                      src={trip.tripImages[0]}
                      alt={`${trip.tripLocation} - Featured Image`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {trip?.tripImages?.length > 1 &&
                  trip.tripImages
                    .slice(1, 5)
                    .map((image: string, index: number) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-lg overflow-hidden ${
                          index === 0 && trip.tripImages.length === 2
                            ? "md:col-span-2"
                            : ""
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${trip.tripLocation} - Image ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}

                {trip?.tripImages?.length > 5 && (
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={trip.tripImages[5]}
                      alt={`${trip.tripLocation} - Image 6`}
                      fill
                      className="object-cover brightness-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl">
                      +{trip.tripImages.length - 5} more
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>{" "}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Essential information about your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  Trip Cost
                </h3>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-primary">
                    ₹{trip.cost}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    overall
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {trip.tripDescription}
                </p>
              </div>

              {trip?.hashtags?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.hashtags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 hover:bg-secondary/80 transition-colors cursor-default"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>{" "}
        <div className="space-y-6">
          {" "}
          <Card>
            <CardHeader>
              <CardTitle>Trip Summary</CardTitle>
              <CardDescription>At a glance details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/40 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">Trip Information</span>
                </div>
                <p className="text-sm text-muted-foreground ml-7">
                  Created on {formatDate(new Date(trip.createdAt))}
                </p>
                <p className="text-sm text-muted-foreground ml-7">
                  Last updated on {formatDate(new Date(trip.updatedAt))}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Location</span>
                </div>
                <span className="font-medium">{trip.tripLocation}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span>Cost</span>
                </div>
                <Badge variant="outline" className="text-lg font-semibold">
                  ₹{trip.cost}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {/* Guide Information Card */}
          {trip.guideDetails ? (
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Your Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col items-center text-center mb-3">
                  <Avatar className="h-20 w-20 mb-4 border-2 border-primary/20">
                    <AvatarImage
                      src={trip.guideDetails.profileImage}
                      alt={trip.guideDetails.guideName}
                    />
                    <AvatarFallback className="text-xl">
                      {trip.guideDetails.guideName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-medium">
                    {trip.guideDetails.guideName}
                  </h3>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center gap-2 text-sm mt-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{trip.guideDetails.guideEmail}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-secondary"
                >
                  <User className="h-4 w-4 mr-2" />
                  Contact Guide
                </Button>
              </CardFooter>
            </Card>
          ) : trip.guide ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Guide assigned (Loading details...)</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    No guide assigned for this trip
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DeleteTripDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
