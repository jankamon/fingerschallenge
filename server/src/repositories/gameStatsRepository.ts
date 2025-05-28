import { AppDataSource } from "../config/dataSource";
import { GameStatEntity } from "../entities/gameStatEntity";
import { MoreThanOrEqual } from "typeorm";

export const GameStatsRepository = AppDataSource.getRepository(GameStatEntity);

// Don't save stats directly by saveDailyStats
// Use batching from gameStatsService
export const saveDailyStats = async (stats: {
  playersConnected: number;
  gamesPlayed: number;
  chestsOpened: number;
  brokenLockpicks: number;
  totalLockpickMoves: number;
  chestPatternsGenerated: number;
  highestScore: number;
  highestOpenedChestLevel: number;
}): Promise<void> => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let existingStat = await GameStatsRepository.findOne({
    where: {
      createdAt: MoreThanOrEqual(today),
    },
  });

  // If stats for today exists - update, otherwise create a new record
  if (existingStat) {
    // Update existing record
    existingStat.playersConnected += stats.playersConnected;
    existingStat.gamesPlayed += stats.gamesPlayed;
    existingStat.chestsOpened += stats.chestsOpened;
    existingStat.brokenLockpicks += stats.brokenLockpicks;
    existingStat.totalLockpickMoves += stats.totalLockpickMoves;
    existingStat.chestPatternsGenerated += stats.chestPatternsGenerated;

    if (stats.highestScore > 0) {
      existingStat.highestScore = Math.max(
        existingStat.highestScore,
        stats.highestScore
      );
    }

    if (stats.highestOpenedChestLevel > 0) {
      existingStat.highestOpenedChestLevel = Math.max(
        existingStat.highestOpenedChestLevel,
        stats.highestOpenedChestLevel
      );
    }

    await GameStatsRepository.save(existingStat);
  } else {
    // Create new record
    const newStat = new GameStatEntity();
    newStat.playersConnected = stats.playersConnected;
    newStat.gamesPlayed = stats.gamesPlayed;
    newStat.chestsOpened = stats.chestsOpened;
    newStat.brokenLockpicks = stats.brokenLockpicks;
    newStat.totalLockpickMoves = stats.totalLockpickMoves;
    newStat.chestPatternsGenerated = stats.chestPatternsGenerated;
    newStat.highestScore = stats.highestScore;
    newStat.highestOpenedChestLevel = stats.highestOpenedChestLevel;

    await GameStatsRepository.save(newStat);
  }
};

export const getGameStats = async (): Promise<GameStatEntity | null> => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStats = await GameStatsRepository.findOne({
    where: {
      createdAt: MoreThanOrEqual(today),
    },
  });

  return todayStats;
};
