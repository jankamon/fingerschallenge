// Returns array of 0, 1 basing on the chest level (0-3)
// 1 level have length 3
// 2 level have length 5
// 3 level have length 8
// 4 level have length 12
export default function (chestLevel: number): number[] {
  const patternLength =
    chestLevel === 1 ? 3 : chestLevel === 2 ? 5 : chestLevel === 3 ? 8 : 12;

  const pattern: number[] = [];

  for (let i = 0; i < patternLength; i++) {
    pattern.push(Math.floor(Math.random() * 2));
  }

  return pattern;
}
