// Returns array of 0, 1 basing on the chest level (1-4)
// 1 level have length 2
// 2 level have length 3
// 3 level have length 5
// 4 level have length 8
export default function (chestLevel: number): number[] {
  if (chestLevel < 1 || chestLevel > 4) {
    throw new Error("Chest level must be between 1 and 4");
  }

  const patternLength =
    chestLevel === 1 ? 2 : chestLevel === 2 ? 3 : chestLevel === 3 ? 5 : 8;

  const pattern: number[] = [];

  for (let i = 0; i < patternLength; i++) {
    pattern.push(Math.floor(Math.random() * 2));
  }

  return pattern;
}
