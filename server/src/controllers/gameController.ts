import { Socket } from "socket.io";
import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import { connectedClients, userGameStates } from "../models/userState";
import {
  createInitialGameState,
  getNewUnlockPattern,
  processLockpickMove,
  resetGameState,
} from "../services/gameService";
import {
  getTopScores,
  saveGameResult,
} from "../repositories/gameResultRepository";
import { getGameStats } from "../repositories/gameStatsRepository";

export function registerGameHandlers(socket: Socket) {
  // Store socket reference
  connectedClients.set(socket.id, socket);

  // Handle difficulty selection
  socket.on("select_difficulty", (difficulty: DifficultyEnum, callback) => {
    console.log(`User ${socket.id} selected difficulty: ${difficulty}`);

    const gameState = createInitialGameState(difficulty);
    userGameStates.set(socket.id, gameState);

    console.log(
      `Created pattern for user ${socket.id}: [${gameState.unlockPattern}]`
    );

    if (callback) {
      callback({
        lockpicksCount: gameState.lockpicksRemaining,
        newChestLevel: gameState.chestLevel,
      });

      console.log(
        `Sending ${gameState.lockpicksRemaining} lockpicks to user ${socket.id} for difficulty ${difficulty}`
      );
    }
  });

  // Handle lockpick move
  socket.on("lockpick_move", (moveData: LockpickMoveEnum, callback) => {
    const userState = userGameStates.get(socket.id);

    if (!userState) {
      console.log(`No game state found for user ${socket.id}`);
      if (callback) {
        callback({
          success: false,
          message: "Please select difficulty first",
          lockpicksRemaining: 0,
          step: 0,
        });
      }
      return;
    }

    // Process move and get result
    const result = processLockpickMove(userState, moveData);

    console.log(
      `User ${socket.id} made move: ${moveData}, pattern step ${
        userState.currentStep
      }: ${userState.unlockPattern[userState.currentStep]}, result: ${
        result.success
      }`
    );

    // Update the game state
    userGameStates.set(socket.id, userState);

    // Send result to client
    if (callback) {
      callback(result);
    }
  });

  // Handle next chest request
  socket.on("next_chest", (callback) => {
    const userState = userGameStates.get(socket.id);

    if (!userState) {
      console.log(`No game state found for user ${socket.id}`);
      return;
    }

    // Get new unlock pattern
    const newUnlockPattern = getNewUnlockPattern(userState, socket.id);

    userState.unlockPattern = newUnlockPattern;

    // Reset current step
    userState.currentStep = 0;

    // Update the game state
    userGameStates.set(socket.id, userState);

    console.log(
      `Generated new chest for user ${socket.id}, level ${userState.chestLevel}, pattern: [${newUnlockPattern}]`
    );

    if (callback) {
      callback({
        newChestLevel: userState.chestLevel,
      });
    }
  });

  // Handle save result
  socket.on("save_result", async (username: string, callback) => {
    const userState = userGameStates.get(socket.id);
    const allowedToSave = userState?.allowedToSave;

    if (!userState || !allowedToSave) {
      console.log(
        `No game state found for user ${socket.id} or not allowed to save`
      );
      if (callback) {
        callback({ success: false });
      }
      return;
    }

    console.log(
      `Saving result for user ${socket.id}, game state: ${JSON.stringify(
        userState
      )}`
    );

    // Save game result to database
    const savedResult = await saveGameResult(
      socket.id,
      username,
      userState.openedChests,
      userState.score,
      userState.difficulty || DifficultyEnum.ADEPT,
      userState.highestOpenedChestLevel
    );

    // Check if save was successful
    if (!savedResult) {
      console.log(`Failed to save result for user ${socket.id}`);
      if (callback) {
        callback({ success: false });
      }
      return;
    }

    if (callback) {
      callback({ success: true });
    }
  });

  // Handle reset game state
  socket.on("reset_game_state", () => {
    const userState = userGameStates.get(socket.id);
    if (!userState) {
      console.log(`No game state found for user ${socket.id}`);
      return;
    }

    // Reset game state
    resetGameState(userState);
  });

  // Handle leaderboard request
  socket.on(
    "get_leaderboard",
    async (
      difficulty: DifficultyEnum = DifficultyEnum.JOURNEYMAN,
      page: number = 1,
      pageSize: number = 10,
      callback
    ) => {
      // Fetch leaderboard data from database
      const { results: leaderboard, total } = await getTopScores(
        difficulty,
        page,
        pageSize
      );

      if (!leaderboard) {
        console.log(`Failed to fetch leaderboard`);
        if (callback) {
          callback({ results: [], total: 0, page, pageSize });
        }
        return;
      }

      if (callback) {
        callback({ results: leaderboard, total, page, pageSize });
      }
    }
  );

  socket.on("get_game_stats", async (callback) => {
    // Fetch game stats from database
    const stats = await getGameStats();

    if (!stats) {
      console.log(`Failed to fetch game stats`);
      if (callback) {
        callback(null);
      }
      return;
    }

    if (callback) {
      callback(stats);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    connectedClients.delete(socket.id);
    userGameStates.delete(socket.id);
  });
}
