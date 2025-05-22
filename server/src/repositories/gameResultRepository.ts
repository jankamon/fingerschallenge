import { AppDataSource } from "../config/dataSource";
import { GameResultEntity } from "../entities/gameResultEntity";
import { DifficultyEnum } from "../../../shared/enums/difficulty.enum";

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
  limit: number = 10
): Promise<GameResultEntity[]> => {
  console.log(`Fetching top ${limit} scores from the database`);

  return await GameResultRepository.find({
    order: {
      score: "DESC",
    },
    take: limit,
  });
};
