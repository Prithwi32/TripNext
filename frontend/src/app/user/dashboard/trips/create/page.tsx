"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripForm from "../components/TripForm";
import { CreateTripFormData } from "../types";
import { tripService } from "../api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreateTripPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleCreateTrip = async (data: CreateTripFormData) => {
    try {
      setIsSubmitting(true);
      await tripService.createTrip(data);

      toast.success("Trip created successfully!");

      // Navigate back to trips list
      router.push("/user/dashboard/trips");
    } catch (error) {
      console.error("Failed to create trip:", error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle>Create New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm isSubmitting={isSubmitting} onSubmit={handleCreateTrip} />
        </CardContent>
      </Card>
    </div>
  );
}
