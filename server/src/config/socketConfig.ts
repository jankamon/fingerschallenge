import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { registerGameHandlers } from "../controllers/gameController";

export function configureSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3001",
      methods: ["GET", "POST"],
    },
    pingInterval: 25000,
    pingTimeout: 5000,
  });

  // Connection handler
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    console.log(`Total connected users: ${io.engine.clientsCount}`);

    // Register all game event handlers
    registerGameHandlers(socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      console.log(`Total connected users: ${io.engine.clientsCount}`);
    });
  });

  return io;
}
