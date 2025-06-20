"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import Image from "next/image";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { blogService } from "../api";
import { Blog, UpdateBlogFormData } from "../types";
import {
  ArrowLeft,
  Loader2,
  PlusCircle,
  Trash,
  X,
  ImagePlus,
  Camera,
  Tag,
  Save,
  RotateCcw,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Schema for form validation
const formSchema = z.object({
  blogTitle: z
    .string()
    .min(5, {
      message: "Blog title must be at least 5 characters long",
    })
    .max(100, {
      message: "Blog title must not exceed 100 characters",
    }),
  blogDescription: z.string().min(10, {
    message: "Blog description must be at least 10 characters long",
  }),
  hashtags: z.array(z.string()),
  imageUrls: z.array(z.string()),
  blogImages: z
    .any()
    .optional()
    .refine(
      (files) => {
        // If no files and no imageUrls, require at least one image
        if (!files?.length) return true; // We'll check the combined total later
        return files.length <= 5; // Maximum of 5 images allowed
      },
      {
        message: "Maximum of 5 images allowed",
      }
    ),
});

interface EditBlogFormProps {
  blogId: string;
}

export function EditBlogForm({ blogId }: EditBlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviewUrls, setNewImagePreviewUrls] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState("");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [tagColors] = useState<string[]>([
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<UpdateBlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blogTitle: "",
      blogDescription: "",
      hashtags: [],
      imageUrls: [],
    },
  });

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const blogData = await blogService.getBlogById(blogId);

        setBlog(blogData); // Set form values
        form.setValue("blogTitle", blogData.blogTitle || ""); // Handle blogs without title
        form.setValue("blogDescription", blogData.blogDescription);
        form.setValue("hashtags", blogData.hashtags);
        form.setValue("imageUrls", blogData.blogImages);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch blog", error);
        toast.error("Failed to load blog data");
        router.push("/user/dashboard/blogs");
      }
    };

    fetchBlog();
  }, [blogId, form, router]); // Handle image file selection
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Check the total number of images (existing + new)
      const currentImageCount =
        form.getValues("imageUrls").length + newImageFiles.length;
      const newFilesArray = Array.from(files);
      const totalImagesAfterAddition = currentImageCount + newFilesArray.length;

      // If total would exceed 5, show error and add only what fits
      if (totalImagesAfterAddition > 5) {
        toast.error(
          `You can only have a maximum of 5 images. Adding ${
            5 - currentImageCount
          } more.`
        );

        // Only add images up to the limit
        const availableSlots = Math.max(0, 5 - currentImageCount);
        const filesToAdd = newFilesArray.slice(0, availableSlots);

        if (filesToAdd.length === 0) return; // No slots available

        // Generate preview URLs only for the files we're actually adding
        const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

        // Update state with only the files we can add
        const updatedFiles = [...newImageFiles, ...filesToAdd];
        setNewImageFiles(updatedFiles);
        setNewImagePreviewUrls((prev) => [...prev, ...newUrls]);

        // Set the files in form
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        form.setValue("blogImages", dataTransfer.files);
      } else {
        // If we're within the limit, add all files
        const updatedFiles = [...newImageFiles, ...newFilesArray];

        // Generate preview URLs for new files
        const newUrls = newFilesArray.map((file) => URL.createObjectURL(file));

        // Update state
        setNewImageFiles(updatedFiles);
        setNewImagePreviewUrls((prev) => [...prev, ...newUrls]);

        // Set the files in form
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        form.setValue("blogImages", dataTransfer.files);
      }

      // Clear file input value to allow selecting the same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [newImageFiles, form]
  );

  // Remove existing image
  const removeExistingImage = (index: number) => {
    const currentImages = form.getValues("imageUrls");
    form.setValue(
      "imageUrls",
      currentImages.filter((_, i) => i !== index)
    );
  };

  // Remove newly added image
  const removeNewImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newImagePreviewUrls[index]);

    // Remove the file and preview URL from state
    const updatedFiles = [...newImageFiles];
    updatedFiles.splice(index, 1);

    const updatedUrls = [...newImagePreviewUrls];
    updatedUrls.splice(index, 1);

    setNewImageFiles(updatedFiles);
    setNewImagePreviewUrls(updatedUrls);

    // Update the form value
    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => dataTransfer.items.add(file));
    form.setValue(
      "blogImages",
      updatedFiles.length ? dataTransfer.files : undefined
    );
  };

  // Clear all newly added images
  const clearAllNewImages = () => {
    // Revoke all object URLs
    newImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Clear state
    setNewImageFiles([]);
    setNewImagePreviewUrls([]);

    // Clear form value
    form.setValue("blogImages", undefined);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  // Get a random color for a hashtag
  const getTagColor = useCallback(
    (index: number) => {
      return tagColors[index % tagColors.length];
    },
    [tagColors]
  );

  // Add hashtag
  const handleAddHashtag = useCallback(() => {
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

    form.setValue("hashtags", [...currentHashtags, formattedTag]);
    setHashtag("");
  }, [hashtag, form]);
  // Remove hashtag
  const handleRemoveHashtag = useCallback(
    (index: number) => {
      const currentHashtags = form.getValues("hashtags") || [];
      const tagToRemove = currentHashtags[index];

      // Create a new array without the removed tag
      const updatedHashtags = [...currentHashtags];
      updatedHashtags.splice(index, 1);

      // Update form state
      form.setValue("hashtags", updatedHashtags, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Show success toast
      toast.success(`Removed hashtag #${tagToRemove}`);
    },
    [form]
  );
  // Handle form submission
  const onSubmit = async (data: UpdateBlogFormData) => {
    try {
      setIsSubmitting(true);

      // Validate that there's at least one image (either existing or new)
      if (
        data.imageUrls.length === 0 &&
        (!data.blogImages || data.blogImages.length === 0)
      ) {
        toast.error("Please add at least one image");
        setIsSubmitting(false);
        return;
      }

      // Create a new FormData and add the blogImages from our state
      const submitData: UpdateBlogFormData = {
        ...data,
      };

      // If we have new images, create the proper FileList-like object
      if (newImageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        newImageFiles.forEach((file) => dataTransfer.items.add(file));
        submitData.blogImages = dataTransfer.files;
      }

      await blogService.updateBlog(blogId, submitData);
      toast.success("Blog updated successfully");
      router.push("/user/dashboard/blogs");
    } catch (error) {
      console.error("Failed to update blog", error);
      toast.error("Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !blog) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 rounded-full"
            asChild
          >
            <Link href="/user/dashboard/blogs">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-1">Back</span>
            </Link>
          </Button>
          <CardTitle className="flex items-center">
            <span className="bg-primary/10 p-1.5 rounded-full mr-2">
              <PlusCircle className="h-5 w-5 text-primary" />
            </span>
            Edit Blog
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Blog Title Field */}
            <FormField
              control={form.control}
              name="blogTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg flex items-center gap-2 mb-2">
                    <PlusCircle className="h-5 w-5 text-primary" />
                    Blog Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a captivating title for your travel story"
                      className="py-6 text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Section */}
            <div className="space-y-6">
              {" "}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Images</h3>
                <div className="flex items-center">
                  {form.watch("imageUrls").length + newImageFiles.length >=
                    4 && (
                    <span
                      className={`text-xs px-2 py-1 rounded mr-2 ${
                        form.watch("imageUrls").length +
                          newImageFiles.length ===
                        5
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
                      }`}
                    >
                      {form.watch("imageUrls").length + newImageFiles.length ===
                      5
                        ? "Max limit reached"
                        : "Almost at limit"}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {form.watch("imageUrls").length + newImageFiles.length} of 5
                    images
                  </p>
                </div>
              </div>
              {/* Existing Images */}
              <FormField
                control={form.control}
                name="imageUrls"
                render={() => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel className="flex items-center text-sm font-medium">
                        <Camera className="h-4 w-4 mr-1.5" />
                        Current Images
                        {form.getValues("imageUrls").length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {form.getValues("imageUrls").length}
                          </Badge>
                        )}
                      </FormLabel>

                      <FormControl>
                        <>
                          {form.getValues("imageUrls").length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                              {form.getValues("imageUrls").map((url, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="relative aspect-square rounded-md overflow-hidden group border"
                                >
                                  <div className="w-full h-full relative">
                                    <Image
                                      src={url}
                                      alt={`Image ${index + 1}`}
                                      className="object-cover transition-transform group-hover:scale-105"
                                      fill
                                      sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                  </div>
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeExistingImage(index)}
                                      className="rounded-full h-8 w-8"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="border border-dashed rounded-md bg-muted/30 p-6 text-center">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <Camera className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  No images currently added
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {/* New Image Upload */}
              <FormField
                control={form.control}
                name="blogImages"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel className="flex items-center text-sm font-medium">
                        <ImagePlus className="h-4 w-4 mr-1.5" />
                        Add New Images
                        {newImageFiles.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {newImageFiles.length}
                          </Badge>
                        )}
                      </FormLabel>

                      <FormControl>
                        <div className="flex flex-col space-y-4">
                          {" "}
                          <div
                            className={`border border-dashed rounded-md transition-colors p-6 ${
                              form.watch("imageUrls").length +
                                newImageFiles.length >=
                              5
                                ? "bg-muted/10 opacity-60 cursor-not-allowed"
                                : "bg-muted/30 hover:bg-muted/50 cursor-pointer"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                disabled={
                                  form.watch("imageUrls").length +
                                    newImageFiles.length >=
                                  5
                                }
                                {...(() => {
                                  const { ref, onChange, ...rest } = field;
                                  return rest;
                                })()}
                              />
                              <label
                                htmlFor="image-upload"
                                className={`flex flex-col items-center justify-center w-full ${
                                  form.watch("imageUrls").length +
                                    newImageFiles.length >=
                                  5
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer"
                                }`}
                              >
                                <Upload
                                  className={`h-8 w-8 ${
                                    form.watch("imageUrls").length +
                                      newImageFiles.length >=
                                    5
                                      ? "text-muted-foreground"
                                      : "text-primary"
                                  }`}
                                />
                                <p className="mt-2 text-sm font-medium text-center">
                                  {form.watch("imageUrls").length +
                                    newImageFiles.length >=
                                  5
                                    ? "Maximum images reached (5)"
                                    : "Click to upload new images"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG, JPEG up to 5 images total
                                </p>
                              </label>
                            </div>
                          </div>
                          {/* New Image Previews */}
                          {newImagePreviewUrls.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  New Images Preview
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={clearAllNewImages}
                                  className="h-8 px-2 text-xs"
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Clear all
                                </Button>
                              </div>

                              <motion.div
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {newImagePreviewUrls.map((url, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: index * 0.05,
                                    }}
                                    className="relative aspect-square rounded-md overflow-hidden group border"
                                  >
                                    <div className="w-full h-full relative">
                                      <Image
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="object-cover transition-transform group-hover:scale-105"
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                      />
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeNewImage(index)}
                                        className="rounded-full h-8 w-8"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Image requirement warning */}
            {form.getValues("imageUrls").length === 0 &&
              newImageFiles.length === 0 && (
                <div className="p-3 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/30 rounded-md">
                  <p className="text-amber-800 dark:text-amber-200 text-sm flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    At least one image is required for your blog
                  </p>
                </div>
              )}

            {/* Blog Description */}
            <FormField
              control={form.control}
              name="blogDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium">
                    <span className="flex h-5 w-5 rounded-full items-center justify-center bg-primary/10 mr-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    Blog Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your travel experience..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hashtags */}
            <div className="space-y-3">
              <FormLabel className="flex items-center text-sm font-medium">
                <Tag className="h-4 w-4 mr-1.5" />
                Hashtags
              </FormLabel>
              {/* Hashtag Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add hashtag (e.g. travel, adventure)"
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                  className="focus-visible:ring-primary"
                />
                <Button
                  type="button"
                  onClick={handleAddHashtag}
                  className="flex-shrink-0"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>{" "}
              {/* Hashtag Display */}
              {form.watch("hashtags")?.length > 0 ? (
                <motion.div
                  className="flex flex-wrap gap-2 mt-2 pb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {form.watch("hashtags").map((tag, index) => (
                    <motion.div
                      key={`tag-${tag}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium",
                          getTagColor(index)
                        )}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveHashtag(index)}
                          className="ml-2 hover:text-foreground focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag}</span>
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-sm text-muted-foreground mt-2">
                  No hashtags added yet. Add some tags to categorize your blog.
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="bg-muted/30 py-4 px-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto rounded-full"
          onClick={() => router.push("/user/dashboard/blogs")}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90"
          disabled={
            isSubmitting ||
            (form.getValues("imageUrls").length === 0 &&
              newImageFiles.length === 0)
          }
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Blog
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
