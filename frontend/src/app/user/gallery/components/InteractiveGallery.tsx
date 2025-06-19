"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const images = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
  "/img4.jpg",
  "/img5.jpg",
];

export default function InteractiveGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full min-h-screen dark:bg-neutral-900 px-6 py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
          Wanderlust Gallery
        </h1>

        <p className="text-lg text-gray-500 dark:text-neutral-300">
          Here’s a peek into your travel journal—just me, my camera, and the
          places that made me feel alive. Captured through my lens. Shared from
          my heart!
        </p>
      </motion.div>

      {/* Image Carousel */}
      <div className="flex w-full h-[60vh] gap-2 max-w-7xl mb-6">
        {images
          .map((img, index) => ({ img, index }))
          .filter(({ index }) => Math.abs(index - activeIndex) <= 1)
          .map(({ img, index }) => (
            <motion.div
              key={img}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative cursor-pointer rounded-xl overflow-hidden shadow-lg flex items-end justify-start bg-cover bg-center transition-all duration-300",
                activeIndex === index ? "flex-[5]" : "flex-[1] grayscale"
              )}
              style={{ backgroundImage: `url(${img})` }}
              onClick={() => setActiveIndex(index)}
            >
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    key="label"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-md"
                  >
                    <h3 className="text-lg font-semibold">Image {index + 1}</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeIndex === index ? "bg-white" : "bg-neutral-600"
            )}
          />
        ))}
      </div>
    </section>
  );
}
