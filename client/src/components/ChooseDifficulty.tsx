import { GameContext } from "@/contexts/GameContext";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { useContext } from "react";
import Image from "next/image";

export default function ChooseDifficulty() {
  const { handleSelectDifficulty } = useContext(GameContext);

  return (
    <div className="relative w-full h-full overflow-hidden md:overflow-visible">
      <div className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-4xl font-bold mb-4">Fingers Challenge</h1>
        <p className="text-lg mb-4 w-3/4 md:w-1/2 text-center">
          Think you&apos;re slicker than Fingers? Choose your difficulty level
          and prove it!
        </p>
        <h3 className="text-2xl font-bold">Difficulty Level</h3>
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
      <Image
        src="/images/fingers.png"
        alt="Fingers"
        width={300}
        height={654}
        className="absolute top-0 -right-22 md:-right-20 -z-10 opacity-70"
        priority={true}
      />
    </div>
  );
}
