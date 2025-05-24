import { AppDataSource } from "../config/dataSource";
import { GameResultEntity } from "../entities/gameResultEntity";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";

export const GameResultRepository =
  AppDataSource.getRepository(GameResultEntity);

export const saveGameResult = async (
  socketId: string,
  username: string = "Nameless",
  openedChests: number,
  score: number,
  difficulty: DifficultyEnum,
  highestOpenedChestLevel: number
): Promise<GameResultEntity> => {
  const gameResult = new GameResultEntity();
  gameResult.socketId = socketId;
  gameResult.username = username;
  gameResult.openedChests = openedChests;
  gameResult.score = score;
  gameResult.difficulty = difficulty;
  gameResult.highestOpenedChestLevel = highestOpenedChestLevel;

  return await GameResultRepository.save(gameResult);
};

export const getTopScores = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ results: GameResultEntity[]; total: number }> => {
  console.log(
    `Fetching top scores from the database (page ${page}, size ${pageSize})`
  );

  const [results, total] = await GameResultRepository.findAndCount({
    order: {
      score: "DESC",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { results, total };
};
