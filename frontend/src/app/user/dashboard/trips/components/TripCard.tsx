"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Trash2,
  Edit,
  Eye,
  User,
  Tag,
  IndianRupee,
} from "lucide-react";
import { Trip } from "../types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface TripCardProps {
  trip: Trip;
  onEdit: (tripId: string) => void;
  onDelete: (tripId: string) => void;
}

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const formattedDate = formatDate(new Date(trip.createdAt));
  const { theme } = useTheme();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group relative border-primary/5">
      {/* Card Ribbon - Cost Badge */}
      <div className="absolute top-0 right-0 z-10 mt-4 transform translate-x-1">
        <Badge className="shadow-md bg-gradient-to-r from-primary to-primary/80 border-0 px-3 py-1.5 text-white font-medium">
          <IndianRupee className="h-3.5 w-3.5 mr-1 inline-flex" />
          {trip.cost}
        </Badge>
      </div>

      {/* Image with Overlay */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={trip.tripImages[0] || "/travel1.avif"}
          alt={trip.tripLocation}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Location Badge */}
        <div className="absolute bottom-0 left-0 p-3 w-full">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-white truncate">
              {trip.tripLocation}
            </h3>
            <div className="flex items-center gap-1 text-xs text-white/80 bg-black/30 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <CardContent className="pt-4 pb-2">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {trip.tripDescription}
        </p>

        {/* Tags */}
        {trip.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <div className="bg-muted/50 rounded-full px-1.5 py-0.5 inline-flex items-center mr-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
            </div>
            {trip.hashtags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`${
                  theme == "dark"
                    ? "text-white/80 bg-secondary/75"
                    : "bg-secondary/50"
                } text-xs px-2 py-0.5  hover:bg-secondary/60`}
              >
                #{tag}
              </Badge>
            ))}
            {trip.hashtags.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 hover:bg-muted/80"
              >
                +{trip.hashtags.length - 2}
              </Badge>
            )}
          </div>
        )}
        {/* Guide Information */}
        {trip.guideDetails ? (
          <div className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg mb-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage
                src={trip.guideDetails.profileImage}
                alt={trip.guideDetails.guideName}
              />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {trip.guideDetails.guideName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {trip.guideDetails.guideName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {trip.guideDetails.guideEmail}
              </p>
            </div>
          </div>
        ) : trip.guide ? (
          <div className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg mb-3">
            <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Guide Assigned</p>
              <p className="text-xs text-muted-foreground">
                Details loading...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-2 px-3 bg-primary/5 rounded-lg mb-3 border border-primary/10">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                Self-Guided Trip
              </p>
              <p className="text-xs text-muted-foreground">
                Explore at your own pace
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {/* Actions Footer */}
      <CardFooter className="flex justify-between pt-2 pb-3 border-t">
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href={`/user/dashboard/trips/${trip._id}`}>
            <Eye className="h-4 w-4 mr-1.5" />
            View Details
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-secondary"
            onClick={() => onEdit(trip._id)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive"
            onClick={() => onDelete(trip._id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
