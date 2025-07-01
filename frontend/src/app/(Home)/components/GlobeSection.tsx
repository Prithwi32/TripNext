"use client"

import React, { useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { World, type GlobeConfig } from "./Globe"
import Link from "next/link"

// Destination data with positions - optimized for attachment to globe
const destinations = [
  {
    name: "Western Ghats, Karnataka",
    image: "/img4.jpg",
    description: "Monsoon Travel Gateway",
    position: { lat: 41.3851, lng: 2.1734 },
    cardPos: { top: "15%", left: "2%" },
    lgCardPos: { top: "22%", left: "8%" },
    mobileShow: true,
  },
  {
    name: "Jain Temple, Varanga",
    image: "/img2.jpg",
    description: "Star-Shaped Architecture",
    position: { lat: 45.4642, lng: 9.19 },
    cardPos: { bottom: "15%", left: "5%" },
    lgCardPos: { bottom: "22%", left: "8%" },
    mobileShow: false,
  },
  {
    name: "Ha Long Bay, Vietnam",
    image: "/img3.jpg",
    description: "Stunning seascapes",
    position: { lat: 20.9101, lng: 107.1839 },
    cardPos: { bottom: "15%", right: "5%" },
    lgCardPos: { bottom: "22%", right: "8%" },
    mobileShow: true,
  },
  {
    name: "Yana Caves, Karnataka",
    image: "/img5.jpg",
    description: "prehistoric karst landscape",
    position: { lat: 59.9343, lng: 30.3351 },
    cardPos: { top: "15%", right: "2%" },
    lgCardPos: { top: "22%", right: "8%" },
    mobileShow: false,
  },
]

const sampleArcs = [
  {
    order: 1,
    startLat: 41.3851,
    startLng: 2.1734,
    endLat: 45.4642,
    endLng: 9.19,
    arcAlt: 0.3,
    color: "#3b82f6",
  },
  {
    order: 2,
    startLat: 45.4642,
    startLng: 9.19,
    endLat: 20.9101,
    endLng: 107.1839,
    arcAlt: 0.4,
    color: "#06b6d4",
  },
  {
    order: 3,
    startLat: 20.9101,
    startLng: 107.1839,
    endLat: 59.9343,
    endLng: 30.3351,
    arcAlt: 0.35,
    color: "#8b5cf6",
  },
  {
    order: 4,
    startLat: 59.9343,
    startLng: 30.3351,
    endLat: 41.3851,
    endLng: 2.1734,
    arcAlt: 0.25,
    color: "#f59e0b",
  },
  // Additional arcs for new destinations
  {
    order: 5,
    startLat: 41.3851, // Barcelona
    startLng: 2.1734,
    endLat: 35.0116, // Kyoto
    endLng: 135.7681,
    arcAlt: 0.8,
    color: "#ef4444", // Red
  },
  {
    order: 6,
    startLat: 45.4642, // Milan
    startLng: 9.19,
    endLat: -22.9068, // Rio
    endLng: -43.1729,
    arcAlt: 0.7,
    color: "#10b981", // Green
  },
  {
    order: 7,
    startLat: 20.9101, // Ha Long Bay
    startLng: 107.1839,
    endLat: 30.0444, // Cairo
    endLng: 31.2357,
    arcAlt: 0.6,
    color: "#ec4899", // Pink
  },
  {
    order: 8,
    startLat: 59.9343, // St. Petersburg
    startLng: 30.3351,
    endLat: -33.8688, // Sydney
    endLng: 151.2093,
    arcAlt: 0.9,
    color: "#f97316", // Orange
  },
  {
    order: 9,
    startLat: 35.0116, // Kyoto
    startLng: 135.7681,
    endLat: 64.9631, // Reykjavik
    endLng: -19.0208,
    arcAlt: 0.75,
    color: "#6366f1", // Indigo
  },
  {
    order: 10,
    startLat: -22.9068, // Rio
    startLng: -43.1729,
    endLat: -33.9249, // Cape Town
    endLng: 18.4241,
    arcAlt: 0.5,
    color: "#a855f7", // Purple
  },
  {
    order: 11,
    startLat: 30.0444, // Cairo
    startLng: 31.2357,
    endLat: 41.3851, // Barcelona
    endLng: 2.1734,
    arcAlt: 0.4,
    color: "#22d3ee", // Cyan
  },
  {
    order: 12,
    startLat: -33.8688, // Sydney
    startLng: 151.2093,
    endLat: 45.4642, // Milan
    endLng: 9.19,
    arcAlt: 1.0,
    color: "#fde047", // Yellow
  },
  {
    order: 13,
    startLat: 64.9631, // Reykjavik
    startLng: -19.0208,
    endLat: 20.9101, // Ha Long Bay
    endLng: 107.1839,
    arcAlt: 0.8,
    color: "#fbbf24", // Amber
  },
  {
    order: 14,
    startLat: -33.9249, // Cape Town
    startLng: 18.4241,
    endLat: 59.9343, // St. Petersburg
    endLng: 30.3351,
    arcAlt: 0.6,
    color: "#c084fc", // Violet
  },
]

interface WorldProps {
  globeConfig: GlobeConfig
  data: any[]
}

export default function GlobeSection({ globeConfig, data }: WorldProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  const enhancedGlobeConfig: GlobeConfig = {
    pointSize: 4,
    globeColor: resolvedTheme === "dark" ? "#1e293b" : "#020617",
    showAtmosphere: true,
    atmosphereColor: resolvedTheme === "dark" ? "#3b82f6" : "#ADD8E6",
    atmosphereAltitude: 0.1,
    emissive: resolvedTheme === "dark" ? "#1e293b" : "#000000",
    emissiveIntensity: resolvedTheme === "dark" ? 0.2 : 0.1,
    shininess: 0.9,
    polygonColor: resolvedTheme === "dark" ? "rgba(59, 130, 246, 0.7)" : "rgba(0,100,255,0.7)",
    ambientLight: resolvedTheme === "dark" ? "#3b82f6" : "#ffffff",
    directionalLeftLight: resolvedTheme === "dark" ? "#3b82f6" : "#ffffff",
    directionalTopLight: resolvedTheme === "dark" ? "#3b82f6" : "#ffffff",
    pointLight: resolvedTheme === "dark" ? "#3b82f6" : "#ffffff",
    arcTime: 3000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    autoRotate: true,
    autoRotateSpeed: 1,
    ...globeConfig,
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-400 to-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900/5 dark:to-slate-900"
    >
      {/* Starry background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white dark:text-white">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Destinations
            </span>{" "}
            Worldwide
          </h2>
          <p className="max-w-2xl mx-auto text-white dark:text-gray-300">
            Discover breathtaking places around the globe and create unforgettable memories with our expertly curated
            travel experiences.
          </p>
        </motion.div>

        {/* Main container */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[350px] sm:min-h-[500px] md:min-h-[650px] lg:min-h-[750px]">
          {/* Globe Component with destinations */}
          <div className="w-full relative flex justify-center">
            <div className="relative w-full aspect-[1/1] max-w-[90vw] sm:max-w-[95vw] md:max-w-[90vw] xl:max-w-[800px] mx-auto flex items-center justify-center max-h-[50vw] sm:max-h-[65vw] md:max-h-[80vw] lg:max-h-[600px]">
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <World globeConfig={enhancedGlobeConfig} data={sampleArcs} />
              </motion.div>
            </div>

            {/* Small screens - only 2 cards visible (sm and below) */}
            <div className="sm:hidden absolute inset-0 pointer-events-none">
              {destinations
                .filter((dest) => dest.mobileShow)
                .map((dest, i) => (
                  <React.Fragment key={`mobile-fragment-${dest.name}`}>
                    {/* Connection line */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 0.7, scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.3 }}
                      style={{
                        position: "absolute",
                        height: "2px",
                        background:
                          "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.8) 50%, rgba(59,130,246,0) 100%)",
                        transformOrigin: "0 50%",
                        zIndex: 20,
                        opacity: 0.6,
                        top: dest.cardPos.top
                          ? `calc(${dest.cardPos.top} + 30px)`
                          : dest.cardPos.bottom
                            ? `calc(100% - ${dest.cardPos.bottom} - 30px)`
                            : "50%",
                        left: dest.cardPos.left
                          ? `calc(${dest.cardPos.left} + 36px)`
                          : dest.cardPos.right
                            ? `calc(50% + 70px)`
                            : "50%",
                        right: dest.cardPos.right ? `calc(${dest.cardPos.right} + 36px)` : "auto",
                        width: "75px",
                        transform: dest.cardPos.right ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                    <motion.div
                      key={`mobile-${dest.name}`}
                      className="absolute z-30 shadow-lg rounded-xl overflow-hidden bg-blue-50 dark:bg-black/80 backdrop-blur-md w-28 pointer-events-auto border border-blue-500/30"
                      style={dest.cardPos}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.3 }}
                    >
                      <div className="relative h-16">
                        <Image
                          src={dest.image || "/placeholder.svg"}
                          alt={dest.name}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </div>
                      <div className="p-1.5">
                        <h3 className="font-bold text-[0.7rem] text-gray-700 dark:text-white">{dest.name}</h3>
                        <p className="text-[0.6rem] text-gray-500 dark:text-gray-300 mt-0.5">{dest.description}</p>
                      </div>
                    </motion.div>
                  </React.Fragment>
                ))}
            </div>

            {/* Medium screens - all 4 cards visible (sm - lg) */}
            <div className="hidden sm:block lg:hidden absolute inset-0 pointer-events-none">
              {destinations.map((dest, i) => (
                <React.Fragment key={`medium-fragment-${dest.name}`}>
                  {/* Connection line */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 0.7, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    style={{
                      position: "absolute",
                      height: "2px",
                      background:
                        "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.8) 50%, rgba(59,130,246,0) 100%)",
                      transformOrigin: "0 50%",
                      zIndex: 20,
                      opacity: 0.6,
                      top: dest.cardPos.top
                        ? `calc(${dest.cardPos.top} + 30px)`
                        : dest.cardPos.bottom
                          ? `calc(100% - ${dest.cardPos.bottom} - 30px)`
                          : "50%",
                      left: dest.cardPos.left
                        ? `calc(${dest.cardPos.left} + 40px)`
                        : dest.cardPos.right
                          ? `calc(50% + 80px)`
                          : "50%",
                      right: dest.cardPos.right ? `calc(${dest.cardPos.right} + 40px)` : "auto",
                      width: "85px",
                      transform: dest.cardPos.right ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                  <motion.div
                    key={`medium-${dest.name}`}
                    className="absolute z-30 shadow-lg rounded-xl overflow-hidden bg-blue-50 dark:bg-black/80 backdrop-blur-md w-32 sm:w-36 md:w-40 pointer-events-auto border border-blue-500/30"
                    style={{ ...dest.cardPos }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                  >
                    <div className="relative h-20 sm:h-24">
                      <Image
                        src={dest.image || "/placeholder.svg"}
                        alt={dest.name}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-bold text-xs  dark:text-white">{dest.name}</h3>
                      <p className="text-xs dark:text-gray-300 mt-0.5">{dest.description}</p>
                    </div>
                  </motion.div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Large screens - all 4 cards visible (lg and above) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {destinations.map((dest, i) => (
              <React.Fragment key={`desktop-fragment-${dest.name}`}>
                {/* Connection line */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 0.7, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  style={{
                    position: "absolute",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.8) 50%, rgba(59,130,246,0) 100%)",
                    transformOrigin: "0 50%",
                    zIndex: 20,
                    opacity: 0.6,
                    top: dest.cardPos.top
                      ? `calc(${dest.cardPos.top} + 40px)`
                      : dest.cardPos.bottom
                        ? `calc(100% - ${dest.cardPos.bottom} - 40px)`
                        : "50%",
                    left: dest.cardPos.left
                      ? `calc(${dest.cardPos.left} + 70px)`
                      : dest.cardPos.right
                        ? `calc(50% + 65px)`
                        : "50%",
                    right: dest.cardPos.right ? `calc(${dest.cardPos.right} + 70px)` : "auto",
                    width: "70px",
                    transform: dest.cardPos.right ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
                <motion.div
                  key={dest.name}
                  className={cn(
                    "absolute z-30 shadow-lg rounded-xl overflow-hidden",
                    "bg-blue-50 dark:bg-black/80 backdrop-blur-md border border-blue-500/30",
                    "w-48 md:w-56 lg:w-64 transition-all hover:scale-105 pointer-events-auto",
                  )}
                  style={{
                    ...dest.lgCardPos,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{
                    y: [0, -4, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5,
                      ease: "easeInOut",
                      delay: i * 1.5,
                    },
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                >
                  <div className="relative h-32">
                    <Image
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm md:text-base dark:text-white">{dest.name}</h3>
                    <p className="text-xs dark:text-gray-300 mt-1">{dest.description}</p>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action button */}
      <motion.div
        className="text-center cursor-pointer z-40 relative"
        style={{ zIndex: 40, pointerEvents: "auto" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link href="/user/trip-recommend">
        <button
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative z-50"
          style={{ pointerEvents: "auto", zIndex: 50 }}
        >
          Explore All Destinations
        </button>
        </Link>
     </motion.div>
    </section>
  )
}

