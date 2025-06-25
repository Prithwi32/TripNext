"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

let socket: Socket | null = null;

export default function ChatSocketProvider() {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    const token = session?.user?.token;

    if (!userId || !token) return;

    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      withCredentials: true,
      auth: { token },
      query: { userId },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected:", socket?.id);
      socket?.emit("registerUser", userId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("connect_error");
      socket?.disconnect();
    };
  }, []);

  return null;
}

export { socket };
