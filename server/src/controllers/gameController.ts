import { Socket } from "socket.io";
import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import { userGameStates } from "../models/userState";
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
  // Restore user game state if it exists
  socket.on("restore_game_state", (playerId: string, callback) => {
    const userState = userGameStates.get(playerId);

    if (userState) {
      console.log(`Restored game state for user ${playerId}`);
      callback(userState);
    } else {
      console.log(`No game state found for user ${playerId}`);
      callback(null);
    }
  });

  // Handle difficulty selection
  socket.on(
    "select_difficulty",
    (data: { playerId: string; difficulty: DifficultyEnum }, callback) => {
      const { playerId, difficulty } = data;

      console.log(`User ${playerId} selected difficulty: ${difficulty}`);

      const gameState = createInitialGameState(difficulty);
      userGameStates.set(playerId, gameState);

      console.log(
        `Created pattern for user ${playerId}: [${gameState.unlockPattern}]`
      );

      if (callback) {
        callback({
          lockpicksCount: gameState.lockpicksRemaining,
          newChestLevel: gameState.chestLevel,
        });

        console.log(
          `Sending ${gameState.lockpicksRemaining} lockpicks to user ${playerId} for difficulty ${difficulty}`
        );
      }
    }
  );

  // Handle lockpick move
  socket.on(
    "lockpick_move",
    (data: { playerId: string; move: LockpickMoveEnum }, callback) => {
      const { playerId, move } = data;

      const userState = userGameStates.get(playerId);

      if (!userState) {
        console.log(`No game state found for user ${playerId}`);
        if (callback) {
          callback({
            success: false,
            lockpicksRemaining: 0,
            step: 0,
          });
        }
        return;
      }

      // Process move and get result
      const result = processLockpickMove(userState, move);

      console.log(
        `User ${playerId} made move: ${move}, pattern step ${
          userState.currentStep
        }: ${userState.unlockPattern[userState.currentStep]}, result: ${
          result.success
        }`
      );

      // Update the game state
      userGameStates.set(playerId, userState);

      // Send result to client
      if (callback) {
        callback(result);
      }
    }
  );

  // Handle next chest request
  socket.on("next_chest", (playerId: string, callback) => {
    const userState = userGameStates.get(playerId);

    if (!userState) {
      console.log(`No game state found for user ${playerId}`);
      return;
    }

    // Get new unlock pattern
    const newUnlockPattern = getNewUnlockPattern(userState);

    userState.unlockPattern = newUnlockPattern;

    // Reset current step
    userState.currentStep = 0;

    // Update the game state
    userGameStates.set(playerId, userState);

    console.log(
      `Generated new chest for user ${playerId}, level ${userState.chestLevel}, pattern: [${newUnlockPattern}]`
    );

    if (callback) {
      callback({
        newChestLevel: userState.chestLevel,
      });
    }
  });

  // Handle save result
  socket.on(
    "save_result",
    async (data: { playerId: string; username: string }, callback) => {
      const { playerId, username } = data;

      const userState = userGameStates.get(playerId);
      const allowedToSave = userState?.allowedToSave;

      if (!userState || !allowedToSave) {
        console.log(
          `No game state found for user ${playerId} or not allowed to save`
        );
        if (callback) {
          callback({ success: false });
        }
        return;
      }

      console.log(
        `Saving result for user ${playerId}, game state: ${JSON.stringify(
          userState
        )}`
      );

      // Save game result to database
      const savedResult = await saveGameResult(
        playerId,
        username,
        userState.openedChests,
        userState.score,
        userState.difficulty || DifficultyEnum.ADEPT,
        userState.highestOpenedChestLevel
      );

      // Check if save was successful
      if (!savedResult) {
        console.log(`Failed to save result for user ${playerId}`);
        if (callback) {
          callback({ success: false });
        }
        return;
      }

      if (callback) {
        callback({ success: true });
      }
    }
  );

  // Handle reset game state
  socket.on("reset_game_state", (playerId: string) => {
    const userState = userGameStates.get(playerId);
    if (!userState) {
      console.log(`No game state found for user ${playerId}`);
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

  // Handle game stats request
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
}
