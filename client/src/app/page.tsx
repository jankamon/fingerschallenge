"use client";

import ChestOpeningGame from "@/components/ChestOpeningGame";
import DifficultyLevel from "@/components/ChooseDifficulty";
import { useContext } from "react";
import { GameContext } from "@/contexts/GameContext";
import SaveResultDialog from "@/dialogs/SaveResultDialog";

export default function Home() {
  const { difficulty, isSaveResultDialogOpen } = useContext(GameContext);

  return (
    <main className="flex flex-col items-center gap-4">
      {difficulty ? <ChestOpeningGame /> : <DifficultyLevel />}
      {isSaveResultDialogOpen && <SaveResultDialog />}
    </main>
  );
}
