"use client";

import { motion } from "framer-motion";
import { Users, Globe, Award } from "lucide-react";

export default function StatsBanner() {
  // Helper functions for different icon colors and backgrounds
  const getIconColor = (index: number) => {
    const colors = ["text-primary", "text-accent", "text-secondary"];
    return colors[index % colors.length];
  };

  const getIconBackground = (index: number) => {
    const backgrounds = [
      "bg-primary/20 dark:bg-primary/15",
      "bg-accent/20 dark:bg-accent/15",
      "bg-secondary/20 dark:bg-secondary/15",
    ];
    return backgrounds[index % backgrounds.length];
  };
  const getValueColor = (index: number) => {
    const colors = ["text-primary/90", "text-accent/90", "text-secondary/90"];
    return colors[index % colors.length];
  };

  const getStatItemClass = (index: number) => {
    const classes = [
      "bg-primary/5 hover:bg-primary/10 transition-colors duration-300 border-t border-primary/20",
      "bg-accent/5 hover:bg-accent/10 transition-colors duration-300 border-t border-accent/20",
      "bg-secondary/5 hover:bg-secondary/10 transition-colors duration-300 border-t border-secondary/20",
    ];
    return classes[index % classes.length];
  };

  const stats = [
    {
      icon: <Users className="h-5 w-5" />,
      value: "50K+",
      label: "Happy Travelers",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      value: "100+",
      label: "Destinations",
    },
    {
      icon: <Award className="h-5 w-5" />,
      value: "5 Star",
      label: "Experiences",
    },
  ];

  return (
    <motion.div
      className="py-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {" "}
      <div className="container mx-auto px-4">
        <div className="relative backdrop-blur-md bg-gradient-to-r from-primary/10 via-background/80 to-secondary/10 rounded-2xl border border-white/10 dark:border-white/5 p-6 md:p-8 shadow-lg">
          {/* Enhanced background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-0 left-10 w-32 h-32 rounded-full bg-primary/20 dark:bg-primary/10 blur-2xl opacity-50 animate-pulse"
              style={{ animationDuration: "8s" }}
            />
            <div
              className="absolute bottom-0 right-10 w-32 h-32 rounded-full bg-secondary/20 dark:bg-secondary/10 blur-2xl opacity-50 animate-pulse"
              style={{ animationDuration: "12s" }}
            />
            <div
              className="absolute top-20 right-20 w-24 h-24 rounded-full bg-accent/20 dark:bg-accent/10 blur-2xl opacity-40 animate-pulse"
              style={{ animationDuration: "10s" }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className={`flex flex-col items-center rounded-xl p-4 ${getStatItemClass(
                  index
                )}`}
              >
                {" "}
                <motion.div
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${getIconBackground(
                    index
                  )} ${getIconColor(index)} mb-4`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {stat.icon}
                </motion.div>{" "}
                <motion.h3
                  className={`text-2xl md:text-3xl font-bold ${getValueColor(
                    index
                  )}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.3 + 0.2,
                    duration: 0.6,
                    type: "spring",
                  }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
