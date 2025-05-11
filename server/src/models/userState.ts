import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";

export interface UserGameState {
  difficulty: DifficultyEnum | null;
  chestLevel: number;
  unlockPattern: number[];
  currentStep: number;
  lockpicksRemaining: number;
}

// Store for game states and connections
export const connectedClients = new Map<string, any>();
export const userGameStates = new Map<string, UserGameState>();
