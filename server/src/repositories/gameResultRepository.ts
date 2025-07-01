import { AppDataSource } from "../config/dataSource";
import { GameResultEntity } from "../entities/gameResultEntity";
import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";
import { diff } from "util";

export const GameResultRepository =
  AppDataSource.getRepository(GameResultEntity);

export const saveGameResult = async (
  playerId: string,
  username: string = "Nameless",
  openedChests: number,
  score: number,
  difficulty: DifficultyEnum,
  highestOpenedChestLevel: number
): Promise<GameResultEntity> => {
  const gameResult = new GameResultEntity();
  gameResult.playerId = playerId;
  gameResult.username = username;
  gameResult.openedChests = openedChests;
  gameResult.score = score;
  gameResult.difficulty = difficulty;
  gameResult.highestOpenedChestLevel = highestOpenedChestLevel;

  return await GameResultRepository.save(gameResult);
};

export const getTopScores = async (
  difficulty: DifficultyEnum = DifficultyEnum.JOURNEYMAN,
  page: number = 1,
  pageSize: number = 10
): Promise<{ results: GameResultEntity[]; total: number }> => {
  console.log(
    `Fetching top scores from the database (page ${page}, size ${pageSize})`
  );

  const [results, total] = await GameResultRepository.findAndCount({
    where: {
      difficulty: difficulty,
    },
    order: {
      score: "DESC",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const cappedTotal = total > 1000 ? 1000 : total;

  return { results, total: cappedTotal };
};
