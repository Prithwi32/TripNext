"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Compass, MapPin, Plane } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "./not-found.css";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // Calculate a variety of colors based on the current theme for the traveling dots
  const dotColors =
    resolvedTheme === "dark"
      ? ["#33ADFF", "#2CC98F", "#FFA600", "#FF6B6B", "#9580FF"]
      : ["#0066CC", "#209977", "#E86A00", "#D03333", "#4E46CC"];
        return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden" data-not-found-page>
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      {/* Airplane Icon */}
      <div className="absolute left-4 top-4 z-50">
        {" "}
        <div className="flex items-center gap-2">
          <Plane className={`h-6 w-6 ${theme==="dark"?"text-white":"text-black"}`} />
          <h1 className="text-xl font-bold text-primary travel-underline">
            Trip<span className={`${theme==="dark"?"text-white":"text-black"}`}>Next</span>
          </h1>
        </div>
      </div>
      {/* Background Elements - Moving dots that simulate travel routes */}{" "}
      <div className="absolute inset-0 overflow-hidden map-grid">
        {/* Animated background dots */}
        {dotColors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-70 route-dot"
            style={{
              backgroundColor: color,
              width: `${Math.random() * 15 + 8}px`,
              height: `${Math.random() * 15 + 8}px`,
              boxShadow: `0 0 15px 3px ${color}`,
              opacity: resolvedTheme === "dark" ? 0.7 : 0.85,
            }}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
            }}
            animate={{
              x: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              scale: [0, 1, 1.5, 1, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Path lines (curved SVG paths) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <motion.path
            d="M100,500 C300,100 700,900 900,500"
            fill="none"
            stroke={resolvedTheme === "dark" ? "#33ADFF" : "#007ACC"}
            strokeWidth="2"
            strokeDasharray="10,10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="animated-path"
          />{" "}
          <motion.path
            d="M200,800 C400,400 600,600 800,200"
            fill="none"
            stroke={resolvedTheme === "dark" ? "#FFA600" : "#FFA500"}
            strokeWidth="2"
            strokeDasharray="10,10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
            className="animated-path"
          />
          <motion.path
            d="M50,400 C200,600 700,300 950,600"
            fill="none"
            stroke={resolvedTheme === "dark" ? "#2CC98F" : "#34D399"}
            strokeWidth="2"
            strokeDasharray="10,10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, delay: 0.8, ease: "easeInOut" }}
            className="animated-path"
          />
        </svg>
      </div>
      {/* Content Container */}
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="grid gap-8 lg:gap-12 md:grid-cols-2 items-center sm:py-10">
            {/* Left Column - Error Message */}
            <div className="space-y-6 text-center md:text-left">
              <div>
                <motion.h1
                  className="text-9xl font-extrabold tracking-tighter text-primary error-text pulse-animation"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.4,
                  }}
                >
                  404
                </motion.h1>
                <motion.h2
                  className="text-3xl font-bold mt-6 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  We lost this page
                </motion.h2>
                <motion.p
                  className="text-lg text-muted-foreground mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  We searched high and low but couldn't find what you're looking
                  for. Let's find a better place for you to go.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-col md:flex-row gap-4 justify-center md:justify-start"
              >
                {" "}
                <Button
                  asChild
                  size="lg"
                  className="group transition-all duration-300 hover:shadow-md hover:shadow-primary/25 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Go to Homepage
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group transition-all duration-300 hover:shadow-md hover:shadow-primary/25 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <Link href="#" onClick={() => window.history.back()}>
                    <Compass className="mr-2 h-4 w-4 transition-transform group-hover:rotate-45" />
                    Go Back
                  </Link>
                </Button>
              </motion.div>
            </div>
            {/* Right Column - Illustration */}{" "}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 100,
                delay: 0.3,
              }}
              className="relative mx-auto w-full md:w-[120%] lg:w-[140%]"
            >
              <div className="w-full h-full relative">
                {" "}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="float-animation error-illustration flex items-center justify-center"
                >
                  {/* Travel character and map SVG image */}{" "}
                  <motion.img
                    src="/404.svg"
                    alt="404 Illustration - Lost traveler with a map"
                    aria-label="A traveler looking at a map, representing a lost page"
                    className="w-[150%] object-contain"
                    animate={{ rotate: [0, 1, 0, -1, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ originX: 0.5, originY: 0.6 }}
                  />
                </motion.div>
                {/* Floating location markers */}{" "}
                <motion.div
                  className="absolute top-[10%] right-[30%]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {" "}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="bg-secondary text-secondary-foreground p-2 rounded-full shadow-lg map-marker"
                  >
                    <MapPin size={20} />
                  </motion.div>
                </motion.div>{" "}
                <motion.div
                  className="absolute bottom-[20%] left-[15%]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                    className="bg-accent text-accent-foreground p-2 rounded-full shadow-lg map-marker"
                  >
                    <MapPin size={20} />
                  </motion.div>
                </motion.div>
                {/* Additional map marker */}{" "}
                <motion.div
                  className="absolute bottom-[45%] right-[10%]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg map-marker"
                  >
                    <MapPin size={20} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Attribution link at bottom */}{" "}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-4 text-xs text-muted-foreground"
        >
          <motion.a
            href="https://tripnext.com"
            className="hover:underline inline-block"
            whileHover={{ scale: 1.05, color: "var(--primary)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            TripNext © {new Date().getFullYear()}
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
