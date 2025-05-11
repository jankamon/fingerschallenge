import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { LockpickMoveEnum } from "../../shared/enums/lockpickMove.enum";
import { DifficultyEnum } from "../../shared/enums/difficulty.enum";
import generateChestUnlockPattern from "./utilities/generateChestUnlockPattern";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 5000,
});

// Track connected clients
const connectedClients = new Map();
const userGameStates = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  connectedClients.set(socket.id, socket);

  console.log(`User connected: ${socket.id}`);
  console.log(`Total connected users: ${io.engine.clientsCount}`);

  socket.on("select_difficulty", (difficulty: DifficultyEnum, callback) => {
    console.log(`User ${socket.id} selected difficulty: ${difficulty}`);

    // Determine lockpick count based on difficulty
    let lockpicksCount = 10; // Default value
    if (difficulty === DifficultyEnum.ADEPT) {
      lockpicksCount = 20;
    } else if (difficulty === DifficultyEnum.MASTER) {
      lockpicksCount = 10;
    }

    const newChestLevel = 1; // Default chest level
    const newChestPattern = generateChestUnlockPattern(newChestLevel);

    // Store user game state
    userGameStates.set(socket.id, {
      difficulty,
      chestLevel: newChestLevel,
      unlockPattern: newChestPattern,
      currentStep: 0,
      lockpicksRemaining: lockpicksCount,
    });

    console.log(`Created pattern for user ${socket.id}: [${newChestPattern}]`);

    if (callback) {
      callback({ lockpicksCount, newChestLevel });

      console.log(
        `Sending ${lockpicksCount} lockpicks to user ${socket.id} for difficulty ${difficulty}`
      );
    }
  });

  socket.on("lockpick_move", (moveData: LockpickMoveEnum) => {
    const userState = userGameStates.get(socket.id);

    if (!userState) {
      console.log(`No game state found for user ${socket.id}`);

      socket.emit("move_result", {
        success: false,
        message: "Please select difficulty first",
        lockpicksRemaining: 0,
        step: 0,
      });

      return;
    }

    const { unlockPattern, currentStep } = userState;
    console.log(
      `User ${socket.id} made move: ${moveData}, pattern step ${currentStep}: ${unlockPattern[currentStep]}`
    );

    // Check if move matches the pattern for this step
    if (moveData === unlockPattern[currentStep]) {
      // Correct move
      userState.currentStep += 1;

      // Check if chest is now open
      const isChestOpen = userState.currentStep >= unlockPattern.length;

      if (isChestOpen) {
        // Reset for next chest
        userState.currentStep = 0;

        // Send success result
        socket.emit("move_result", {
          success: true,
          message: "You opened the chest!",
          lockpicksRemaining: userState.lockpicksRemaining,
          isChestOpen: true,
          step: 0,
        });
      } else {
        // Send success for this step
        socket.emit("move_result", {
          success: true,
          message: "success",
          lockpicksRemaining: userState.lockpicksRemaining,
          step: userState.currentStep,
        });
      }
    } else {
      // Failed move - break a lockpick
      userState.lockpicksRemaining = Math.max(
        0,
        userState.lockpicksRemaining - 1
      );
      userState.currentStep = 0; // Reset progress

      // Determine message based on remaining lockpicks
      const message =
        userState.lockpicksRemaining > 0
          ? "broken pick"
          : "You have no picklocks left!";

      socket.emit("move_result", {
        success: false,
        message,
        lockpicksRemaining: userState.lockpicksRemaining,
        step: 0,
      });
    }

    // Update the game state
    userGameStates.set(socket.id, userState);
  });

  // On disconnect, clean up
  socket.on("disconnect", () => {
    connectedClients.delete(socket.id);
    userGameStates.delete(socket.id);

    console.log(`User disconnected: ${socket.id}`);
    console.log(`Total connected users: ${io.engine.clientsCount}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
