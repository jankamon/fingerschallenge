"use client";

import ChestOpeningGame from "@/app/[lang]/game/components/ChestOpeningGame";
import DifficultyLevel from "@/app/[lang]/game/components/ChooseDifficulty";
import { useContext, useState } from "react";
import { GameContext } from "@/contexts/GameContext";
import QuitGame from "./components/QuitGame";

export default function Game() {
  const { difficulty } = useContext(GameContext);

  const [wantQuit, setWantQuit] = useState(false);

  const quitGame = () => {
    setWantQuit(true);
  };

  const returnToGame = () => {
    setWantQuit(false);
  };

  if (wantQuit) {
    return <QuitGame returnToGame={returnToGame} />;
  }

  return difficulty ? (
    <ChestOpeningGame quitGame={quitGame} />
  ) : (
    <DifficultyLevel />
  );
}
