"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogService } from "../api";
import { CreateBlogFormData } from "../types";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  Loader2,
  PlusCircle,
  Trash,
  Upload,
  X,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Schema for form validation
const formSchema = z.object({
  blogDescription: z.string().min(10, {
    message: "Blog description must be at least 10 characters long",
  }),
  hashtags: z.array(z.string()),
  blogImages: z
    .any()
    .refine((files) => files?.length > 0, {
      message: "At least one image is required",
    })
    .refine((files) => files?.length <= 5, {
      message: "Maximum of 5 images allowed",
    }),
});

// Type for image preview
interface ImagePreview {
  url: string;
  file: File;
}

export function CreateBlogForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [hashtag, setHashtag] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateBlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blogDescription: "",
      hashtags: [],
    },
  });

  // Function to handle image selection
  const handleImageSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      // Convert FileList to array for easier processing
      const filesArray = Array.from(files);

      // Check if adding these files would exceed the 5 image limit
      if (imagePreviews.length + filesArray.length > 5) {
        toast.error("Maximum of 5 images allowed");
        return;
      }

      // Create image previews and update state
      const newPreviews = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));

      setImagePreviews((prev) => [...prev, ...newPreviews]);

      // Update the form with all files (existing + new)
      const allFiles = new DataTransfer();

      // Add existing files from previews
      imagePreviews.forEach((preview) => {
        allFiles.items.add(preview.file);
      });

      // Add new files
      filesArray.forEach((file) => {
        allFiles.items.add(file);
      });

      form.setValue("blogImages", allFiles.files);
    },
    [imagePreviews, form]
  );

  // Remove an image from previews
  const removeImage = (indexToRemove: number) => {
    // Remove from previews array
    setImagePreviews((prev) => {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(prev[indexToRemove].url);

      const newPreviews = prev.filter((_, i) => i !== indexToRemove);

      // Recreate FileList without the removed image
      const remainingFiles = new DataTransfer();
      newPreviews.forEach((preview) => {
        remainingFiles.items.add(preview.file);
      });

      // Update form with new FileList or null if empty
      if (remainingFiles.files.length > 0) {
        form.setValue("blogImages", remainingFiles.files);
      } else {
        form.setValue("blogImages", undefined);
      }

      return newPreviews;
    });
  };

  // Handle drag and drop for images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleImageSelect(droppedFiles);
    }
  };
  // Color theme options for hashtags
  const hashtagColors = [
    {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      hover: "hover:bg-blue-500/20",
      border: "border-blue-500/20",
    },
    {
      bg: "bg-green-500/10",
      text: "text-green-600",
      hover: "hover:bg-green-500/20",
      border: "border-green-500/20",
    },
    {
      bg: "bg-purple-500/10",
      text: "text-purple-600",
      hover: "hover:bg-purple-500/20",
      border: "border-purple-500/20",
    },
    {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      hover: "hover:bg-amber-500/20",
      border: "border-amber-500/20",
    },
    {
      bg: "bg-pink-500/10",
      text: "text-pink-600",
      hover: "hover:bg-pink-500/20",
      border: "border-pink-500/20",
    },
    {
      bg: "bg-teal-500/10",
      text: "text-teal-600",
      hover: "hover:bg-teal-500/20",
      border: "border-teal-500/20",
    },
  ];

  // Get a color for hashtag based on its content (consistent for same words)
  const getHashtagColor = (tag: string) => {
    // Sum the char codes to get a consistent number for the same string
    const charSum = tag
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return hashtagColors[charSum % hashtagColors.length];
  };

  // Add hashtag
  const handleAddHashtag = () => {
    if (!hashtag.trim()) return;

    const formattedTag = hashtag.trim().startsWith("#")
      ? hashtag.trim().substring(1)
      : hashtag.trim();

    if (!formattedTag) return;

    const currentHashtags = form.getValues("hashtags") || [];

    // Check if hashtag already exists
    if (currentHashtags.includes(formattedTag)) {
      toast.error("This hashtag already exists");
      return;
    }

    form.setValue("hashtags", [...currentHashtags, formattedTag], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setHashtag("");
  };

  // Remove hashtag
  const handleRemoveHashtag = (index: number) => {
    const currentHashtags = [...(form.getValues("hashtags") || [])];
    currentHashtags.splice(index, 1);

    form.setValue("hashtags", currentHashtags, {
      shouldDirty: true,
      shouldTouch: true,
    });

    // Force re-render to reflect changes immediately
    form.trigger("hashtags");
  };

  // Handle form submission
  const onSubmit = async (data: CreateBlogFormData) => {
    try {
      setIsSubmitting(true);
      await blogService.createBlog(data);
      toast.success("Blog created successfully");
      router.push("/user/dashboard/blogs");
    } catch (error) {
      console.error("Failed to create blog", error);
      toast.error("Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-xl bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
        <CardHeader className="bg-muted/30 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-secondary/85"
              asChild
            >
              <Link href="/user/dashboard/blogs">
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Link>
            </Button>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Create Amazing Blog
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload - New Design */}
              <FormField
                control={form.control}
                name="blogImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg flex items-center gap-2 mb-2">
                      <ImagePlus className="h-5 w-5 text-primary" />
                      Travel Pictures (1-5 images)
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Drag & Drop Area */}
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-xl p-8 transition-all duration-200 bg-muted/20 relative flex flex-col items-center justify-center cursor-pointer group",
                            isDraggingOver
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/30 hover:border-primary/50",
                            imagePreviews.length >= 5
                              ? "opacity-50 pointer-events-none"
                              : ""
                          )}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelect(e.target.files)}
                            disabled={imagePreviews.length >= 5}
                          />

                          <Upload
                            className={cn(
                              "h-12 w-12 mb-2 transition-all duration-300 group-hover:scale-110",
                              isDraggingOver
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />

                          <p className="text-center font-medium">
                            {isDraggingOver
                              ? "Drop images here"
                              : "Drag & drop images or click to upload"}
                          </p>
                          <p className="text-center text-sm text-muted-foreground mt-1">
                            {imagePreviews.length >= 5
                              ? "Maximum 5 images reached"
                              : `${imagePreviews.length}/5 images selected`}
                          </p>
                        </div>

                        {/* Image Previews Grid */}
                        {imagePreviews.length > 0 && (
                          <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                          >
                            {imagePreviews.map((preview, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-[4/3] rounded-lg overflow-hidden group border-2 border-muted"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview.url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImage(index);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">
                                      Remove image
                                    </span>
                                  </Button>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
                                  Image {index + 1}
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blog Description - New Design */}
              <FormField
                control={form.control}
                name="blogDescription"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel className="text-lg flex items-center gap-2 mb-2">
                      <PlusCircle className="h-5 w-5 text-primary" />
                      Your Travel Story
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your amazing travel experiences..."
                        className="min-h-[160px] resize-y text-base p-4 shadow-inner focus-visible:ring-primary bg-muted/30 border-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hashtags - New Design */}
              <div className="space-y-3 mt-8 p-5 bg-muted/20 rounded-xl border border-muted/50">
                <FormLabel className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Hashtags
                </FormLabel>
                {/* Hashtag Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add hashtag (e.g. travel, adventure, beach)"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHashtag();
                      }
                    }}
                    className="bg-background/70 border-muted shadow-sm"
                  />
                  <Button
                    type="button"
                    onClick={handleAddHashtag}
                    className="flex-shrink-0 bg-primary/90 hover:bg-primary"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>{" "}
                {/* Hashtag Display */}
                <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
                  {form.watch("hashtags")?.map((tag, index) => {
                    const colorTheme = getHashtagColor(tag);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                      >
                        <Badge
                          variant="secondary"
                          className={cn(
                            "px-3 py-1.5 text-sm font-medium border",
                            colorTheme.bg,
                            colorTheme.text,
                            colorTheme.hover,
                            colorTheme.border
                          )}
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveHashtag(index);
                            }}
                            className={cn(
                              "ml-2 focus:outline-none",
                              colorTheme.text
                            )}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tag}</span>
                          </button>
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button - New Design */}
              <motion.div
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  disabled={isSubmitting || imagePreviews.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your amazing blog...
                    </>
                  ) : (
                    "Share Your Travel Story"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
