import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import { UserGameState } from "../models/userState";
import generateChestUnlockPattern from "../utilities/generateChestUnlockPattern";

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
): UserGameState {
  const lockpicksCount = getDifficultyLockpicks(difficulty);
  const chestLevel = 1;
  const unlockPattern = generateChestUnlockPattern(chestLevel);

  return {
    difficulty,
    chestLevel,
    unlockPattern,
    currentStep: 0,
    lockpicksRemaining: lockpicksCount,
  };
}

export function processLockpickMove(
  userState: UserGameState,
  moveData: LockpickMoveEnum
) {
  const { unlockPattern, currentStep } = userState;

  // Check if move matches pattern
  if (moveData === unlockPattern[currentStep]) {
    // Correct move
    userState.currentStep += 1;
    const isChestOpen = userState.currentStep >= unlockPattern.length;

    if (isChestOpen) {
      // Reset for next chest
      userState.currentStep = 0;
      return {
        success: true,
        message: "You opened the chest!",
        lockpicksRemaining: userState.lockpicksRemaining,
        isChestOpen: true,
        step: 0,
      };
    } else {
      return {
        success: true,
        message: "success",
        lockpicksRemaining: userState.lockpicksRemaining,
        step: userState.currentStep,
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
        : "You have no picklocks left!";

    return {
      success: false,
      message,
      lockpicksRemaining: userState.lockpicksRemaining,
      step: 0,
    };
  }
}
