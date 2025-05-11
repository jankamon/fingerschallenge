import { GameContext } from "@/contexts/GameContext";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { useContext } from "react";

export default function ChooseDifficulty() {
  const { selectDifficulty } = useContext(GameContext);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <h1 className="text-2xl font-bold">Difficulty Level</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => selectDifficulty(DifficultyEnum.ADEPT)}
        >
          Adept
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => selectDifficulty(DifficultyEnum.MASTER)}
        >
          Master
        </button>
      </div>
    </div>
  );
}
