"use client";

import ChestOpeningGame from "@/components/ChestOpeningGame";
import DifficultyLevel from "@/components/ChooseDifficulty";
import { useContext } from "react";
import { GameContext } from "@/contexts/GameContext";
import SaveResultDialog from "@/dialogs/SaveResultDialog";

export default function Home() {
  const { difficulty, isSaveResultDialogOpen } = useContext(GameContext);

  return (
    <section className="flex flex-col items-center w-full h-full">
      {difficulty ? <ChestOpeningGame /> : <DifficultyLevel />}
      {isSaveResultDialogOpen && <SaveResultDialog />}
    </section>
  );
}
