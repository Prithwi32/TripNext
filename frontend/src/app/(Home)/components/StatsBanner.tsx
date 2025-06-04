"use client";

import { motion } from "framer-motion";
import { Users, Globe, Award } from "lucide-react";

export default function StatsBanner() {
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
      <div className="container mx-auto px-4">
        <div className="relative backdrop-blur-md bg-gradient-to-r from-primary/10 via-background/80 to-secondary/10 rounded-2xl border border-white/10 dark:border-white/5 p-6 md:p-8 shadow-lg">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-10 w-32 h-32 rounded-full bg-primary/20 dark:bg-primary/10 blur-2xl opacity-50" />
            <div className="absolute bottom-0 right-10 w-32 h-32 rounded-full bg-secondary/20 dark:bg-secondary/10 blur-2xl opacity-50" />
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">{stat.value}</h3>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
