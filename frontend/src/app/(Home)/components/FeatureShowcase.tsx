"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Calendar,
  CreditCard,
  Globe,
  ImageIcon,
  MessageCircle,
} from "lucide-react";

export default function FeatureShowcase() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  // Helper functions to get different colors for icons
  const getIconColor = (index: number) => {
    const colors = [
      "text-primary",
      "text-secondary",
      "text-accent",
      "text-rose-500",
      "text-emerald-500",
      "text-amber-500",
    ];
    return colors[index % colors.length];
  };

  const getIconBackgroundColor = (index: number) => {
    const bgColors = [
      "bg-primary/10",
      "bg-secondary/10",
      "bg-accent/10",
      "bg-rose-500/10",
      "bg-emerald-500/10",
      "bg-amber-500/10",
    ];
    return bgColors[index % bgColors.length];
  };
  const getBorderColor = (index: number) => {
    const borderColors = [
      "border-primary/20 hover:border-primary/40",
      "border-secondary/20 hover:border-secondary/40",
      "border-accent/20 hover:border-accent/40",
      "border-rose-500/20 hover:border-rose-500/40",
      "border-emerald-500/20 hover:border-emerald-500/40",
      "border-amber-500/20 hover:border-amber-500/40",
    ];
    return borderColors[index % borderColors.length];
  };

  const getHoverEffect = (index: number) => {
    const hoverEffects = [
      "hover:bg-primary/5",
      "hover:bg-secondary/5",
      "hover:bg-accent/5",
      "hover:bg-rose-500/5",
      "hover:bg-emerald-500/5",
      "hover:bg-amber-500/5",
    ];
    return hoverEffects[index % hoverEffects.length];
  };

  const getTitleColor = (index: number) => {
    const titleColors = [
      "text-primary/90",
      "text-secondary/90",
      "text-accent/90",
      "text-rose-500/90",
      "text-emerald-500/90",
      "text-amber-500/90",
    ];
    return titleColors[index % titleColors.length];
  };

  const features = [
    {
      icon: <MapPin />,
      title: "Find Destinations",
      description:
        "Discover hundreds of amazing destinations across the globe carefully curated for all types of travelers.",
    },
    {
      icon: <Calendar />,
      title: "Easy Planning",
      description:
        "Plan your trips effortlessly with our intuitive tools that handle scheduling, accommodations, and activities.",
    },
    {
      icon: <CreditCard />,
      title: "Best Deals",
      description:
        "Get exclusive access to the best prices and special offers from our network of travel partners.",
    },
    {
      icon: <Globe />,
      title: "Expert Guides",
      description:
        "Connect with certified local guides who provide authentic experiences and insider knowledge.",
    },
    {
      icon: <ImageIcon />,
      title: "Travel Gallery",
      description:
        "Browse user-shared photos and stories to get inspired by real experiences from travelers like you.",
    },
    {
      icon: <MessageCircle />,
      title: "Live Chat with Guides",
      description:
        "Instantly connect with local experts to ask questions, get tips, or personalize your itinerary on the go.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="py-20 bg-muted/50 dark:bg-muted/10 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-secondary/10 blur-3xl opacity-60" />

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 map-grid opacity-40" />
      </div>

      <div
        ref={containerRef}
        className="container mx-auto px-4 sm:px-6 relative z-10"
      >
        <div className="text-center mb-12">
          {" "}
          <motion.h2
            className="text-3xl font-bold mb-4 "
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Why Choose TripNext
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We offer a comprehensive travel platform designed to make your
            journey seamless from planning to return
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : ""}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-card border cursor-pointer ${getBorderColor(
                index
              )} ${getHoverEffect(
                index
              )} p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div
                className={`w-12 h-12 ${getIconBackgroundColor(
                  index
                )} flex items-center justify-center rounded-lg mb-4 ${getIconColor(
                  index
                )}`}
              >
                {feature.icon}
              </div>
              <h3
                className={`text-xl font-medium mb-2 ${getTitleColor(index)}`}
              >
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {" "}
          <div className="inline-block bg-card border border-border rounded-full px-6 py-3 text-sm font-medium">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Join 50,000+ happy travelers worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
