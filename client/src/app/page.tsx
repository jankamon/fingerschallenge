"use client";

import ChestOpeningGame from "@/components/ChestOpeningGame";
import DifficultyLevel from "@/components/ChooseDifficulty";
import { useContext } from "react";
import { GameContext } from "@/contexts/GameContext";

export default function Home() {
  const { difficulty } = useContext(GameContext);

  return (
    <main className="flex flex-col items-center gap-4 mt-8">
      {difficulty ? <ChestOpeningGame /> : <DifficultyLevel />}
    </main>
  );
}
