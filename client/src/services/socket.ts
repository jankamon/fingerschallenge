import { io, Socket } from "socket.io-client";

let socket: Socket;

const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      // transports: ["websocket", "polling"], uncomment after SSL configuration
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  }

  return socket;
};

export default getSocket();
