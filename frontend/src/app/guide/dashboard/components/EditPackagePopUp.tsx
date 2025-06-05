"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Save, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

interface Package {
  _id: string;
  locations: string[];
  packageDescription: string;
  cost: number;
  tripDays: number;
  images: string[];
  createdAt: string;
}

interface EditPackageModalProps {
  package: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedPackage: Package) => void;
}

export function EditPackageModal({
  package: pkg,
  open,
  onOpenChange,
  onUpdate,
}: EditPackageModalProps) {
  const [formData, setFormData] = useState({
    locations: [""],
    packageDescription: "",
    cost: "",
    tripDays: "",
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pkg) {
      setFormData({
        locations: pkg.locations.length > 0 ? pkg.locations : [""],
        packageDescription: pkg.packageDescription,
        cost: pkg.cost.toString(),
        tripDays: pkg.tripDays.toString(),
      });
      setExistingImages(pkg.images || []);
      setNewImages([]);
    }
  }, [pkg]);

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
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    setIsSubmitting(true);

    try {
      const validLocations = formData.locations.filter(
        (loc) => loc.trim() !== ""
      );
      if (validLocations.length === 0) {
        throw new Error("At least one location is required");
      }

      if (!formData.packageDescription.trim()) {
        throw new Error("Package description is required");
      }

      if (
        !formData.cost ||
        isNaN(Number(formData.cost)) ||
        Number(formData.cost) < 0
      ) {
        throw new Error("Valid cost is required");
      }

      if (
        !formData.tripDays ||
        isNaN(Number(formData.tripDays)) ||
        Number(formData.tripDays) < 1
      ) {
        throw new Error("Valid trip duration is required");
      }

      // If we have new images, use FormData
      if (newImages.length > 0) {
        const formDataToSend = new FormData();

        // Ensure locations is properly formatted and non-empty
        const validLocationsString = JSON.stringify(validLocations);
        console.log("Sending locations:", validLocationsString);
        formDataToSend.append("locations", validLocationsString);

        // Add other fields
        formDataToSend.append(
          "packageDescription",
          formData.packageDescription.trim()
        );
        formDataToSend.append("cost", formData.cost.toString());
        formDataToSend.append("tripDays", formData.tripDays.toString());

        // Add existing images if any
        if (existingImages.length > 0) {
          const existingImagesString = JSON.stringify(existingImages);
          console.log("Sending existing images:", existingImagesString);
          formDataToSend.append("existingImages", existingImagesString);
        }

        // Add new images
        newImages.forEach((image) => {
          formDataToSend.append("packageImages", image);
        });

        // Log the complete form data for debugging
        console.log("Form data entries:");
        for (const pair of formDataToSend.entries()) {
          console.log(pair[0], pair[1]);
        }

        try {
          const response = await axiosInstance.patch(
            `/api/package/update/${pkg._id}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const updatedPackage = response.data.data;
          onUpdate(updatedPackage);
          toast.success("Your travel package updated successfully");
          onOpenChange(false);
        } catch (error: any) {
          console.error("Error uploading:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update package";
          toast.error(errorMessage);
          throw error;
        }
      } else {
        // If no new images, send as JSON
        const jsonData = {
          locations: validLocations,
          packageDescription: formData.packageDescription.trim(),
          cost: Number(formData.cost),
          tripDays: Number(formData.tripDays),
          existingImages,
        };

        console.log("Sending JSON data:", jsonData);

        try {
          const response = await axiosInstance.patch(
            `/api/package/update/${pkg._id}`,
            jsonData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const updatedPackage = response.data.data;
          onUpdate(updatedPackage);
          toast.success("Your travel package updated successfully");
          onOpenChange(false);
        } catch (error: any) {
          console.error("Error updating:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update package";
          toast.error(errorMessage);
          throw error;
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update package";
      toast.error(errorMessage);
      console.error("Update error:", error.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pkg) return null;

  const totalImages = existingImages.length + newImages.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogDescription>
            Update your travel package details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Locations</Label>
              <div className="space-y-2 mt-2">
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Package Description</Label>
              <Textarea
                id="edit-description"
                value={formData.packageDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    packageDescription: e.target.value,
                  })
                }
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-cost">Cost (INR)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-days">Trip Duration (Days)</Label>
                <Input
                  id="edit-days"
                  type="number"
                  value={formData.tripDays}
                  onChange={(e) =>
                    setFormData({ ...formData, tripDays: e.target.value })
                  }
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Package Images</Label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Existing Images */}
                {existingImages.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Package image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* New Images */}
                {newImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New package image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Upload Button */}
                {totalImages < 5 && (
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
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Updating..." : "Update Package"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
