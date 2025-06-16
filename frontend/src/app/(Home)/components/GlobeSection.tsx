"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Destination data with positions - optimized for attachment to globe
const destinations = [
  {
    name: "Barcelona, Spain",
    image: "/img4.jpg",
    description: "Rich architecture & culture",
    position: { lat: 41.3851, lng: 2.1734 },
    cardPos: { top: "15%", left: "2%" },
    lgCardPos: { top: "22%", left: "8%" }, // Closer position for large screens
    mobileShow: true,
  },
  {
    name: "Milan, Italy",
    image: "/img2.jpg",
    description: "Fashion capital of the world",
    position: { lat: 45.4642, lng: 9.19 },
    cardPos: { bottom: "15%", left: "5%" },
    lgCardPos: { bottom: "22%", left: "8%" }, // Closer position for large screens
    mobileShow: false,
  },
  {
    name: "Ha Long Bay, Vietnam",
    image: "/img5.jpg",
    description: "Stunning seascapes",
    position: { lat: 20.9101, lng: 107.1839 },
    cardPos: { bottom: "15%", right: "5%" },
    lgCardPos: { bottom: "22%", right: "8%" }, // Closer position for large screens
    mobileShow: true,
  },
  {
    name: "St. Petersburg, Russia",
    image: "/img3.jpg",
    description: "Imperial architecture",
    position: { lat: 59.9343, lng: 30.3351 },
    cardPos: { top: "15%", right: "2%" },
    lgCardPos: { top: "22%", right: "8%" }, // Closer position for large screens
    mobileShow: false,
  },
];

export default function GlobeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-br from-slate-200/30 via-blue-100/20 to-slate-100/30 dark:from-cyan-900/10 dark:via-blue-900/10 dark:to-indigo-900/10"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] bg-slate-200/40 dark:bg-cyan-400/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              Destinations
            </span>{" "}
            Worldwide
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Discover breathtaking places around the globe and create
            unforgettable memories with our expertly curated travel experiences.
          </p>
        </motion.div>

        {/* Main container */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[350px] sm:min-h-[500px] md:min-h-[650px] lg:min-h-[750px]">
          {/* Globe Component with destinations */}
          <div className="w-full relative flex justify-center">
            <div className="relative w-full aspect-[1/1] max-w-[90vw] sm:max-w-[95vw] md:max-w-[90vw] xl:max-w-[1000px] mx-auto flex items-center justify-center max-h-[50vw] sm:max-h-[65vw] md:max-h-[80vw] lg:max-h-[700px]">
              <DottedGlobe theme={resolvedTheme} />
            </div>

            {/* Small screens - only 2 cards visible (sm and below) */}
            <div className="sm:hidden absolute inset-0 pointer-events-none">
              {destinations
                .filter((dest) => dest.mobileShow)
                .map((dest, i) => (
                  <React.Fragment key={`mobile-fragment-${dest.name}`}>
                    {/* Connection line */}{" "}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 0.7, scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.3 }}
                      style={{
                        position: "absolute",
                        height: "2px",
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
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
                        right: dest.cardPos.right
                          ? `calc(${dest.cardPos.right} + 36px)`
                          : "auto",
                        width: "75px",
                        transform: dest.cardPos.right
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                    <motion.div
                      key={`mobile-${dest.name}`}
                      className="absolute z-30 shadow-lg rounded-xl overflow-hidden bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 backdrop-blur-md w-28 pointer-events-auto"
                      style={dest.cardPos}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.3 }}
                    >
                      <div className="relative h-16">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </div>{" "}
                      <div className="p-1.5">
                        <h3 className="font-bold text-[0.7rem] text-gray-900 dark:text-white">
                          {dest.name}
                        </h3>
                        <p className="text-[0.6rem] text-gray-600 dark:text-gray-300 mt-0.5">
                          {dest.description}
                        </p>
                      </div>
                    </motion.div>
                  </React.Fragment>
                ))}
            </div>

            {/* Medium screens - all 4 cards visible (sm - lg) */}
            <div className="hidden sm:block lg:hidden absolute inset-0 pointer-events-none">
              {destinations.map((dest, i) => (
                <React.Fragment key={`medium-fragment-${dest.name}`}>
                  {/* Connection line */}{" "}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 0.7, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    style={{
                      position: "absolute",
                      height: "2px",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
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
                      right: dest.cardPos.right
                        ? `calc(${dest.cardPos.right} + 40px)`
                        : "auto",
                      width: "85px",
                      transform: dest.cardPos.right
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                  <motion.div
                    key={`medium-${dest.name}`}
                    className="absolute z-30 shadow-lg rounded-xl overflow-hidden bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 backdrop-blur-md w-32 sm:w-36 md:w-40 pointer-events-auto"
                    style={{ ...dest.cardPos }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                  >
                    <div className="relative h-20 sm:h-24">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-bold text-xs text-gray-900 dark:text-white">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                        {dest.description}
                      </p>
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
                {/* Connection line */}{" "}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 0.7, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  style={{
                    position: "absolute",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
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
                    right: dest.cardPos.right
                      ? `calc(${dest.cardPos.right} + 70px)`
                      : "auto",
                    width: "70px",
                    transform: dest.cardPos.right
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />{" "}
                <motion.div
                  key={dest.name}
                  className={cn(
                    "absolute z-30 shadow-lg rounded-xl overflow-hidden",
                    "bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800",
                    "backdrop-blur-md w-48 md:w-56 lg:w-64 transition-all hover:scale-105 pointer-events-auto"
                  )}
                  style={{
                    ...dest.lgCardPos,
                  }} /* Using large screen specific positioning */
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{
                    y: [0, -4, 0],
                    transition: {
                      repeat: Infinity,
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
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {dest.description}
                    </p>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action button */}
      <motion.div
        className="text-center mt-8 md:mt-12 lg:mt-16 cursor-pointer z-40 relative"
        style={{ zIndex: 40, pointerEvents: "auto" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative z-50"
          style={{ pointerEvents: "auto", zIndex: 50 }}
        >
          Explore All Destinations
        </button>
      </motion.div>
    </section>
  );
}

const DottedGlobe = ({ theme }: { theme: string | undefined }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = Math.min(1000, window.innerWidth * 0.9);
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${width}px`;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const isDark = theme === "dark";
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: isDark ? 1 : 0,
      diffuse: 1.15,
      mapSamples: 35000,
      mapBrightness: isDark ? 6 : 12,
      baseColor: isDark ? [0.1, 0.1, 0.2] : [0.95, 0.95, 0.98],
      markerColor: isDark ? [1, 1, 1] : [0.15, 0.15, 0.15],
      glowColor: isDark ? [0.2, 0.4, 0.8] : [0.8, 0.8, 0.95],
      scale: 0.9,
      opacity: isDark ? 0.9 : 1.0,
      markers: destinations.map((dest) => ({
        location: [dest.position.lng, dest.position.lat] as [number, number],
        size: 0.06,
        color: [1, 0.85, 0.1],
        rayLength: 1.0,
      })),
      onRender: (state: Record<string, any>) => {
        if (!pointerInteracting.current) {
          phi += 0.002;
        }
        state.phi = phi;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    // Add pointer interactions for dragging the globe
    canvasRef.current!.style.cursor = "grab";

    function onPointerDown(e: PointerEvent) {
      pointerInteracting.current =
        e.clientX - pointerInteractionMovement.current;
      canvasRef.current!.style.cursor = "grabbing";
    }

    function onPointerUp() {
      pointerInteracting.current = null;
      canvasRef.current!.style.cursor = "grab";
    }

    function onPointerOut() {
      pointerInteracting.current = null;
      canvasRef.current!.style.cursor = "grab";
    }

    function onMouseMove(e: MouseEvent) {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta;
        phi = phi + delta / 500; // slower drag
      }
    }

    canvasRef.current!.addEventListener(
      "pointerdown",
      onPointerDown as EventListener
    );
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      if (!canvasRef.current) return;
      canvasRef.current!.removeEventListener(
        "pointerdown",
        onPointerDown as EventListener
      );
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [theme]);

  return (
    <motion.div
      className="relative mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full aspect-square max-w-[95vw] sm:max-w-[90vw] xl:max-w-[1200px] mx-auto flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full mx-auto rounded-full"
          style={{
            cursor: "grab",
            maxWidth: "100%",
            aspectRatio: "1",
            filter: `drop-shadow(0 0 40px ${
              theme === "dark"
                ? "rgba(64, 150, 255, 0.2)"
                : "rgba(200, 210, 220, 0.4)"
            })`,
          }}
        />
      </div>{" "}
      {/* Visual accent elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-300/30 dark:bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-slate-300/30 dark:bg-cyan-500/20 rounded-full blur-3xl" />
    </motion.div>
  );
};
