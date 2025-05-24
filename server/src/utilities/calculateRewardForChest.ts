import { DifficultyEnum } from "@shared/enums/difficulty.enum";

export default function calculateRewardForChest(
  difficulty: DifficultyEnum | null,
  chestLevel: number
): number {
  if (!difficulty || !chestLevel) {
    throw new Error("Difficulty and chest level must be provided");
  }

  // Difficulty-based multipliers
  const difficultyMultiplier = difficulty === DifficultyEnum.MASTER ? 3 : 1;

  // Calculate the reward based on chest level and difficulty
  const reward = chestLevel * difficultyMultiplier * 10;

  return Math.max(0, reward);
}
