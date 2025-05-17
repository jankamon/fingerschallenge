import { GameContext } from "@/contexts/GameContext";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { useContext } from "react";

export default function ChooseDifficulty() {
  const { handleSelectDifficulty } = useContext(GameContext);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Difficulty Level</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleSelectDifficulty(DifficultyEnum.ADEPT)}
        >
          Adept
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => handleSelectDifficulty(DifficultyEnum.MASTER)}
        >
          Master
        </button>
      </div>
    </div>
  );
}
