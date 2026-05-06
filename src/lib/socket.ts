import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token?: string) {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });
  }

  if (token) {
    socket.auth = { token };
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}