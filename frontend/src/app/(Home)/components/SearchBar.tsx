"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [focused, setFocused] = useState<string | null>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };
  
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto bg-card/60 backdrop-blur-lg border border-border dark:border-white/10 rounded-xl p-4 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div 
          className={`flex-1 flex items-center gap-2 bg-background rounded-lg px-3 py-2 border transition-all ${
            focused === 'destination' ? 'border-primary ring-2 ring-primary/10' : 'border-border'
          }`}
        >
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Where to?" 
            className="border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
            onFocus={() => setFocused('destination')}
            onBlur={() => setFocused(null)}
          />
        </div>
        
        <div 
          className={`flex-1 flex items-center gap-2 bg-background rounded-lg px-3 py-2 border transition-all ${
            focused === 'dates' ? 'border-primary ring-2 ring-primary/10' : 'border-border'
          }`}
        >
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="When?" 
            className="border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
            onFocus={() => setFocused('dates')}
            onBlur={() => setFocused(null)}
          />
        </div>
        
        <div 
          className={`flex-1 flex items-center gap-2 bg-background rounded-lg px-3 py-2 border transition-all ${
            focused === 'guests' ? 'border-primary ring-2 ring-primary/10' : 'border-border'
          }`}
        >
          <Users className="h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Travelers" 
            className="border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
            onFocus={() => setFocused('guests')}
            onBlur={() => setFocused(null)}
          />
        </div>
        
        <Button type="submit" className="h-full px-6">
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </form>
    </motion.div>
  );
}
