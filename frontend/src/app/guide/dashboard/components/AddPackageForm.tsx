"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, MapPin, Calendar, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";

export function AddPackageSection() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    locations: [""],
    packageDescription: "",
    cost: "",
    tripDays: "",
    images: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [...formData.locations, ""],
    });
  };

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter((_, i) => i !== index),
    });
  };

  const updateLocation = (index: number, value: string) => {
    const newLocations = [...formData.locations];
    newLocations[index] = value;
    setFormData({
      ...formData,
      locations: newLocations,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      images: [...formData.images, ...files].slice(0, 5), // Max 5 images
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a package");
      }

      // Validate form
      const validLocations = formData.locations.filter(
        (loc) => loc.trim() !== ""
      );
      if (validLocations.length === 0) {
        throw new Error("At least one location is required");
      }
      if (!formData.packageDescription.trim()) {
        throw new Error("Package description is required");
      }
      if (!formData.cost || isNaN(Number(formData.cost))) {
        throw new Error("Valid cost is required");
      }
      if (!formData.tripDays || isNaN(Number(formData.tripDays))) {
        throw new Error("Valid trip days is required");
      }
      if (formData.images.length === 0) {
        throw new Error("At least one image is required");
      }

      // Create FormData for API call
      const apiFormData = new FormData();
      apiFormData.append("locations", JSON.stringify(validLocations));
      apiFormData.append("packageDescription", formData.packageDescription);
      apiFormData.append("cost", formData.cost);
      apiFormData.append("tripDays", formData.tripDays);
      apiFormData.append("guide", session.user.id);

      // Append each image file with the same field name
      formData.images.forEach((image) => {
        apiFormData.append("packageImages", image);
      });

      // Make API call to create package using axios instance
      const { data } = await axiosInstance.post(
        "/api/package/create-package",
        apiFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form on success
      setFormData({
        locations: [""],
        packageDescription: "",
        cost: "",
        tripDays: "",
        images: [],
      });

      toast.success(data.message || "Package created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create package. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Package</h1>
        <p className="text-muted-foreground">
          Create a new travel package for your clients
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Locations
                </CardTitle>
                <CardDescription>
                  Add the destinations included in this package
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.locations.map((location, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Location ${index + 1}`}
                      value={location}
                      onChange={(e) => updateLocation(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.locations.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeLocation(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLocation}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Location
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Description</CardTitle>
                <CardDescription>
                  Describe what makes this package special
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter a detailed description of your travel package..."
                  value={formData.packageDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packageDescription: e.target.value,
                    })
                  }
                  rows={6}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Package Images
                </CardTitle>
                <CardDescription>
                  Upload up to 5 images (max 5MB each)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Package image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="aspect-video border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Image
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Package Cost (INR)</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="2500"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tripDays" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Trip Duration (Days)
                  </Label>
                  <Input
                    id="tripDays"
                    type="number"
                    placeholder="10"
                    value={formData.tripDays}
                    onChange={(e) =>
                      setFormData({ ...formData, tripDays: e.target.value })
                    }
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Locations:</span>
                  <Badge variant="secondary">
                    {
                      formData.locations.filter((loc) => loc.trim() !== "")
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{formData.tripDays || "0"} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cost:</span>
                  <span>${formData.cost || "0"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Images:</span>
                  <span>{formData.images.length}/5</span>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? "Creating Package..." : "Create Package"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
