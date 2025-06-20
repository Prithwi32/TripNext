export type Blog = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  blogImages: string[];
  user: string; // Types.ObjectId as string
  blogTitle: string;
  blogDescription: string;
  blogComments: string[]; // Types.ObjectId[] as string[]
  hashtags: string[];
};

export type CreateBlogFormData = {
  blogTitle: string;
  blogDescription: string;
  hashtags: string[];
  blogImages?: FileList;
};

export type UpdateBlogFormData = {
  blogTitle: string;
  blogDescription: string;
  hashtags: string[];
  imageUrls: string[]; // Existing images
  blogImages?: FileList; // New images to upload
};
