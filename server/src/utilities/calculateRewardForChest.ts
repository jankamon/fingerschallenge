export default function calculateRewardForChest(chestLevel: number): number {
  if (!chestLevel) {
    throw new Error("Chest level must be provided");
  }

  // Calculate the reward based on chest level and difficulty
  const reward = chestLevel * 10;

  return Math.max(0, reward);
}
