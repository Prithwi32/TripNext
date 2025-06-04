"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Calendar, CreditCard, Globe, Lock, Clock } from "lucide-react";

export default function FeatureShowcase() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: <MapPin />,
      title: "Find Destinations",
      description: "Discover hundreds of amazing destinations across the globe carefully curated for all types of travelers."
    },
    {
      icon: <Calendar />,
      title: "Easy Planning",
      description: "Plan your trips effortlessly with our intuitive tools that handle scheduling, accommodations, and activities."
    },
    {
      icon: <CreditCard />,
      title: "Best Deals",
      description: "Get exclusive access to the best prices and special offers from our network of travel partners."
    },
    {
      icon: <Globe />,
      title: "Expert Guides",
      description: "Connect with certified local guides who provide authentic experiences and insider knowledge."
    },
    {
      icon: <Lock />,
      title: "Secure Booking",
      description: "Book with confidence using our secure payment system with fraud protection and 24/7 support."
    },
    {
      icon: <Clock />,
      title: "Real-time Updates",
      description: "Stay informed with instant notifications about your bookings, flights, and travel alerts."
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
      
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
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
            We offer a comprehensive travel platform designed to make your journey seamless from planning to return
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
              className="bg-card hover:bg-card/80 dark:hover:bg-card/90 border border-border p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
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
          <div className="inline-block bg-card border border-border rounded-full px-4 py-2 text-sm text-accent dark:text-accent">
            Join 50,000+ happy travelers worldwide
          </div>
        </motion.div>
      </div>
    </div>
  );
}
