"use client";

import { GameContext } from "@/contexts/GameContext";
import { useEffect, useContext } from "react";
import Image from "next/image";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import MovesVisualisation from "./MovesVisualisation";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";

export default function ChestOpeningLogic() {
  const {
    handleMove,
    handleNextChest,
    handleTryAgain,
    difficulty,
    lockpicks,
    message,
    currentChestLevel,
    isChestOpen,
    score,
    openedChests,
  } = useContext(GameContext);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Left controls: Arrow Left, 'A' key, or Numpad 4
      if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a" ||
        event.key === "4" ||
        event.key === "Numpad4"
      ) {
        handleMove(LockpickMoveEnum.LEFT);
      }
      // Right controls: Arrow Right, 'D' key, or Numpad 6
      else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d" ||
        event.key === "6" ||
        event.key === "Numpad6"
      ) {
        handleMove(LockpickMoveEnum.RIGHT);
      }
      // Enter key for next chest
      else if (event.key === "Enter" && isChestOpen) {
        handleNextChest();
      }
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMove, handleNextChest, isChestOpen]);

  return (
    <div className="relative flex flex-col items-center gap-4 p-4">
      <p>Score: {score}</p>
      <p className="text-xs">
        Difficulty: {difficulty}
        <br />
        Chests opened: {openedChests}
        <br />
        Lockpicks: {lockpicks}
      </p>
      <div className="flex items-center justify-center h-52">
        <Image
          src={`/images/chest-level-${currentChestLevel}.png`}
          alt="Chest"
          width={300}
          height={300}
          className="object-cover"
          priority={true}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      </div>
      <p className="text-lg">{message}</p>
      {difficulty === DifficultyEnum.ADEPT && <MovesVisualisation />}
      <p className="text-sm text-gray-400">Chest level: {currentChestLevel}</p>
      {isChestOpen && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleNextChest}
        >
          Next chest!
        </button>
      )}
      {!lockpicks && (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleTryAgain}
        >
          Try again!
        </button>
      )}
      <div className="flex gap-4">
        <button
          onClick={() => handleMove(LockpickMoveEnum.LEFT)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          ← Left
        </button>
        <button
          onClick={() => handleMove(LockpickMoveEnum.RIGHT)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Right →
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2 text-center">
        Use arrow keys, A/D keys, or numpad 4/6 to control
      </p>
    </div>
  );
}
