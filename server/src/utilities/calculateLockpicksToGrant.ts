import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";

export default function calculateLockpicksToGrant(
  difficulty: DifficultyEnum,
  chestLevel: number
): number {
  if (!difficulty || !chestLevel) {
    throw new Error("Difficulty and chest level must be provided");
  }

  const difficultyBonus =
    difficulty === DifficultyEnum.ADEPT
      ? 3
      : difficulty === DifficultyEnum.JOURNEYMAN
      ? 2
      : 1;

  return chestLevel + difficultyBonus;
}