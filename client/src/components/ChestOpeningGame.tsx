"use client";

import { GameContext } from "@/contexts/GameContext";
import { useEffect, useContext } from "react";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";

export default function ChestOpeningLogic() {
  const {
    handleMove,
    nextChest,
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
        nextChest();
      }
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMove, nextChest, isChestOpen]);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <p>Score: {score}</p>
      <p className="text-xs">
        Difficulty: {difficulty}
        <br />
        Chests opened: {openedChests}
        <br />
        Lockpicks: {lockpicks}
      </p>
      <p className="text-lg">{message}</p>
      <p className="text-sm text-gray-400">Chest level: {currentChestLevel}</p>
      {isChestOpen && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={nextChest}
        >
          Next chest!
        </button>
      )}
      <div className="flex gap-4">
        <button
          onClick={() => handleMove(LockpickMoveEnum.LEFT)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          ← Left
        </button>
        <button
          onClick={() => handleMove(LockpickMoveEnum.RIGHT)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Right →
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        Use arrow keys, A/D keys, or numpad 4/6 to control
      </p>
    </div>
  );
}
