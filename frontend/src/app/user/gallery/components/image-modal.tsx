"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GalleryImage } from "../types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Map as MapIcon,
  Heart,
  Share2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
  images: GalleryImage[];
  onNavigate: (image: GalleryImage) => void;
}

export function ImageModal({
  image,
  onClose,
  images,
  onNavigate,
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "related">("info");
  const [animation, setAnimation] = useState<"slideLeft" | "slideRight" | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  // Find current image index
  const currentIndex = images.findIndex((img) => img.id === image.id);

  // Handle navigation
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setAnimation("slideRight");
      onNavigate(images[currentIndex - 1]);
      setTimeout(() => setAnimation(null), 500);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setAnimation("slideLeft");
      onNavigate(images[currentIndex + 1]);
      setTimeout(() => setAnimation(null), 500);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

const handleCopy = async () => {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${
          image.source === "blog"
            ? `/blogs/${image.sourceId}`
            : `/user/dashboard/trips/${image.sourceId}`
        }`
      : "";

  await navigator.clipboard.writeText(url);

  toast.success("Link copied!")
};

  // Format date nicely
  const formattedDate = new Date(image.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Get related images from the same source
  const relatedImages = images
    .filter((img) => img.sourceId === image.sourceId && img.id !== image.id)
    .slice(0, 6);

  // Get recommended images (other sources, similar dates)
  const recommendedImages = images
    .filter((img) => img.id !== image.id && img.sourceId !== image.sourceId)
    .slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-7xl w-[95vw] p-0 bg-background/90 backdrop-blur-xl border-border md:max-h-[90vh] overflow-hidden">
        <div className="relative flex flex-col md:flex-row h-full">
          {/* Blurred background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
            <Image
              src={image.imageUrl}
              alt=""
              fill
              className="object-cover opacity-20 scale-110"
              quality={10}
              priority
            />
          </div>

          {/* Main content */}
          <div className="relative flex flex-col md:flex-row w-full max-h-[90vh]">
            {/* Image */}
            <div className="relative flex-1 min-h-[50vh] md:min-h-[70vh] bg-black/20 flex items-center justify-center overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.title || "Gallery image"}
                fill
                sizes="(max-width: 768px) 95vw, 70vw"
                className={cn(
                  "object-contain transition-all duration-500",
                  animation === "slideLeft" && "translate-x-full opacity-0",
                  animation === "slideRight" && "-translate-x-full opacity-0",
                  loading ? "scale-[1.02] blur-sm" : "scale-100 blur-0"
                )}
                priority
                onLoadingComplete={() => setLoading(false)}
              />

              {/* Image counter with progress bar */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <div className="bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                  <span>{currentIndex + 1}</span>
                  <span className="text-white/50">/</span>
                  <span>{images.length}</span>
                </div>
                <div className="h-1 bg-black/20 backdrop-blur-md rounded-full w-24">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${((currentIndex + 1) / images.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-black/40 hover:scale-105 hover:bg-black hover:text-white text-white rounded-full h-8 w-8 backdrop-blur-md z-10"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black hover:text-white text-white rounded-full h-10 w-10 backdrop-blur-md transition-all",
                  currentIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 hover:scale-110"
                )}
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black hover:text-white text-white rounded-full h-10 w-10 backdrop-blur-md transition-all",
                  currentIndex === images.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 hover:scale-110"
                )}
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Bottom action bar on small screens */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-md md:hidden flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-9 w-9 rounded-full",
                      isLiked
                        ? "bg-red-500/20 text-red-500"
                        : "bg-white/10 text-white"
                    )}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={cn("h-4 w-4", isLiked && "fill-red-500")}
                    />
                  </Button>
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full bg-white/10 text-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Link
                  href={
                    image.source === "blog"
                      ? `/blogs/${image.sourceId}`
                      : `/user/dashboard/trips/${image.sourceId}`
                  }
                >
                  <Button size="sm" variant="secondary" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View {image.source}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Info panel */}
            <div className="p-6 w-full md:w-96 flex flex-col dark:bg-background/60 bg-white/90 dark:backdrop-blur-xl overflow-y-auto border-l border-border/30">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant={"secondary"}
                    className="flex gap-1 items-center"
                  >
                    {image.source === "blog" ? (
                      <Camera className="h-3 w-3" />
                    ) : (
                      <MapIcon className="h-3 w-3" />
                    )}
                    {image.source === "blog" ? "Blog Post" : "Trip"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-2xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {image.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <p className="text-sm">{formattedDate}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-border/30 mb-6">
                <div className="flex space-x-6">
                  <button
                    onClick={() => setActiveTab("info")}
                    className={cn(
                      "pb-2 text-sm font-medium transition-colors",
                      activeTab === "info"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Information
                  </button>
                  <button
                    onClick={() => setActiveTab("related")}
                    className={cn(
                      "pb-2 text-sm font-medium transition-colors",
                      activeTab === "related"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Related ({relatedImages.length})
                  </button>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                {activeTab === "info" ? (
                  <>
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">
                        About this Memory
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        This {image.source === "blog" ? "blog post" : "trip"}{" "}
                        captures your experience at {image.title}.{" "}
                        {image.source === "blog"
                          ? "You shared your thoughts and experiences in this blog."
                          : "This trip was part of your travel adventures."}
                      </p>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-auto py-3 flex flex-col items-center justify-center gap-1",
                          "bg-background/50 backdrop-blur-sm hover:bg-secondary/90",
                          isLiked ? "border-red-200 dark:border-red-800" : ""
                        )}
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4",
                            isLiked
                              ? "text-red-500 fill-red-500"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="text-xs">Like</span>
                      </Button>
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 flex flex-col items-center justify-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-secondary/90"
                      >
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">
                          Share
                        </span>
                      </Button>
                      <Link
                        href={
                          image.source === "blog"
                            ? `/blogs/${image.sourceId}`
                            : `/user/dashboard/trips/${image.sourceId}`
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto py-3 flex flex-col items-center justify-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-secondary/90"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">Open</span>
                        </Button>
                      </Link>
                    </div>

                    {/* Recommended */}
                    {recommendedImages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3">
                          You might also like
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {recommendedImages.map((img) => (
                            <div
                              key={img.id}
                              className="aspect-square rounded-md overflow-hidden cursor-pointer transition-all group"
                              onClick={() => onNavigate(img)}
                            >
                              <div className="relative h-full w-full">
                                <Image
                                  src={img.imageUrl}
                                  alt=""
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                                  <span className="text-white text-xs line-clamp-1">
                                    {img.title}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {relatedImages.length > 0 ? (
                      relatedImages.map((img) => (
                        <div
                          key={img.id}
                          className="aspect-square rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] group"
                          onClick={() => onNavigate(img)}
                        >
                          <div className="relative h-full w-full">
                            <Image
                              src={img.imageUrl}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                              <span className="text-white text-xs line-clamp-1">
                                {img.title}
                              </span>
                              <span className="text-xs bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm text-white/90">
                                {new Date(img.createdAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                        <Camera className="h-10 w-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">
                          No related images found from this {image.source}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 hidden md:block">
                <Link
                  href={
                    image.source === "blog"
                      ? `/blogs/${image.sourceId}`
                      : `/user/dashboard/trips/${image.sourceId}`
                  }
                >
                  <Button variant="default" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Full {image.source === "blog" ? "Blog Post" : "Trip"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
}
