"use client";

import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
