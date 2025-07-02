"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Plane,
  Palmtree,
  Ship,
  Calendar,
  ArrowRight,
} from "lucide-react";
import "../components/travel-animations.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Image paths for the carousel
  const images = [
    "/img3.jpg",
    "/img2.jpg",
    "/img4.jpg",
    "/img1.jpg",
    "/img5.jpg",
    "/img4.webp",
    "/img6.jpg",
  ];

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Auto rotate images
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden">
      {/* Background elements and decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 dark:from-transparent dark:to-background/90 z-10" />

        {/* Animated circles in the background */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-[blob_15s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl animate-[blob_20s_ease-in-out_infinite_1s] opacity-70" />
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl animate-[blob_25s_ease-in-out_infinite_2s] opacity-60" />
      </div>

      <div className="relative z-10 container mx-auto pt-28 pb-20 px-4 sm:px-6 md:pt-36 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text content */}
          <div className="space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Discover Your Next Adventure
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 dark:text-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
                Explore breathtaking destinations and plan unforgettable
                journeys with TripNext, your ultimate travel companion.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button asChild size="lg" className="group">
                <Link href="/auth/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="backdrop-blur-sm bg-background/50"
              >
                <Link href="/user/trip-packages">Explore Tours</Link>
              </Button>
            </motion.div>

            {/* Features highlights */}
            <motion.div
              className="pt-10 flex flex-wrap gap-10 items-center justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Compass className="h-5 w-5 text-primary" />
                <span>Guided Tours</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-5 w-5 text-secondary" />
                <span>Top Destinations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-5 w-5 text-accent" />
                <span>Easy Planning</span>
              </div>
            </motion.div>
          </div>

          {/* Image carousel with animations */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl">
              {/* Moving particles - travel icons */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <motion.div
                  className="absolute text-primary dark:text-primary/80"
                  animate={{
                    x: [0, 100, -50, 30, 0],
                    y: [0, -80, -30, -100, 0],
                    rotate: [0, 20, -20, 10, 0],
                    opacity: theme === "dark" ? 0.25 : 0.4,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                  }}
                >
                  <Plane size={24} />
                </motion.div>
                <motion.div
                  className="absolute top-20 right-40 text-secondary dark:text-secondary/80"
                  animate={{
                    x: [0, -70, 100, 50, 0],
                    y: [0, 100, 50, -30, 0],
                    rotate: [0, -15, 15, -5, 0],
                    opacity: theme === "dark" ? 0.25 : 0.4,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 25,
                    ease: "linear",
                  }}
                >
                  <Ship size={22} />
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-20 text-accent dark:text-accent/80"
                  animate={{
                    x: [0, 80, 20, -40, 0],
                    y: [0, -30, 80, 40, 0],
                    rotate: [0, 10, -10, 5, 0],
                    opacity: theme === "dark" ? 0.25 : 0.4,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 22,
                    ease: "linear",
                  }}
                >
                  <Palmtree size={20} />
                </motion.div>
              </div>

              {/* Image carousel */}
              <div className="h-full w-full relative">
                {images.map((img, index) => (
                  <motion.div
                    key={img}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activeImageIndex === index ? 1 : 0,
                      scale: activeImageIndex === index ? 1 : 1.1,
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <Image
                      src={img}
                      alt="Travel destination"
                      fill
                      className="object-cover rounded-2xl"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2  space-x-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === index
                        ? "bg-primary w-6"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute inset-0 border border-white/10 dark:border-white/5 rounded-2xl pointer-events-none" />

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-accent/30 to-primary/30 rounded-full blur-xl" />
            </div>

            {/* Floating card - free recommendations */}
            <motion.div
              onClick={() => router.push("/user/trip-recommend")}
              className="cursor-pointer absolute -bottom-5 -right-5 md:right-5 bg-card/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border dark:border-white/10 w-64 z-40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-start gap-3 z-50">
                <div className="w-10 h-10 bg-primary/20 dark:bg-primary/10 rounded-full flex items-center justify-center">
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Free Personalized Guide</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try our AI travel recommendations tailored just for you!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative z-10 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="fill-background dark:fill-background w-full h-auto"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,80C672,64,768,32,864,32C960,32,1056,64,1152,69.3C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
}
