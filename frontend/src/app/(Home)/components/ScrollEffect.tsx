"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollEffect() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { scrollY } = useScroll();
  
  // Transform values based on scroll position
  const y1 = useTransform(scrollY, [0, 1500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -250]);
  const y3 = useTransform(scrollY, [0, 1500], [0, -350]);
  const rotate1 = useTransform(scrollY, [0, 1000], [0, 20]);
  const rotate2 = useTransform(scrollY, [0, 1000], [0, -15]);
  const opacity1 = useTransform(scrollY, [0, 500], [0.5, 0]);
  const opacity2 = useTransform(scrollY, [0, 700], [0.6, 0.1]);
  
  if (!isMounted) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background decorative elements that respond to scrolling */}
      <motion.div 
        style={{ y: y1, opacity: opacity1 }}
        className="absolute top-[20%] left-[5%] w-56 h-56 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"
      />
      
      <motion.div 
        style={{ y: y2, rotate: rotate1, opacity: opacity2 }}
        className="absolute top-[40%] right-[10%] w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl"
      />
      
      <motion.div 
        style={{ y: y3, rotate: rotate2, opacity: opacity1 }}
        className="absolute top-[70%] left-[15%] w-64 h-64 rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl"
      />

      {/* Travel route path that gets more transparent on scroll */}
      <motion.div 
        style={{ opacity: opacity2 }}
        className="absolute top-0 inset-x-0 h-screen flex items-center justify-center"
      >
        <div className="w-full max-w-6xl px-4">
          <svg
            viewBox="0 0 1000 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto opacity-30 dark:opacity-20"
          >
            <path
              d="M0,100 C150,30 350,180 500,100 C650,20 850,120 1000,50"
              stroke="url(#travel-gradient)"
              strokeWidth="2"
              strokeDasharray="8,8"
              className="travel-path"
            />
            <defs>
              <linearGradient id="travel-gradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
