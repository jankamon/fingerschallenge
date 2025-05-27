import { saveDailyStats } from "../repositories/gameStatsRepository";

// In-memory batching state
const statsBatch = {
  playersConnected: 0,
  gamesPlayed: 0,
  chestsOpened: 0,
  brokenLockpicks: 0,
  totalLockpickMoves: 0,
  chestPatternsGenerated: 0,
  highestScore: 0,
  highestOpenedChestLevel: 0,
};

let isFlushPending = false;
const FLUSH_DELAY = 5000; // 5 seconds

// We use batching to prevent DB overload, because every game action can trigger a stats update
export const updateDailyStats = async ({
  playerConnected,
  gamePlayed,
  chestOpened,
  brokenLockpick,
  lockpickMove,
  chestPatternGenerated,
  score,
  highestOpenedChestLevel,
}: {
  playerConnected?: boolean;
  gamePlayed?: boolean;
  chestOpened?: boolean;
  brokenLockpick?: boolean;
  lockpickMove?: boolean;
  chestPatternGenerated?: boolean;
  score?: number;
  highestOpenedChestLevel?: number;
}): Promise<void> => {
  // Update in-memory batch
  if (playerConnected) statsBatch.playersConnected++;
  if (gamePlayed) statsBatch.gamesPlayed++;
  if (chestOpened) statsBatch.chestsOpened++;
  if (brokenLockpick) statsBatch.brokenLockpicks++;
  if (lockpickMove) statsBatch.totalLockpickMoves++;
  if (chestPatternGenerated) statsBatch.chestPatternsGenerated++;

  if (score !== undefined) {
    statsBatch.highestScore = Math.max(statsBatch.highestScore, score);
  }

  if (highestOpenedChestLevel !== undefined) {
    statsBatch.highestOpenedChestLevel = Math.max(
      statsBatch.highestOpenedChestLevel,
      highestOpenedChestLevel
    );
  }

  // Schedule a flush if not already pending
  if (!isFlushPending) {
    isFlushPending = true;
    setTimeout(flushStatsBatch, FLUSH_DELAY);
  }
};

export async function flushStatsBatch(): Promise<void> {
  console.log("Flushing stats batch to database...");

  try {
    // Copy current batch
    const batchToFlush = { ...statsBatch };

    // Reset batch for new stats collection
    statsBatch.playersConnected = 0;
    statsBatch.gamesPlayed = 0;
    statsBatch.chestsOpened = 0;
    statsBatch.brokenLockpicks = 0;
    statsBatch.totalLockpickMoves = 0;
    statsBatch.chestPatternsGenerated = 0;
    statsBatch.highestScore = 0;
    statsBatch.highestOpenedChestLevel = 0;

    // Skip DB operation if batch is empty
    if (
      !batchToFlush.playersConnected &&
      !batchToFlush.gamesPlayed &&
      !batchToFlush.chestsOpened &&
      !batchToFlush.brokenLockpicks &&
      !batchToFlush.totalLockpickMoves &&
      !batchToFlush.chestPatternsGenerated &&
      !batchToFlush.highestScore &&
      !batchToFlush.highestOpenedChestLevel
    ) {
      return;
    }

    // Save copied batch to database
    await saveDailyStats(batchToFlush);

    console.log("Stats batch flushed successfully.");
  } catch (error) {
    console.error("Error flushing stats batch:", error);
  } finally {
    // Reset flush pending flag
    isFlushPending = false;
  }
}

// Initialize shutdown handlers
export function initGameStatsHandlers() {
  process.on("SIGINT", async () => {
    console.log("Server shutting down (SIGINT), flushing stats...");
    try {
      await flushStatsBatch();
      console.log("Stats flushed successfully on shutdown");
    } catch (error) {
      console.error("Failed to flush stats on shutdown:", error);
      process.exit(1);
    }

    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Server shutting down (SIGTERM), flushing stats...");
    try {
      await flushStatsBatch();
      console.log("Stats flushed successfully on shutdown");
    } catch (error) {
      console.error("Failed to flush stats on shutdown:", error);
      process.exit(1);
    }

    process.exit(0);
  });
}
