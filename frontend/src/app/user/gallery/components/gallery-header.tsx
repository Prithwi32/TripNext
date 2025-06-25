"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Cloud, Mountain, Sunset, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

interface GalleryHeaderProps {
  totalImages: number;
  userName: string;
}

export function GalleryHeader({ totalImages, userName }: GalleryHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const icons = [
    <Camera key="camera" className="h-4 w-4" />,
    <MapPin key="map" className="h-4 w-4" />,
    <Mountain key="mountain" className="h-4 w-4" />,
    <Sunset key="sunset" className="h-4 w-4" />,
    <Cloud key="cloud" className="h-4 w-4" />,
  ];

  return (
    <div
      className={cn(
        "pt-8 pb-6 transition-all duration-300",
        scrolled ? "pb-2 backdrop-blur-md bg-background/70" : ""
      )}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex mb-3">
            {/* Decorative icons */}
            <div className="flex -space-x-1 overflow-hidden p-1 px-2 bg-primary/10 rounded-full">
              {icons.map((icon, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-center rounded-full",
                    i % 2 === 0 ? "text-primary" : "text-secondary"
                  )}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-2 flex flex-wrap items-baseline gap-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {userName || "Your"}
            </span>
            <span>Travel Gallery</span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {totalImages === 0
              ? "Your personal travel memories collection will appear here. Start adding trips and blogs to build your gallery."
              : `Your curated collection of ${totalImages} travel memories from around the world. Relive your adventures.`}
          </motion.p>
        </div>
        {totalImages > 0 && (
          <motion.div
            className="flex items-center gap-3 mt-4 md:mt-0 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-muted shadow-md gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-muted-foreground">
                {totalImages} moments captured
              </span>
            </div>
          </motion.div>
        )}{" "}
      </div>
    </div>
  );
}
