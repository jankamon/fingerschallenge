import { DifficultyEnum } from "../enums/difficulty.enum";

export default interface UserGameStateInterface {
  difficulty: DifficultyEnum | null;
  chestLevel: number;
  unlockPattern: number[];
  currentStep: number;
  lockpicksRemaining: number;
  openedChests: number;
  highestOpenedChestLevel: number;
  score: number;
  allowedToSave: boolean;
  username?: string;
}
