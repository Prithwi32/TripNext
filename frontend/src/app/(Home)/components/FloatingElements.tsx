"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Ship,
  Palmtree,
  Luggage,
  Compass,
  CloudSunRain,
  Sunrise,
  Map,
  Ticket,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FloatingElements() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Function to get diverse colors for elements
  const getElementColor = (baseColor: string, index: number) => {
    const colors = {
      primary: ["#33ADFF", "#3B82F6", "#2563EB", "#1E40AF", "#1D4ED8"],
      secondary: ["#FFA600", "#F59E0B", "#D97706", "#B45309", "#FBBF24"],
      accent: ["#2CC98F", "#10B981", "#059669", "#047857", "#34D399"],
    };

    // Get the color array based on the base color, fallback to primary
    const colorArray =
      colors[baseColor as keyof typeof colors] || colors.primary;
    // Use the index to cycle through the array
    return colorArray[index % colorArray.length];
  };

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Create dynamic positions for better distribution across the viewport
  const positions = [
    { left: "5%", top: "15%" },
    { left: "20%", top: "8%" },
    { left: "35%", top: "22%" },
    { left: "60%", top: "10%" },
    { left: "75%", top: "25%" },
    { left: "88%", top: "15%" },
    { left: "12%", top: "40%" },
    { left: "45%", top: "30%" },
    { left: "85%", top: "40%" },
    { left: "30%", top: "85%" },
  ];
  const elements = [
    {
      icon: <Plane size={28} />,
      delay: 0,
      path: {
        x: [0, 100, 50, -50, 0],
        y: [0, -50, -100, -30, 0],
        rotate: [0, 45, 0, -20, 0],
      },
      duration: 30,
      color: "primary",
    },
    {
      icon: <Ship size={24} />,
      delay: 5,
      path: {
        x: [0, -80, -20, 60, 0],
        y: [0, 30, 100, 40, 0],
        rotate: [0, -10, 5, 15, 0],
      },
      duration: 35,
      color: "secondary",
    },
    {
      icon: <Palmtree size={26} />,
      delay: 2,
      path: {
        x: [0, 60, 100, 20, 0],
        y: [0, -70, -30, -80, 0],
        rotate: [0, 5, 20, -10, 0],
      },
      duration: 28,
      color: "accent",
    },
    {
      icon: <Luggage size={22} />,
      delay: 8,
      path: {
        x: [0, -40, 30, -60, 0],
        y: [0, 50, 80, 30, 0],
        rotate: [0, -15, 5, -5, 0],
      },
      duration: 32,
      color: "secondary",
    },
    {
      icon: <Compass size={20} />,
      delay: 3,
      path: {
        x: [0, 70, 20, -30, 0],
        y: [0, -40, 60, 20, 0],
        rotate: [0, 25, -15, 10, 0],
      },
      duration: 26,
      color: "primary",
    },
    {
      icon: <CloudSunRain size={24} />,
      delay: 7,
      path: {
        x: [0, -50, -100, -40, 0],
        y: [0, -60, -20, -90, 0],
        rotate: [0, 10, 0, 15, 0],
      },
      duration: 34,
      color: "accent",
    },
    {
      icon: <Sunrise size={23} />,
      delay: 2.5,
      path: {
        x: [0, 60, -30, -70, 0],
        y: [0, -40, -90, -20, 0],
        rotate: [0, -5, 15, -10, 0],
      },
      duration: 33,
      color: "secondary",
    },
    {
      icon: <Map size={21} />,
      delay: 6,
      path: {
        x: [0, 50, 90, 30, 0],
        y: [0, 60, 20, -50, 0],
        rotate: [0, 20, -10, 5, 0],
      },
      duration: 29,
      color: "primary",
    },
    {
      icon: <Ticket size={19} />,
      delay: 4,
      path: {
        x: [0, -30, -80, 40, 0],
        y: [0, -70, -30, 60, 0],
        rotate: [0, -15, 25, 5, 0],
      },
      duration: 31,
      color: "accent",
    },
    {
      icon: <Users size={22} />,
      delay: 1.5,
      path: {
        x: [0, 90, 40, -40, 0],
        y: [0, 20, 70, 30, 0],
        rotate: [0, 10, -5, 15, 0],
      },
      duration: 27,
      color: "accent",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          style={{
            left: positions[index].left,
            top: positions[index].top,
            color: getElementColor(element.color, index),
            opacity: theme === "dark" ? 0.25 : 0.4,
          }}
          className="absolute filter drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{
            opacity: theme === "dark" ? 0.25 : 0.4,
            x: element.path.x,
            y: element.path.y,
            rotate: element.path.rotate,
          }}
          transition={{
            opacity: { duration: 1.5, delay: element.delay },
            repeat: Infinity,
            duration: element.duration,
            delay: element.delay,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
}
