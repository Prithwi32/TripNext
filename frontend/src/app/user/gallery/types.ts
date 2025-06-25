export type GalleryImage = {
  id: string;
  imageUrl: string;
  source: "blog" | "trip";
  sourceId: string;
  title: string;
  createdAt: string;
};

export type FilterType = "all" | "blog" | "trip";
