"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface Destination {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
}

export default function Destinations() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const destinations: Destination[] = [
    {
      id: 1,
      name: "Bali",
      location: "Indonesia",
      image: "/travel1.avif",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Santorini",
      location: "Greece",
      image: "/travel2.avif",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Kyoto",
      location: "Japan",
      image: "/travel3.avif",
      rating: 4.7,
    },
  ];

  const cardVariants = {
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    initial: {
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Popular Destinations</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore our most sought-after travel destinations with exclusive
            packages and personalized experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              variants={cardVariants}
              animate={hoveredIndex === index ? "hover" : "initial"}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="aspect-[4/5] relative">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {destination.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 text-primary mr-1" />
                        <span className="text-white/80 text-sm">
                          {destination.location}
                        </span>
                      </div>
                    </div>

                    <div className="bg-primary/90 text-primary-foreground rounded-md px-2 py-1 text-sm font-medium">
                      {destination.rating}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none"
                animate={{
                  borderColor:
                    hoveredIndex === index
                      ? "hsl(var(--primary))"
                      : "transparent",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
