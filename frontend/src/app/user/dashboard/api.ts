import { axiosInstance } from "@/lib/axios";

export type Activity = {
  type: "trip" | "blog";
  title: string;
  description: string;
  image: string;
  createdAt: string;
  id: string;
};

export type UserStats = {
  tripCount: number;
  blogCount: number;
  commentCount: number;
};

export type UserActivityResponse = {
  stats: UserStats;
  recentActivity: Activity[];
};

export const userService = {
  // Get user's recent activity and stats
  getRecentActivity: async (): Promise<UserActivityResponse> => {
    try {
      const response = await axiosInstance.get("/api/user/recent-activity");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch recent activity", error);
      // Return default empty values if the request fails
      return {
        stats: {
          tripCount: 0,
          blogCount: 0,
          commentCount: 0,
        },
        recentActivity: [],
      };
    }
  },
};
