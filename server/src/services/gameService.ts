import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import generateChestUnlockPattern from "../utilities/generateChestUnlockPattern";
import calculateRewardForChest from "../utilities/calculateRewardForChest";
import UserGameStateInterface from "../../../shared/interfaces/userGameState.interface";

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
    highestOpenedChestLevel: 0,
    score: 0,
    allowedToSave: false,
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

      // Grant score for opening the chest, before increasing chest level
      const rewardForChest = calculateRewardForChest(
        difficulty,
        userState.chestLevel
      );
      userState.score += rewardForChest;

      // Increase chest level every 3 opened chests, with a maximum of level 4
      if (userState.openedChests % 3 === 0 && userState.chestLevel < 4) {
        userState.chestLevel += 1;
      }
      userState.highestOpenedChestLevel = userState.chestLevel;

      return {
        success: true,
        message: "You opened the chest!",
        lockpicksRemaining: userState.lockpicksRemaining,
        isChestOpen: true,
        score: userState.score,
        openedChests: userState.openedChests,
        highestOpenedChestLevel: userState.chestLevel,
        currentStep: userState.currentStep,
      };
    } else {
      return {
        success: true,
        message: "success",
        lockpicksRemaining: userState.lockpicksRemaining,
        currentStep: userState.currentStep,
      };
    }
  } else {
    // Failed move
    userState.lockpicksRemaining = Math.max(
      0,
      userState.lockpicksRemaining - 1
    );
    userState.currentStep = 0;

    const haveLockpicks = userState.lockpicksRemaining > 0;

    const message = haveLockpicks
      ? "Broken pick"
      : "You have no lockpicks left!";

    const moreThanThreeChestsOpened = userState.openedChests > 3;

    // Allow saving if the user has opened more than 3 chests and has no lockpicks left
    userState.allowedToSave = moreThanThreeChestsOpened && !haveLockpicks;

    return {
      success: false,
      message,
      lockpicksRemaining: userState.lockpicksRemaining,
      allowedToSave: userState.allowedToSave,
      currentStep: userState.currentStep,
    };
  }
}

export function getNewUnlockPattern(
  userState: UserGameStateInterface,
  socketId: string
) {
  let newUnlockPattern = generateChestUnlockPattern(userState.chestLevel);
  let attempts = 0;

  while (
    JSON.stringify(newUnlockPattern) ===
      JSON.stringify(userState.unlockPattern) &&
    attempts < 5
  ) {
    console.log(
      `Generated the same unlock pattern for user ${socketId}, retrying...`
    );

    newUnlockPattern = generateChestUnlockPattern(userState.chestLevel);
    attempts++;
  }

  return newUnlockPattern;
}

export function resetGameState(userState: UserGameStateInterface) {
  userState.difficulty = null;
  userState.chestLevel = 0;
  userState.unlockPattern = [];
  userState.currentStep = 0;
  userState.lockpicksRemaining = 0;
  userState.openedChests = 0;
  userState.highestOpenedChestLevel = 0;
  userState.score = 0;
  userState.allowedToSave = false;
}
