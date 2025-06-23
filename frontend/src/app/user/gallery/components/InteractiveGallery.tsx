import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { galleryService } from "../api";
import { FilterType, GalleryImage } from "../types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { GalleryHeader } from "./gallery-header";
import { GalleryFilters } from "./gallery-filters";
import BentoGrid from "./bento-grid";
import { ImageModal } from "./image-modal";

export default function InteractiveGallery() {
  const { data: session } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const data = await galleryService.getUserGallery();
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages =
    activeFilter === "all"
      ? images
      : images.filter((image) => image.source === activeFilter);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Sort images by date for better timeline organization
  const sortedImages = [...filteredImages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className="container mx-auto px-4 pb-20 max-w-7xl">
      {" "}
      <GalleryHeader
        totalImages={filteredImages.length}
        userName={session?.user?.name || ""}
      />
      <GalleryFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        blogCount={images.filter((img) => img.source === "blog").length}
        tripCount={images.filter((img) => img.source === "trip").length}
      />
      {loading ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div key={i} variants={item}>
              <Card className="overflow-hidden">
                <div className="relative pb-[100%]">
                  <Skeleton className="absolute inset-0" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : filteredImages.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">No images found</h3>
          <p className="text-muted-foreground max-w-md">
            {activeFilter === "all"
              ? "You haven't added any images yet. Create trips or blogs to start building your gallery."
              : `You don't have any images from ${activeFilter}s. Create some ${activeFilter}s to see them here.`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BentoGrid images={sortedImages} onImageClick={openImageModal} />
        </motion.div>
      )}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={closeImageModal}
          images={filteredImages}
          onNavigate={setSelectedImage}
        />
      )}
    </div>
  );
}
