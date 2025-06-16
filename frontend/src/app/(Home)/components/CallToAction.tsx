"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };
  
  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 map-grid opacity-30" />
        </div>
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-card/80 dark:bg-card/50 border border-border rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Start Your <span className="text-gradient">Journey</span>?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Join our community of travelers to receive personalized recommendations, exclusive discounts, and travel inspiration.
                  </p>
                  
                  <div className="hidden md:block">
                    <Button asChild size="lg" className="group">
                      <Link href="/auth/signup">
                        Create Free Account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-background/80 dark:bg-background/40 backdrop-blur-md rounded-xl p-5 border border-border/70 shadow-sm">
                  <h3 className="font-medium text-lg mb-3">Get Travel Updates</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting || isSubmitted}
                        className="bg-transparent"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className={`w-full ${isSubmitted ? 'bg-green-600 hover:bg-green-700' : ''}`} 
                      disabled={isSubmitting || isSubmitted}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : isSubmitted ? (
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                          Subscribed!
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          Subscribe
                        </span>
                      )}
                    </Button>
                  </form>
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    By subscribing, you agree to our terms and privacy policy. We'll never spam you.
                  </p>
                </div>
                
                <div className="block md:hidden mt-8">
                  <Button asChild size="lg" className="w-full group">
                    <Link href="/auth/signup">
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
