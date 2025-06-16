"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  avatar: string | null;
  location: string;
  rating: number;
  text: string;
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: null,
      location: "New York, USA",
      rating: 5,
      text: "TripNext made planning my family vacation so simple. The suggestions were spot-on, and the booking process was seamless. Can't imagine traveling without it now!"
    },
    {
      id: 2,
      name: "Miguel Fernandez",
      avatar: null,
      location: "Barcelona, Spain",
      rating: 5,
      text: "As a frequent traveler, I've tried many apps, but TripNext stands out for its intuitive design and excellent customer service. Found amazing local experiences I wouldn't have discovered otherwise."
    },
    {
      id: 3,
      name: "Priya Sharma",
      avatar: null,
      location: "Mumbai, India",
      rating: 5,
      text: "The personalized recommendations were perfect for my travel style. I especially loved the local food suggestions and cultural experiences that felt authentic and off the beaten path."
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: null,
      location: "Sydney, Australia",
      rating: 4,
      text: "TripNext helped me organize a last-minute business trip with minimal stress. The itinerary management and real-time updates were particularly helpful during tight connections."
    },
    {
      id: 5,
      name: "Aiko Tanaka",
      avatar: null,
      location: "Tokyo, Japan",
      rating: 5,
      text: "Their customer service is exceptional. When my flight was canceled, they helped rebook and arrange accommodations within minutes. A lifesaver during travel disruptions!"
    }
  ];

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl opacity-60" />
      
      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">What Our Travelers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have discovered their perfect journeys with TripNext
          </p>
        </motion.div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.5 } 
                  } : {}}
                >
                  <div className="group h-full bg-card hover:bg-card/90 border border-border rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-start mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={testimonial.avatar || ""} alt={testimonial.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Quote className="absolute -bottom-2 -right-2 h-5 w-5 text-primary bg-background rounded-full p-0.5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="text-muted-foreground text-sm leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex">
            <CarouselPrevious className="relative -left-4" />
            <CarouselNext className="relative -right-4" />
          </div>
        </Carousel>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mt-8"
        >
          <div className="bg-accent/10 text-accent rounded-full py-1 px-4 text-sm font-medium">
            Based on 1000+ verified reviews
          </div>
        </motion.div>
      </div>
    </div>
  );
}
