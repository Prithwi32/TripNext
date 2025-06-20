"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Blog } from "../types";
import { blogService } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Loader2,
  Share2,
  Trash,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogDetailProps {
  blogId: string;
}

export function BlogDetail({ blogId }: BlogDetailProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const data = await blogService.getBlogById(blogId);
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
        setError(
          "Failed to load blog. It may have been deleted or you don't have permission to view it."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Auto cycle through images on load to showcase the grid
  useEffect(() => {
    if (!blog || blog.blogImages.length <= 1) return;

    const intervalId = setInterval(() => {
      setActiveImageIndex((prev) => {
        const nextIndex = (prev + 1) % blog.blogImages.length;
        return nextIndex;
      });
    }, 3500);

    // Clear the interval when unmounting
    return () => clearInterval(intervalId);
  }, [blog]);

  const handleEdit = () => {
    router.push(`/user/dashboard/blogs/edit/${blogId}`);
  };

  const handleShare = async () => {
    if (navigator.share && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: blog?.blogTitle || "Check out my travel blog!",
          text: blog?.blogDescription.substring(0, 100) + "...",
          url: window.location.href,
        });
        toast.success("Blog shared successfully!");
      } catch (err) {
        toast.error("Failed to share blog");
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await blogService.deleteBlog(blogId);
      toast.success("Blog deleted successfully");
      router.push("/user/dashboard/blogs");
    } catch (err) {
      console.error("Failed to delete blog", err);
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  if (isLoading) {
    return (
      <Card className="mb-6 overflow-hidden border shadow-md max-w-5xl mx-auto">
        <CardHeader className="pb-0 pt-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link href="/user/dashboard/blogs">
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Link>
            </Button>
            <CardTitle className="text-lg md:text-xl font-bold">
              Blog Details
            </CardTitle>
            <div className="w-[72px]"></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Loading Skeleton UI */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-24 bg-muted/80 animate-pulse rounded mt-2"></div>
            </div>
          </div>

          {/* Image skeleton */}
          <div className="aspect-[16/9] w-full bg-muted animate-pulse rounded-lg"></div>

          {/* Content skeletons */}
          <div className="space-y-4 mt-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 w-20 bg-muted animate-pulse rounded"
                ></div>
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-muted animate-pulse rounded w-full"
                ></div>
              ))}
            </div>
            <div className="pt-4 flex gap-3">
              <div className="h-9 w-28 bg-muted animate-pulse rounded"></div>
              <div className="h-9 w-28 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !blog) {
    return (
      <Card className="mb-6 overflow-hidden border shadow-md max-w-5xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg mb-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error || "Blog not found"}
            </p>
          </div>
          <Button variant="outline" asChild className="flex items-center">
            <Link href="/user/dashboard/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mb-6 overflow-hidden border shadow-md dark:shadow-primary/5 max-w-5xl mx-auto">
      <CardHeader className="pb-0 pt-4 border-b">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 hover:bg-secondary/80 transition-colors duration-200"
            asChild
          >
            <Link href="/user/dashboard/blogs">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Blogs</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>{" "}
          <CardTitle className="text-lg md:text-xl font-bold text-center order-first md:order-none w-full md:w-auto">
            Travel Blog
          </CardTitle>
          <div className="w-[72px]"></div>{" "}
          {/* Empty div for balanced spacing */}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 px-4 md:px-6">
        {/* Bento Grid Image Layout with animation */}
        <div className="relative" ref={gridRef}>
          {/* Date badge (outside the grid to be visible regardless of layout) */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white/90 flex items-center z-10 shadow-md">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(new Date(blog.createdAt))}
          </div>

          {blog.blogImages.length === 0 ? (
            <div className="relative h-64 w-full rounded-lg bg-muted/60 flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          ) : blog.blogImages.length === 1 ? (
            // Single image layout - full width/height
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={blog.blogImages[0]}
                alt="Blog cover image"
                fill
                className="object-cover hover:scale-105 transition-all duration-700 ease-in-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ) : blog.blogImages.length === 2 ? (
            // Two images layout - side by side with beautiful hover effect
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:h-72">
              {blog.blogImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg h-64 md:h-full shadow-md cursor-pointer"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`Blog image ${index + 1}`}
                    fill
                    className={cn(
                      "object-cover transition-all duration-700 ease-in-out",
                      activeImageIndex === index
                        ? "scale-105"
                        : "scale-100 group-hover:scale-105"
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          ) : blog.blogImages.length === 3 ? (
            // Three images layout - one large, two small with animation
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:h-96">
              <div
                className="group col-span-12 md:col-span-7 relative overflow-hidden rounded-lg h-64 md:h-full shadow-md cursor-pointer"
                onClick={() => setActiveImageIndex(0)}
              >
                <Image
                  src={blog.blogImages[0]}
                  alt="Blog main image"
                  fill
                  className={cn(
                    "object-cover transition-all duration-700 ease-in-out",
                    activeImageIndex === 0
                      ? "scale-105"
                      : "scale-100 group-hover:scale-105"
                  )}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="col-span-12 md:col-span-5 grid grid-cols-2 md:grid-rows-2 md:grid-cols-1 gap-3 h-64 md:h-full">
                {blog.blogImages.slice(1, 3).map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                    onClick={() => setActiveImageIndex(index + 1)}
                  >
                    <Image
                      src={image}
                      alt={`Blog image ${index + 2}`}
                      fill
                      className={cn(
                        "object-cover transition-all duration-700 ease-in-out",
                        activeImageIndex === index + 1
                          ? "scale-105"
                          : "scale-100 group-hover:scale-105"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>{" "}
            </div>
          ) : (
            // For 4 or more images, show only first 3 with a "+X more" indicator
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:h-96">
              {/* First large feature image */}
              <div
                className="group col-span-12 md:col-span-7 relative overflow-hidden rounded-lg h-64 md:h-full shadow-md cursor-pointer"
                onClick={() => setActiveImageIndex(0)}
              >
                <Image
                  src={blog.blogImages[0]}
                  alt="Blog main image"
                  fill
                  className={cn(
                    "object-cover transition-all duration-700 ease-in-out",
                    activeImageIndex === 0
                      ? "scale-105"
                      : "scale-100 group-hover:scale-105"
                  )}
                  priority
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Show only next 2 images plus a counter */}
              <div className="col-span-12 md:col-span-5 grid grid-cols-2 md:grid-rows-2 md:grid-cols-1 gap-3 h-56 md:h-full">
                {/* Second image */}
                {blog.blogImages[1] && (
                  <div
                    className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer h-full"
                    onClick={() => setActiveImageIndex(1)}
                  >
                    <Image
                      src={blog.blogImages[1]}
                      alt="Blog second image"
                      fill
                      className={cn(
                        "object-cover transition-all duration-700 ease-in-out",
                        activeImageIndex === 1
                          ? "scale-105"
                          : "scale-100 group-hover:scale-105"
                      )}
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                )}

                {/* Third image with "+X more" indicator */}
                {blog.blogImages[2] && (
                  <div
                    className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer h-full"
                    onClick={() => setActiveImageIndex(2)}
                  >
                    <Image
                      src={blog.blogImages[2]}
                      alt="Blog third image"
                      fill
                      className={cn(
                        "object-cover transition-all duration-700 ease-in-out",
                        activeImageIndex === 2
                          ? "scale-105"
                          : "scale-100 group-hover:scale-105"
                      )}
                      sizes="25vw"
                    />{" "}
                    {/* Show count of remaining images */}
                    {blog.blogImages.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <span className="text-white text-xl font-semibold">
                          +{blog.blogImages.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Add extra space to prevent overlap with blog content */}
        <div className="mt-6 mb-8 border-t border-border"></div>
        {/* Add extra space to prevent overlap with blog content */}
        <div className="mt-6 mb-8 border-t border-border"></div>{" "}
        {/* Blog Content */}
        <div className="space-y-6">
          {/* Blog Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            {blog.blogTitle || "Untitled Blog Post"}
          </h1>

          {/* Blog Description with elegant typography */}
          <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {blog.blogDescription}
            </p>
          </div>

          {/* Metadata and Hashtags */}
          <div className="border-t border-b border-border py-4 my-6 flex flex-col md:flex-row justify-between gap-4">
            {/* Left side: Created/Updated dates */}
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created: {formatDate(new Date(blog.createdAt))}</span>
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Updated: {formatDate(new Date(blog.updatedAt))}</span>
                </div>
              )}
            </div>

            {/* Right side: Hashtags */}
            {blog.hashtags && blog.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                {blog.hashtags.map((tag, index) => {
                  // Generate a consistent but varied color for each hashtag
                  const colors = ["outline"];
                  const colorIndex =
                    Math.abs(
                      tag
                        .split("")
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
                    ) % colors.length;

                  return (
                    <Badge
                      key={index}
                      variant={colors[colorIndex] as any}
                      className="px-3 py-1 text-xs hover:scale-105 transition-transform duration-200"
                    >
                      #{tag}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons with improved layout */}
          <div className="flex flex-wrap gap-3 pt-2 justify-center sm:justify-end">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <Button
              onClick={handleEdit}
              variant="default"
              className="flex items-center"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-1.5" />
              Edit Blog
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center"
              size="sm"
            >
              <Trash className="h-4 w-4 mr-1.5" />
              Delete Blog
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your blog and all its content. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
