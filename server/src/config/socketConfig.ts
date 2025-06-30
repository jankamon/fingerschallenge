import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { registerGameHandlers } from "../controllers/gameController";
import { updateDailyStats } from "../services/gameStatsService";

export function configureSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    pingInterval: 1800000, // 30 minutes
    pingTimeout: 60000, // 1 minute
  });

  // Connection handler
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    console.log(`Total connected users: ${io.engine.clientsCount}`);

    // Register all game event handlers
    registerGameHandlers(socket);

    // Update game stats
    updateDailyStats({ playerConnected: true });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      console.log(`Total connected users: ${io.engine.clientsCount}`);
    });
  });

  return io;
}
