import { axiosInstance } from "@/lib/axios";
import { GalleryImage } from "./types";

export type GalleryResponse = {
  totalImages: number;
  images: GalleryImage[];
};

export const galleryService = {
  getUserGallery: async (): Promise<GalleryResponse> => {
    try {
      const response = await axiosInstance.get("/api/user/gallery");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
      return {
        totalImages: 0,
        images: [],
      };
    }
  },
};
