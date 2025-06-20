import { axiosInstance } from "@/lib/axios";
import { Blog, CreateBlogFormData, UpdateBlogFormData } from "./types";

// Function to prepare form data for blog creation/update
const prepareFormData = (data: CreateBlogFormData | UpdateBlogFormData) => {
  const formData = new FormData();

  // Add blog title, description and hashtags
  formData.append("blogTitle", data.blogTitle);
  formData.append("blogDescription", data.blogDescription);
  // Add hashtags as individual form entries to create a proper array on the server
  if (data.hashtags && data.hashtags.length > 0) {
    // Instead of sending as JSON string, append each hashtag individually to create a proper array
    data.hashtags.forEach((tag) => {
      formData.append("hashtags", tag);
    });
  }
  // Add existing image URLs if this is an update
  if ("imageUrls" in data && data.imageUrls && data.imageUrls.length > 0) {
    // Append each image URL individually to create proper array on server
    data.imageUrls.forEach((url) => {
      formData.append("imageUrls", url);
    });
  }

  // Add new images if any
  if (data.blogImages && data.blogImages.length > 0) {
    for (let i = 0; i < data.blogImages.length; i++) {
      formData.append("blogImages", data.blogImages[i]);
    }
  }

  return formData;
};

export const blogService = {
  // Get all blogs from the current user
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await axiosInstance.get("/api/blog/my-blogs");
    return response.data.data;
  },

  // Create a new blog
  createBlog: async (data: CreateBlogFormData): Promise<Blog> => {
    const formData = prepareFormData(data);
    const response = await axiosInstance.post("/api/blog/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Get a blog by ID
  getBlogById: async (id: string): Promise<Blog> => {
    // Since there's no specific endpoint, we'll fetch all blogs and filter
    const blogs = await blogService.getAllBlogs();
    const blog = blogs.find((blog) => blog._id === id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  },

  // Update an existing blog
  updateBlog: async (id: string, data: UpdateBlogFormData): Promise<Blog> => {
    const formData = prepareFormData(data);
    const response = await axiosInstance.put(
      `/api/blog/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  // Delete a blog
  deleteBlog: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/blog/delete/${id}`);
  },
};
