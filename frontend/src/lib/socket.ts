"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function ChatSocketProvider() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      withCredentials: true,
      auth: {
        token,
      },
    });

    socket.emit("addUser", userId);

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  return null;
}

export { socket };
