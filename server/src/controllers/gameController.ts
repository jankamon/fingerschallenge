import { Socket } from "socket.io";
import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import { connectedClients, userGameStates } from "../models/userState";
import {
  createInitialGameState,
  processLockpickMove,
} from "../services/gameService";

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

    console.log(
      `User ${socket.id} made move: ${moveData}, pattern step ${
        userState.currentStep
      }: ${userState.unlockPattern[userState.currentStep]}`
    );

    // Process move and get result
    const result = processLockpickMove(userState, moveData);

    // Update the game state
    userGameStates.set(socket.id, userState);

    // Send result to client
    socket.emit("move_result", result);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    connectedClients.delete(socket.id);
    userGameStates.delete(socket.id);
  });
}
