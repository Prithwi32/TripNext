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
  MessageCircle,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import toast from "react-hot-toast";

interface Package {
  _id: string;
  locations: string[];
  packageDescription: string;
  cost: number;
  tripDays: number;
  images: string[];
  createdAt: string;
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
    </div>
    {/* Chat Icon that scrolls with the page */}
<div className="fixed bottom-8 right-5 z-50">
  <button
    className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
    aria-label="Chat"
    onClick={() => toast("Chat interface coming soon!")}
  >
    <MessageCircle className="h-6 w-6" />
  </button>
</div>
</>
  );
}
