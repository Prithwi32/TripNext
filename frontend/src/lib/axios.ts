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
      // Get the token from the session
      const token = session.user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
