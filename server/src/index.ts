import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

import express from "express";
import { createServer } from "http";
import "reflect-metadata";
import cors from "cors";
import { configureSocket } from "./config/socketConfig";
import { AppDataSource } from "./config/dataSource";
import { flushStatsBatch } from "./services/gameStatsService";
import {
  startUserStateCleanup,
  stopUserStateCleanup,
} from "./services/userStatesService";

// Express setup
const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Database initialization
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection has been established successfully.");

    // Socket.IO setup
    configureSocket(httpServer);

    // Start user state cleanup service
    startUserStateCleanup();

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);

  try {
    // Stop user state cleanup
    stopUserStateCleanup();

    // Flush any pending stats
    await flushStatsBatch();
    console.log("Stats flushed successfully on shutdown");

    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
