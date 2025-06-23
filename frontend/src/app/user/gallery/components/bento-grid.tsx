"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { GalleryImage } from "../types";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Map as MapIcon,
  Film,
  Camera,
  Heart,
  Share2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BentoGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
}

export default function BentoGrid({ images, onImageClick }: BentoGridProps) {
  const [timelineView, setTimelineView] = useState(false);
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("sm");
      } else if (window.innerWidth < 1024) {
        setScreenSize("md");
      } else if (window.innerWidth < 1280) {
        setScreenSize("lg");
      } else {
        setScreenSize("xl");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  if (!images.length) return null;

  // Group images by month if in timeline view
  const groupedByMonth: Record<string, GalleryImage[]> = {};

  if (timelineView) {
    images.forEach((image) => {
      const date = new Date(image.createdAt);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }
      groupedByMonth[monthYear].push(image);
    });
  }

  // Function to determine the span of a cell in the grid
  const getCellSize = (index: number, totalImages: number): string => {
    if (screenSize === "sm") return "col-span-12 row-span-1"; // Mobile is always full width

    // Create a more dynamic and interesting pattern
    const patterns = [
      // First row - Hero layout
      "col-span-12 md:col-span-8 md:row-span-2", // Hero image (large)
      "col-span-12 md:col-span-4 row-span-1", // Small top right
      "col-span-12 md:col-span-4 row-span-1", // Small bottom right

      // Second row - Mixed layout
      "col-span-12 md:col-span-4 md:row-span-2", // Tall left
      "col-span-12 md:col-span-4 row-span-1", // Middle top
      "col-span-12 md:col-span-4 row-span-1", // Right top
      "col-span-12 md:col-span-8 row-span-1", // Wide bottom

      // Third row - Column layout
      "col-span-12 md:col-span-3 row-span-1", // Quarter width
      "col-span-12 md:col-span-3 row-span-1", // Quarter width
      "col-span-12 md:col-span-3 row-span-1", // Quarter width
      "col-span-12 md:col-span-3 row-span-1", // Quarter width

      // Fourth row - Asymmetric layout
      "col-span-12 md:col-span-6 md:row-span-2", // Big left
      "col-span-12 md:col-span-6 row-span-1", // Medium top right
      "col-span-12 md:col-span-3 row-span-1", // Small bottom right
      "col-span-12 md:col-span-3 row-span-1", // Small bottom right
    ];

    // For small collections, use larger cells
    if (totalImages <= 4) {
      return index === 0
        ? "col-span-12 md:row-span-2" // First image full width and taller
        : "col-span-12 md:col-span-6 row-span-1"; // Others half width
    }

    return patterns[index % patterns.length];
  };

  // Generate a visually distinct background for timeline months
  const getMonthBackground = (monthIndex: number) => {
    const gradients = [
      "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
      "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20",
      "bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20",
      "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20",
      "bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20",
    ];
    return gradients[monthIndex % gradients.length];
  };

  return (
    <div className="w-full mt-8">
      <div className="flex justify-end mb-6">
        <div className="bg-muted shadow-md p-1 rounded-full flex gap-1 backdrop-blur-sm">
          <button
            onClick={() => setTimelineView(false)}
            className={cn(
              "rounded-full p-2 transition-all duration-300",
              !timelineView
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-secondary/80"
            )}
          >
            <Film className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTimelineView(true)}
            className={cn(
              "rounded-full p-2 transition-all duration-300",
              timelineView
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-secondary/80"
            )}
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>
      {timelineView ? (
        <div className="relative space-y-16">
          {/* Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {Object.entries(groupedByMonth).map(
            ([monthYear, monthImages], monthIndex) => (
              <div key={monthYear} className="relative">
                <div className="flex items-center mb-6">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center z-10 shadow-lg",
                      "absolute left-0 md:left-[calc(50%-24px)]"
                    )}
                  >
                    <Calendar className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3
                    className={cn(
                      "text-xl font-semibold ml-16 md:ml-0",
                      monthIndex % 2 === 0
                        ? "md:text-right md:mr-[60px]"
                        : "md:ml-[60px]"
                    )}
                  >
                    {monthYear}
                  </h3>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-12 gap-4 p-4 rounded-xl transition-all",
                    getMonthBackground(monthIndex),
                    monthIndex % 2 === 0
                      ? "md:ml-[60px] md:mr-0"
                      : "md:mr-[60px] md:ml-0"
                  )}
                >
                  {monthImages.map((image, idx) => (
                    <Card
                      key={image.id}
                      className={cn(
                        "col-span-12 md:col-span-6 lg:col-span-4 overflow-hidden transition-all duration-500",
                        "hover:shadow-xl hover:shadow-primary/5 cursor-pointer group",
                        "border-transparent hover:border-primary/20",
                        hoveredImageId === image.id
                          ? "scale-[1.02]"
                          : "scale-100"
                      )}
                      onClick={() => onImageClick(image)}
                      onMouseEnter={() => setHoveredImageId(image.id)}
                      onMouseLeave={() => setHoveredImageId(null)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={image.title || "Gallery image"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={cn(
                            "object-cover transition-all duration-700",
                            "group-hover:scale-105"
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                          <p className="text-white font-medium line-clamp-1 text-base">
                            {image.title}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-white/90 text-xs">
                              {new Date(image.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                              {image.source}
                            </span>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Like:", image.title);
                              }}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Share:", image.title);
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onImageClick(image);
                              }}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="grid grid-cols-12 auto-rows-[180px] gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              className={cn(
                getCellSize(index, images.length),
                "overflow-hidden transition-all duration-500",
                "hover:shadow-xl hover:shadow-primary/10 cursor-pointer group border-transparent hover:border-primary/20",
                hoveredImageId === image.id ? "scale-[1.02]" : "scale-100"
              )}
              onClick={() => onImageClick(image)}
              onMouseEnter={() => setHoveredImageId(image.id)}
              onMouseLeave={() => setHoveredImageId(null)}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={image.title || "Gallery image"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-all duration-700 ease-in-out",
                    "group-hover:scale-110"
                  )}
                />

                {/* Source Icon */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm p-1.5 rounded-full z-10 transform transition-transform duration-500 group-hover:scale-110">
                  {" "}
                  {image.source === "blog" ? (
                    <Camera className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <MapIcon className="h-3.5 w-3.5 text-white" />
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                  <p className="text-white font-medium line-clamp-1 text-base transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    {image.title}
                  </p>
                  <div className="flex justify-between items-center mt-2 transform transition-all duration-500 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    <span className="text-white/90 text-xs">
                      {new Date(image.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {image.source}
                    </span>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Like:", image.title);
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Share:", image.title);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageClick(image);
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}{" "}
    </div>
  );
}
