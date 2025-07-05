import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { LockpickMoveEnum } from "../../../shared/enums/lockpickMove.enum";
import generateChestUnlockPattern from "../utilities/generateChestUnlockPattern";
import calculateRewardForChest from "../utilities/calculateRewardForChest";
import UserGameStateInterface from "../../../shared/interfaces/userGameState.interface";
import { updateDailyStats } from "../services/gameStatsService";
import calculateLockpicksToGrant from "../utilities/calculateLockpicksToGrant";

export function getDifficultyLockpicks(difficulty: DifficultyEnum): number {
  if (difficulty === DifficultyEnum.ADEPT) {
    return 20;
  } else if (difficulty === DifficultyEnum.JOURNEYMAN) {
    return 15;
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

  // Update game stats
  updateDailyStats({ gamePlayed: true, chestPatternGenerated: true });

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
    lastActivity: new Date(),
  };
}

export function processLockpickMove(
  userState: UserGameStateInterface,
  moveData: LockpickMoveEnum
) {
  const { unlockPattern, currentStep } = userState;

  // Update game stats
  updateDailyStats({ lockpickMove: true });

  // Update last activity timestamp
  userState.lastActivity = new Date();

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
      const rewardForChest = calculateRewardForChest(userState.chestLevel);
      userState.score += rewardForChest;
      userState.highestOpenedChestLevel = userState.chestLevel;

      let lockpicksToGrant = 0;

      // Every 3 opened chests, grant a lockpick and increase chest level
      if (userState.openedChests % 3 === 0) {
        if (userState.chestLevel < 4) {
          userState.chestLevel += 1;
        }

        lockpicksToGrant = calculateLockpicksToGrant(
          userState.difficulty || DifficultyEnum.JOURNEYMAN,
          userState.chestLevel
        );
        userState.lockpicksRemaining += lockpicksToGrant;

        console.log(
          `Granted ${lockpicksToGrant} lockpicks! Total: ${userState.lockpicksRemaining}`
        );
      }

      // Update game stats
      updateDailyStats({
        chestOpened: true,
        score: userState.score,
        highestOpenedChestLevel: userState.highestOpenedChestLevel,
      });

      return {
        success: true,
        lockpicksRemaining: userState.lockpicksRemaining,
        isChestOpen: true,
        score: userState.score,
        openedChests: userState.openedChests,
        highestOpenedChestLevel: userState.highestOpenedChestLevel,
        currentStep: userState.currentStep,
        grantedLockpicks: lockpicksToGrant,
      };
    } else {
      return {
        success: true,
        lockpicksRemaining: userState.lockpicksRemaining,
        currentStep: userState.currentStep,
      };
    }
  } else {
    // After a failed move, we start over
    userState.currentStep = 0;

    // 50% chance to break a lockpick
    const breakLockpick = Math.random() < 0.5;

    if (!breakLockpick) {
      console.log("Move failed, but lockpick not broken.");

      return {
        success: false,
        brokenLockpick: false,
        lockpicksRemaining: userState.lockpicksRemaining,
        currentStep: userState.currentStep,
      };
    }

    userState.lockpicksRemaining = Math.max(
      0,
      userState.lockpicksRemaining - 1
    );

    console.log(
      `Move failed, lockpick broken. Remaining lockpicks: ${userState.lockpicksRemaining}`
    );

    const haveLockpicks = userState.lockpicksRemaining > 0;

    const moreThanThreeChestsOpened = userState.openedChests > 3;

    // Allow saving if the user has opened more than 3 chests and has no lockpicks left
    userState.allowedToSave = moreThanThreeChestsOpened && !haveLockpicks;

    // Update game stats
    updateDailyStats({ brokenLockpick: true });

    return {
      success: false,
      brokenLockpick: true,
      lockpicksRemaining: userState.lockpicksRemaining,
      allowedToSave: userState.allowedToSave,
      currentStep: userState.currentStep,
    };
  }
}

export function getNewUnlockPattern(userState: UserGameStateInterface) {
  let newUnlockPattern = generateChestUnlockPattern(userState.chestLevel);
  let attempts = 0;

  while (
    JSON.stringify(newUnlockPattern) ===
      JSON.stringify(userState.unlockPattern) &&
    attempts < 5
  ) {
    console.log(`Generated the same unlock pattern, retrying...`);

    newUnlockPattern = generateChestUnlockPattern(userState.chestLevel);
    attempts++;
  }

  // Update game stats
  updateDailyStats({ chestPatternGenerated: true });

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
  userState.lastActivity = new Date();
}
