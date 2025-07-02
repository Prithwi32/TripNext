"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import toast from "react-hot-toast";
import ChatDialog from "../components/ChatDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Guide {
  _id: string;
  guideName: string;
  guideEmail: string;
  profileImage?: string;
  description?: string;
}

interface Package {
  _id: string;
  locations: string[];
  packageDescription: string;
  cost: number;
  tripDays: number;
  images: string[];
  createdAt: string;
  guide: Guide;
}

export default function PackageDetailsPage() {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axiosInstance.get(`/api/package/${packageId}`);
        setPkg(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch package");
      }
    };

    fetchPackage();
  }, [packageId]);

  useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  if (!pkg) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading package...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold mb-2">{pkg.locations.join(", ")}</h1>
        <p className="text-muted-foreground mb-6">Package Details</p>

        <Carousel setApi={setCarouselApi} className="w-full max-w-full">
          <CarouselContent className="h-64 md:h-96">
            {pkg.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Package image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="grid gap-4 md:grid-cols-4 mt-8">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Locations</div>
              <div className="font-semibold">{pkg.locations.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-semibold">{pkg.tripDays} days</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <IndianRupee className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Cost</div>
              <div className="font-semibold">₹{pkg.cost}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-semibold">
                {new Date(pkg.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {pkg.locations.map((location, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {location}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {pkg.packageDescription}
          </p>
        </div>

        {/* Guide Details */}
        <div className="mt-10 p-4 bg-muted rounded-lg border flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={pkg.guide?.profileImage} />
            <AvatarFallback>
              {pkg.guide?.guideName?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{pkg.guide?.guideName}</h3>
            <p className="text-sm text-muted-foreground">{pkg.guide?.guideEmail}</p>
            <p className="text-sm mt-1">{pkg.guide?.description || "No bio available"}</p>
          </div>
          {pkg.guide?._id && (
            <button
              onClick={() => {
                const chatDialog = document.getElementById("chat-dialog-toggle");
                if (chatDialog) chatDialog.click();
              }}
              className="mt-3 sm:mt-0 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat with Guide
            </button>
          )}
        </div>
      </div>

      {/* Floating Chat Interface */}
      {pkg.guide?._id && (
        <ChatDialog
          receiverId={pkg.guide._id}
          userName={pkg.guide.guideName}
          userPhoto={pkg.guide.profileImage}
        />
      )}
    </>
  );
}
