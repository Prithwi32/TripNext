import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Add a request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user) {
      config.headers.Authorization = `Bearer ${session.user.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
