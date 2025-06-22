"use client";

import ChestOpeningGame from "@/app/[lang]/game/components/ChestOpeningGame";
import DifficultyLevel from "@/app/[lang]/game/components/ChooseDifficulty";
import { useContext, useState } from "react";
import { GameContext } from "@/contexts/GameContext";
import QuitGame from "./components/QuitGame";
import WorthRemembering from "./components/WorthRemembering";
import NotWorthRemembering from "./components/NotWorthRemembering";

export default function Game() {
  const { difficulty, lockpicks, openedChests } = useContext(GameContext);

  const [wantQuit, setWantQuit] = useState(false);

  const gameOver = lockpicks === 0 && difficulty;

  const quitGame = () => {
    setWantQuit(true);
  };

  const returnToGame = () => {
    setWantQuit(false);
  };

  if (wantQuit) {
    return <QuitGame returnToGame={returnToGame} />;
  }

  if (gameOver) {
    // We allow player save results only if they opened more than 3 chests
    return openedChests > 3 ? <WorthRemembering /> : <NotWorthRemembering />;
  }

  // If difficulty is set, we start the game
  if (difficulty) {
    return <ChestOpeningGame quitGame={quitGame} />;
  }

  return <DifficultyLevel />;
}
