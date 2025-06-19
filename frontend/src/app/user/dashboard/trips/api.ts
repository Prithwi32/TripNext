import { axiosInstance } from "@/lib/axios";
import { CreateTripFormData, Guide, Trip, UpdateTripFormData } from "./types";

export const tripService = {
  // Create a new trip
  async createTrip(tripData: CreateTripFormData): Promise<Trip> {
    const formData = new FormData();
    formData.append("tripLocation", tripData.tripLocation);
    formData.append("tripDescription", tripData.tripDescription);
    formData.append("cost", tripData.cost.toString());

    // Add hashtags as an array
    tripData.hashtags.forEach((tag) => {
      formData.append("hashtags", tag);
    });

    // Add guide if present
    if (tripData.guide) {
      formData.append("guide", tripData.guide);
    } // Add images if present
    if (tripData.tripImage && tripData.tripImage.length > 0) {
      Array.from(tripData.tripImage).forEach((file) => {
        formData.append("tripImages", file);
      });
    }

    const response = await axiosInstance.post(
      "/api/trip/create-trip",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },

  // Update an existing trip
  async updateTrip(
    tripId: string,
    tripData: UpdateTripFormData
  ): Promise<Trip> {
    const response = await axiosInstance.patch(
      `/api/trip/update/${tripId}`,
      tripData
    );
    return response.data.data;
  },

  // Get all trips
  async getAllTrips(): Promise<Trip[]> {
    const response = await axiosInstance.get("/api/trip/");
    return response.data.data;
  },

  // Get a specific trip by ID
  async getTripById(tripId: string): Promise<Trip> {
    const response = await axiosInstance.get(`/api/trip/${tripId}`);
    return response.data.data;
  },

  // Delete a trip
  async deleteTrip(tripId: string): Promise<void> {
    await axiosInstance.delete(`/api/trip/delete/${tripId}`);
  },

  // Get all guides
  async getAllGuides(): Promise<Guide[]> {
    const response = await axiosInstance.get("/api/guide/");
    return response.data.data;
  },
};
