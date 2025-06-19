"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateTripFormData, Trip, UpdateTripFormData } from "../types";
import {
  Loader2,
  X,
  Plus,
  Map,
  Calendar,
  Tag,
  Upload,
  CreditCard,
  CircleDollarSign,
  User,
} from "lucide-react";
import GuideSelect from "./GuideSelect";
import { Card, CardContent } from "@/components/ui/card";

// Define the schema for the trip form
const tripFormSchema = z.object({
  tripLocation: z.string().min(3, {
    message: "Trip location must be at least 3 characters.",
  }),
  tripDescription: z.string().min(20, {
    message: "Trip description must be at least 20 characters.",
  }),
  cost: z.coerce.number().positive({
    message: "Trip cost must be a positive number.",
  }),
  hashtags: z.array(z.string()),
  guide: z.string().nullable(),
  tripImage: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        return Array.from(files).every((file) =>
          ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
        );
      },
      {
        message: "Only JPG, PNG and WebP formats are supported.",
      }
    ),
});

interface TripFormProps {
  initialData?: Trip;
  isSubmitting: boolean;
  onSubmit: (data: CreateTripFormData | UpdateTripFormData) => void;
}

export default function TripForm({
  initialData,
  isSubmitting,
  onSubmit,
}: TripFormProps) {
  const [hashtagInput, setHashtagInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  type FormValues = z.infer<typeof tripFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: initialData
      ? {
          tripLocation: initialData.tripLocation,
          tripDescription: initialData.tripDescription,
          cost: initialData.cost,
          hashtags: initialData.hashtags,
          guide: initialData.guide,
        }
      : {
          tripLocation: "",
          tripDescription: "",
          cost: 0,
          hashtags: [],
          guide: null,
        },
  });

  useEffect(() => {
    // If initialData has tripImages, create preview URLs
    if (initialData?.tripImages) {
      setPreviewUrls(initialData.tripImages);
    }
  }, [initialData]);

  const handleAddHashtag = () => {
    if (!hashtagInput.trim()) return;

    const currentHashtags = form.getValues("hashtags") || [];
    const hashtag = hashtagInput.trim().replace(/\s+/g, "-"); // Replace spaces with dashes

    if (!currentHashtags.includes(hashtag)) {
      form.setValue("hashtags", [...currentHashtags, hashtag]);
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    const currentHashtags = form.getValues("hashtags") || [];
    form.setValue(
      "hashtags",
      currentHashtags.filter((t) => t !== tag)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Combine with existing selected files
      const allFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(allFiles);

      // Create preview URLs for the new files and combine with existing
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newUrls]);

      // Create a new FileList-like object with all files
      const dataTransfer = new DataTransfer();
      allFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });

      // Set the combined files to the form
      form.setValue("tripImage", dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    // Release the object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);

    // Create a new FileList-like object
    const dataTransfer = new DataTransfer();
    newSelectedFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });

    form.setValue(
      "tripImage",
      dataTransfer.files.length > 0 ? dataTransfer.files : undefined
    );
  };

  const onFormSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    onSubmit(values as CreateTripFormData | UpdateTripFormData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="space-y-6 max-w-6xl mx-auto"
      >
        {" "}
        <div className="text-2xl font-bold mb-6">
          {initialData ? "Update Trip Memory" : "Add New Trip Memory"}
          <p className="text-base font-normal text-muted-foreground mt-1">
            {initialData
              ? "Update details of your past travel experience"
              : "Share the memories from your recent travel experience"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Card */}
          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <Map className="h-5 w-5 text-primary" />
                <h3>Destination</h3>
              </div>
              <FormField
                control={form.control}
                name="tripLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g., Paris, France"
                        {...field}
                        className="bg-background/50 border border-input/50 focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription>
                      Where did you travel to for this memory?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Cost & Duration Card */}
          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                <h3>Trip Cost</h3>
              </div>
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Spent (INR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="bg-background/50 border border-input/50 focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription>
                      How much did you spend on this trip?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card className="overflow-hidden border shadow-sm md:col-span-2">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <Calendar className="h-5 w-5 text-primary" />
                <h3>Your Experience</h3>
              </div>
              <FormField
                control={form.control}
                name="tripDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Share your travel experience, places visited, and memorable highlights..."
                        className="min-h-[120px] bg-background/50 border border-input/50 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell us about your journey and what made it memorable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Guide Selection Card */}
          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <User className="h-5 w-5 text-primary" />
                <h3>Travel Guide</h3>
              </div>
              <FormField
                control={form.control}
                name="guide"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <GuideSelect
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Did a guide help you on this trip? (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Hashtags Card */}
          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <Tag className="h-5 w-5 text-primary" />
                <h3>Hashtags</h3>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add hashtags (e.g., adventure, beach)"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-background/50 border border-input/50 focus:border-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddHashtag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription className="mt-2">
                Add relevant hashtags to categorize your trip
              </FormDescription>
              {form.watch("hashtags") && form.watch("hashtags").length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.watch("hashtags").map((tag, index) => {
                    // Generate different colors based on the tag content
                    const colorSchemes = [
                      {
                        bg: "bg-blue-100",
                        text: "text-blue-700",
                        hover: "hover:text-blue-800",
                      },
                      {
                        bg: "bg-green-100",
                        text: "text-green-700",
                        hover: "hover:text-green-800",
                      },
                      {
                        bg: "bg-purple-100",
                        text: "text-purple-700",
                        hover: "hover:text-purple-800",
                      },
                      {
                        bg: "bg-amber-100",
                        text: "text-amber-700",
                        hover: "hover:text-amber-800",
                      },
                      {
                        bg: "bg-rose-100",
                        text: "text-rose-700",
                        hover: "hover:text-rose-800",
                      },
                      {
                        bg: "bg-teal-100",
                        text: "text-teal-700",
                        hover: "hover:text-teal-800",
                      },
                      {
                        bg: "bg-indigo-100",
                        text: "text-indigo-700",
                        hover: "hover:text-indigo-800",
                      },
                      {
                        bg: "bg-cyan-100",
                        text: "text-cyan-700",
                        hover: "hover:text-cyan-800",
                      },
                    ];

                    // Determine color based on the hash of the tag string
                    const hashCode = tag
                      .split("")
                      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const colorIndex = hashCode % colorSchemes.length;
                    const colorScheme = colorSchemes[colorIndex];

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-1 ${colorScheme.bg} ${colorScheme.text} px-3 py-1.5 rounded-full text-sm font-medium transition-colors`}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveHashtag(tag)}
                          className={`${colorScheme.text}/70 ${colorScheme.hover} ml-1.5`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Images Card */}
          {!initialData && (
            <Card className="overflow-hidden border shadow-sm md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                  <Upload className="h-5 w-5 text-primary" />
                  <h3>Trip Images</h3>
                </div>
                <div className="border border-dashed border-input p-6 rounded-md text-center bg-muted/30">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    id="tripImage"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="tripImage"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="bg-primary/10 rounded-full p-3 mb-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-base font-medium">
                      Click to upload images
                    </span>{" "}
                    <span className="text-sm text-muted-foreground mt-1">
                      Upload your trip photos (JPG, PNG, JPEG up to 5MB each)
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {previewUrls.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mt-5 mb-3">
                      <p className="text-sm font-medium">
                        {previewUrls.length} image
                        {previewUrls.length !== 1 ? "s" : ""} selected
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("tripImage")?.click()
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add more
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden aspect-square border border-input/50"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="bg-white text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {form.formState.errors.tripImage && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.tripImage.message}
                  </p>
                )}

                {!previewUrls.length && form.formState.isSubmitted && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    Please upload at least one image for your trip
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        {/* Trip Summary & Submit Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden border shadow-sm md:col-span-2">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3>Trip Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Destination:</p>
                  <p className="font-medium">
                    {form.watch("tripLocation") || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Spent:</p>
                  <p className="font-medium">₹{form.watch("cost") || "0"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Photos Added:</p>
                  <p className="font-medium">{previewUrls.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full text-base py-6"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating Trip..." : "Creating Trip..."}
                </>
              ) : (
                <>{initialData ? "Update Trip" : "Create Trip"}</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
