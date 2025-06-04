import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, IndianRupee } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface Package {
  _id: string;
  locations: string[];
  packageDescription: string;
  cost: number;
  tripDays: number;
  images: string[];
  createdAt: string;
}

interface PackageDetailsModalProps {
  package: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PackageDetailsModal({
  package: pkg,
  open,
  onOpenChange,
}: PackageDetailsModalProps) {
  const [carouselApi, setCarouselApi] = useState<any>(null);

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

  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hide-scrollbar max-w-4xl max-h-[90vh] overflow-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {pkg.locations.join(", ")}
          </DialogTitle>
          <DialogDescription>Package Details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          <div className="grid gap-4 md:grid-cols-4">
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
                <div className="font-semibold">{pkg.cost}</div>
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

          <div>
            <h3 className="text-lg font-semibold mb-2">Destinations</h3>
            <div className="flex flex-wrap gap-2">
              {pkg.locations.map((location, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {pkg.packageDescription}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
