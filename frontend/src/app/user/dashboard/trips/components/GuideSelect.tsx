"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Guide } from "../types";
import { tripService } from "../api";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GuideSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function GuideSelect({ value, onChange }: GuideSelectProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const guidesData = await tripService.getAllGuides();
        setGuides(guidesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching guides:", err);
        setError("Failed to load guides");
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleChange = (selectedValue: string) => {
    if (selectedValue === "none") {
      onChange(null);
    } else {
      onChange(selectedValue);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }
  // Check if the provided guide ID exists in our guides list
  const isValidGuide = value && guides.some((guide) => guide._id === value);

  // If we have a value but it's not valid, default to "none"
  const actualValue = isValidGuide ? value : "none";

  // Find the selected guide for displaying custom content
  const selectedGuide = value
    ? guides.find((guide) => guide._id === value)
    : null;

  return (
    <Select value={actualValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a guide (optional)">
          {selectedGuide ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={selectedGuide.profileImage}
                  alt={selectedGuide.guideName}
                />
                <AvatarFallback className="text-black bg-slate-300 text-xs">
                  {selectedGuide.guideName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{selectedGuide.guideName}</span>
            </div>
          ) : (
            "No guide (self-guided trip)"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="font-medium">
          No guide (self-guided trip)
        </SelectItem>

        {guides.map((guide) => (
          <SelectItem key={guide._id} value={guide._id} className="py-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={guide.profileImage} alt={guide.guideName} />
                <AvatarFallback className="text-black bg-slate-300">
                  {guide.guideName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{guide.guideName}</p>
                <p className="text-xs opacity-70">
                  {guide.guideEmail}
                </p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
