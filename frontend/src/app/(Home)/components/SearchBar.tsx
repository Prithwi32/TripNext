"use client";

import { useState, useEffect } from "react";
import { Sparkles, Compass, MapPin, Plane, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SearchBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation trigger effect
  useEffect(() => {
    // Start the animation automatically after component mounts
    const timer = setTimeout(() => {
      setIsAnimating(true);

      // Reset after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 1000);

    const interval = setInterval(() => {
      setIsAnimating(true);

      // Reset after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto bg-card/70 backdrop-blur-xl border border-border/80 dark:border-white/10 rounded-xl p-8 sm:p-10 shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      whileHover={{ boxShadow: "0 20px 40px -15px rgba(var(--primary), 0.2)" }}
    >
      {/* Glass morphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"></div>
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative paths/lines */}
        <svg
          className="absolute w-full h-full opacity-[0.2] dark:opacity-[0.1]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50"
            stroke="url(#gradient1)"
            strokeWidth="0.4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1 : 0.6 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,65 Q35,35 70,60 T100,55"
            stroke="url(#gradient2)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1 : 0.4 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.path
            d="M0,35 Q45,60 75,40 T100,45"
            stroke="url(#gradient3)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1 : 0.7 }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.1 }}
          />

          {/* Additional decorative elements */}
          <motion.circle
            cx="15"
            cy="20"
            r="1"
            fill="url(#gradient1)"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          />
          <motion.circle
            cx="85"
            cy="25"
            r="0.8"
            fill="url(#gradient2)"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
            transition={{
              duration: 1.8,
              delay: 0.3,
              repeat: isHovered ? Infinity : 0,
            }}
          />
          <motion.circle
            cx="75"
            cy="80"
            r="1.2"
            fill="url(#gradient3)"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? [1, 1.4, 1] : 1 }}
            transition={{
              duration: 2.2,
              delay: 0.5,
              repeat: isHovered ? Infinity : 0,
            }}
          />
          {/* Enhanced gradient definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--primary-foreground))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="50%" stopColor="hsl(var(--secondary-foreground))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="50%" stopColor="hsl(var(--accent-foreground))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>

            {/* Radial gradients for additional effects */}
            <radialGradient
              id="shine1"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0"
              />
            </radialGradient>
            <radialGradient
              id="shine2"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop
                offset="0%"
                stopColor="hsl(var(--secondary))"
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--secondary))"
                stopOpacity="0"
              />
            </radialGradient>
            <radialGradient
              id="shine3"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop
                offset="0%"
                stopColor="hsl(var(--accent))"
                stopOpacity="0.7"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--accent))"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>
        </svg>
      </div>{" "}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-5"
        >
          <motion.h3
            className="text-xl sm:text-2xl font-medium mb-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Discover Your Dream Adventure
            </span>
          </motion.h3>
          <motion.p
            className="text-muted-foreground max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            AI-powered recommendations to find your perfect destinations based
            on your unique travel style.
          </motion.p>
        </motion.div>
        <motion.div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated elements around button */}
          <AnimatePresence>
            {(isHovered || isAnimating) && (
              <>
                <motion.div
                  className="absolute text-primary"
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  animate={{ opacity: 0.7, x: -40, y: -30 }}
                  exit={{ opacity: 0, x: -50, y: -40 }}
                  transition={{ duration: 0.8 }}
                >
                  <MapPin size={18} />
                </motion.div>
                <motion.div
                  className="absolute text-secondary"
                  initial={{ opacity: 0, x: 20, y: -10 }}
                  animate={{ opacity: 0.7, x: 45, y: -25 }}
                  exit={{ opacity: 0, x: 55, y: -35 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <Plane size={16} />
                </motion.div>
                <motion.div
                  className="absolute text-accent"
                  initial={{ opacity: 0, x: -15, y: 20 }}
                  animate={{ opacity: 0.7, x: -35, y: 30 }}
                  exit={{ opacity: 0, x: -45, y: 40 }}
                  transition={{ duration: 0.9, delay: 0.05 }}
                >
                  <Compass size={20} />
                </motion.div>
                <motion.div
                  className="absolute text-secondary"
                  initial={{ opacity: 0, x: 15, y: 15 }}
                  animate={{ opacity: 0.7, x: 40, y: 35 }}
                  exit={{ opacity: 0, x: 50, y: 45 }}
                  transition={{ duration: 0.75, delay: 0.15 }}
                >
                  <Palmtree size={17} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          {/* Main button with enhanced special effects */}
          <Button
            size="lg"
            className="relative overflow-hidden group px-6 py-6 transition-all duration-500"
            asChild
          >
            <Link href="/user/trip-recommend">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-md opacity-0 group-hover:opacity-100"
                animate={{
                  backgroundPosition: isHovered
                    ? ["0% 50%", "100% 50%"]
                    : ["0% 50%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: isHovered ? Infinity : 0,
                  repeatType: "mirror",
                }}
              />

              {/* Enhanced Sparkles animation */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={
                  isAnimating
                    ? {
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 1, 0.5],
                        rotate: [0, 5, 0, -5, 0],
                      }
                    : { scale: 1, opacity: 0.5 }
                }
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-full h-full text-primary/40 dark:text-primary/30" />
              </motion.span>

              {/* Pulse effect behind the button */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-md"
                animate={{
                  scale: isHovered ? [1, 1.05, 1] : [1, 1.02, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              />

              <span className="relative z-10 flex items-center gap-3 font-medium">
                <motion.div
                  animate={{
                    rotate: isHovered ? [0, 15, -15, 0] : 0,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                >
                  <Sparkles className="h-6 w-6 text-secondary" />
                </motion.div>
                <span className="text-base sm:text-lg">
                  Find Your Perfect Trip
                </span>
                <motion.div
                  initial={{ x: 0 }}
                  animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                  transition={{
                    duration: 1,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 0.5,
                  }}
                >
                  <Plane className="h-5 w-5 text-accent ml-1" />
                </motion.div>
              </span>
            </Link>
          </Button>

          {/* Enhanced Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-md blur-md"
            animate={{
              boxShadow: isHovered
                ? "0 0 25px 8px rgba(var(--primary), 0.35), 0 0 15px 3px rgba(var(--secondary), 0.25)"
                : "0 0 8px 2px rgba(var(--primary), 0.15), 0 0 4px 1px rgba(var(--secondary), 0.1)",
            }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-5 flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-border/20 shadow-sm"
        >
          <span className="flex items-center">
            <Compass className="h-3.5 w-3.5 text-secondary mr-1.5" />
            <span className="text-xs font-medium">Personalized</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-border/50"></span>
          <span className="flex items-center">
            <Palmtree className="h-3.5 w-3.5 text-accent mr-1.5" />
            <span className="text-xs font-medium">Curated</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-border/50"></span>
          <span className="flex items-center">
            <Plane className="h-3.5 w-3.5 text-primary mr-1.5" />
            <span className="text-xs font-medium">Ready to Book</span>
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
