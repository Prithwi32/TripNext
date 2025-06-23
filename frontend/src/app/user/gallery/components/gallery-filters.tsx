"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterType } from "../types";
import { Camera, Map as MapIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GalleryFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  blogCount: number;
  tripCount: number;
}

export function GalleryFilters({
  activeFilter,
  onFilterChange,
  blogCount,
  tripCount,
}: GalleryFiltersProps) {
  const totalCount = blogCount + tripCount;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 120;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <motion.div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3",
        "transition-all duration-300",
        scrolled
          ? "sticky top-[60px] z-10 bg-background/80 backdrop-blur-md border-y py-2"
          : "border-b"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Tabs
        defaultValue="all"
        value={activeFilter}
        onValueChange={(value) => onFilterChange(value as FilterType)}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid grid-cols-3 w-full sm:w-auto shadow-md p-1">
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
            <span className={cn(
              "text-xs rounded-full px-2 py-0.5 backdrop-blur-sm text-primary-foreground",
              activeFilter === "all" ? "dark:bg-slate-200 bg-white/80 text-black" : "bg-gray-400 dark:bg-slate-500"
            )}>
              {totalCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="blog"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Blogs</span>
            <span className={cn(
              "text-xs rounded-full px-2 py-0.5 backdrop-blur-sm text-primary-foreground",
              activeFilter === "blog" ? "dark:bg-slate-200 bg-white/80 text-black" : "bg-gray-400 dark:bg-slate-500"
            )}>
              {blogCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="trip"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Trips</span>
            <span className={cn(
              "text-xs rounded-full px-2 py-0.5 backdrop-blur-sm text-primary-foreground",
              activeFilter === "trip" ? "dark:bg-slate-200 bg-white/80 text-black" : "bg-gray-400 dark:bg-slate-500"
            )}>
              {tripCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Display image and collection counts */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          </span>
          <span>
            {activeFilter === "all"
              ? `${totalCount} images`
              : activeFilter === "blog"
              ? `${blogCount} blog images`
              : `${tripCount} trip images`}
          </span>{" "}
        </div>
      </div>
    </motion.div>
  );
}
