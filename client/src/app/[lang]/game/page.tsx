"use client";

import ChestOpeningGame from "@/app/[lang]/game/components/ChestOpeningGame";
import DifficultyLevel from "@/app/[lang]/game/components/ChooseDifficulty";
import { useContext } from "react";
import { GameContext } from "@/contexts/GameContext";

export default function Game() {
  const { difficulty } = useContext(GameContext);

  return difficulty ? <ChestOpeningGame /> : <DifficultyLevel />;
}
