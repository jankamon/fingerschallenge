import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import generateChestUnlockPattern from "../utilities/generateChestUnlockPattern";
import calculateRewardForChest from "../utilities/calculateRewardForChest";
import UserGameStateInterface from "../interfaces/userGameState.interface";

export function getDifficultyLockpicks(difficulty: DifficultyEnum): number {
  if (difficulty === DifficultyEnum.ADEPT) {
    return 20;
  } else if (difficulty === DifficultyEnum.MASTER) {
    return 10;
  }
  return 10; // Default
}

export function createInitialGameState(
  difficulty: DifficultyEnum
): UserGameStateInterface {
  const lockpicksCount = getDifficultyLockpicks(difficulty);
  const chestLevel = 1;
  const unlockPattern = generateChestUnlockPattern(chestLevel);

  return {
    difficulty,
    chestLevel,
    unlockPattern,
    currentStep: 0,
    lockpicksRemaining: lockpicksCount,
    openedChests: 0,
    score: 0,
  };
}

export function processLockpickMove(
  userState: UserGameStateInterface,
  moveData: LockpickMoveEnum
) {
  const { unlockPattern, currentStep, difficulty } = userState;

  // Check if move matches pattern
  if (moveData === unlockPattern[currentStep]) {
    // Correct move
    userState.currentStep += 1;
    const isChestOpen = userState.currentStep >= unlockPattern.length;

    if (isChestOpen) {
      // Reset for next chest
      userState.currentStep = 0;
      userState.openedChests += 1;

      // Increase chest level every 5 opened chests, with a maximum of level 4
      if (userState.openedChests % 5 === 0 && userState.chestLevel < 4) {
        userState.chestLevel += 1;
      }

      const rewardForChest = calculateRewardForChest(
        difficulty,
        userState.chestLevel
      );
      userState.score += rewardForChest;

      return {
        success: true,
        message: "You opened the chest!",
        lockpicksRemaining: userState.lockpicksRemaining,
        isChestOpen: true,
        score: userState.score,
        openedChests: userState.openedChests,
      };
    } else {
      return {
        success: true,
        message: "success",
        lockpicksRemaining: userState.lockpicksRemaining,
      };
    }
  } else {
    // Failed move
    userState.lockpicksRemaining = Math.max(
      0,
      userState.lockpicksRemaining - 1
    );
    userState.currentStep = 0;

    const message =
      userState.lockpicksRemaining > 0
        ? "broken pick"
        : "You have no lockpicks left!";

    return {
      success: false,
      message,
      lockpicksRemaining: userState.lockpicksRemaining,
    };
  }
}
