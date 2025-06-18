"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { Calendar, Eye, IndianRupee, MapPin, Search } from "lucide-react";
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

export function ExplorePackages() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const res = await axiosInstance.get("/api/package");
        setPackages(res.data.data);
      } catch (error) {
        toast.error("Failed to load travel packages");
      }
    };
    fetchAllPackages();
  }, []);

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.locations.some((location) =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      pkg.packageDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = async (pkgId: string) => {
    try {
      const res = await axiosInstance.get(`/api/package/${pkgId}`);
      setSelectedPackage(res.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error("Failed to fetch package details");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
            Explore Trip Packages
          </h1>
          <p className="text-muted-foreground">Find your next adventure!</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {packages.length} Packages
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by location or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <Card
            key={pkg._id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={pkg.images[0] || "/placeholder.svg"}
                alt="Package"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-black/70 text-white">
                  {pkg.tripDays} Days
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">
                  {pkg.locations.join(", ")}
                </CardTitle>
                <div className="text-lg font-bold text-primary">
                  ₹{pkg.cost}
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {pkg.packageDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{pkg.locations.length} locations</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{pkg.tripDays} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  <span>{pkg.cost}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/user/trip-packages/${pkg._id}`)}
                className="w-full gap-1 bg-secondary bg-gradient-to-r from-primary to-accent hover:bg-secondary/80"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchTerm
            ? "No packages match your search."
            : "No travel packages available."}
        </div>
      )}
    </div>
  );
}
