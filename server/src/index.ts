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
import { initGameStatsHandlers } from "./services/gameStatsService";

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

    // Initialize game stats handlers
    initGameStatsHandlers();

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
