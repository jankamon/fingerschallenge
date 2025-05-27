import { AppDataSource } from "../config/dataSource";
import { GameStatEntity } from "../entities/gameStatEntity";
import { MoreThanOrEqual } from "typeorm";

export const GameStatRepository = AppDataSource.getRepository(GameStatEntity);

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

// We use batching to prevent db overload, because every game action can trigger a stats update
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

async function flushStatsBatch(): Promise<void> {
  try {
    console.log("Flushing stats batch to database...");
    // Copy current batch and reset
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

    // Reset flush pending flag
    isFlushPending = false;

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

    // Now update database with batched data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let existingStat = await GameStatRepository.findOne({
      where: {
        createdAt: MoreThanOrEqual(today),
      },
    });

    if (existingStat) {
      // Update existing record
      existingStat.playersConnected += batchToFlush.playersConnected;
      existingStat.gamesPlayed += batchToFlush.gamesPlayed;
      existingStat.chestsOpened += batchToFlush.chestsOpened;
      existingStat.brokenLockpicks += batchToFlush.brokenLockpicks;
      existingStat.totalLockpickMoves += batchToFlush.totalLockpickMoves;
      existingStat.chestPatternsGenerated +=
        batchToFlush.chestPatternsGenerated;

      if (batchToFlush.highestScore > 0) {
        existingStat.highestScore = Math.max(
          existingStat.highestScore,
          batchToFlush.highestScore
        );
      }

      if (batchToFlush.highestOpenedChestLevel > 0) {
        existingStat.highestOpenedChestLevel = Math.max(
          existingStat.highestOpenedChestLevel,
          batchToFlush.highestOpenedChestLevel
        );
      }

      await GameStatRepository.save(existingStat);
    } else {
      // Create new record
      const newStat = new GameStatEntity();
      newStat.playersConnected = batchToFlush.playersConnected;
      newStat.gamesPlayed = batchToFlush.gamesPlayed;
      newStat.chestsOpened = batchToFlush.chestsOpened;
      newStat.brokenLockpicks = batchToFlush.brokenLockpicks;
      newStat.totalLockpickMoves = batchToFlush.totalLockpickMoves;
      newStat.chestPatternsGenerated = batchToFlush.chestPatternsGenerated;
      newStat.highestScore = batchToFlush.highestScore;
      newStat.highestOpenedChestLevel = batchToFlush.highestOpenedChestLevel;

      await GameStatRepository.save(newStat);
    }
  } catch (error) {
    console.error("Error flushing stats batch:", error);
  } finally {
    // Reset flush pending flag
    isFlushPending = false;

    console.log("Stats batch flushed successfully.");
  }
}

// Handle graceful shutdown
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
