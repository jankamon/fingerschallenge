"use client";

import { GameContext } from "@/contexts/GameContext";
import { useEffect, useContext, useState, useCallback } from "react";
import Image from "next/image";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import MovesVisualisation from "./MovesVisualisation";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import {
  Chest,
  LockpickLeft,
  LockpickRight,
  Lockpicks,
  Star,
} from "@/ui/Icons";
import { useTranslations } from "@/contexts/TranslationContext";
import MenuBox from "@/components/MenuBox";

export default function ChestOpeningLogic() {
  const t = useTranslations();

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

  const [isMoving, setIsMoving] = useState(false);

  const handleMoveWithAnimation = useCallback(
    (direction: LockpickMoveEnum) => {
      handleMove(direction);

      // Display animation
      setIsMoving(true);

      setTimeout(() => {
        setIsMoving(false);
      }, 300); // 300ms animation duration
    },
    [handleMove]
  );
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
        handleMoveWithAnimation(LockpickMoveEnum.LEFT);
      }
      // Right controls: Arrow Right, 'D' key, or Numpad 6
      else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d" ||
        event.key === "6" ||
        event.key === "Numpad6"
      ) {
        handleMoveWithAnimation(LockpickMoveEnum.RIGHT);
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
  }, [handleMoveWithAnimation, handleNextChest, isChestOpen]);

  return (
    <div className="relative flex flex-col items-center justify-between pt-[4rem] pr-[1rem] pb-[5rem] pl-[1rem] h-screen">
      <button className="absolute top-1 right-1 h-2 pt-[0.375rem] pr-0 pb-[0.25rem] pl-0">
        <span className="close-text">{t?.game?.finish}</span>
      </button>
      <div className="flex flex-col flex-1 items-center justify-between self-stretch text-brand max-h-[61.25rem]">
        <div className="flex flex-col items-center gap-3 self-stretch">
          <div className="flex items-center justify-between self-stretch">
            <div className="flex items-center gap-2">
              <Chest /> {openedChests}
            </div>
            <div className="text-body capitalize text-center">
              {t?.difficultyLevels?.[difficulty || "adept"]}
            </div>

            <p>
              {score} {t?.ranking?.pointsShortcut}
            </p>
          </div>
          <MenuBox
            className="h-[14rem] md:h-[28rem] self-stretch relative"
            noPadding={true}
          >
            <div className="w-full h-full self-stretch">
              {/* Temporary currentChestLevel is always 1 */}
              <Image
                src={`/assets/chests/${currentChestLevel > 1 ? 1 : 1}/${
                  isChestOpen ? "open" : isMoving ? "move" : "idle"
                }.png`}
                alt="Chest"
                width={300}
                height={300}
                className="object-cover z-9"
                style={{
                  height: "100%",
                  width: "100%",
                }}
                priority={true}
                unoptimized={true}
              />
            </div>
            <div className="level-bar">
              {[...Array(currentChestLevel)].map((_, index) => (
                <Star key={index} />
              ))}
            </div>
          </MenuBox>
          {difficulty === DifficultyEnum.ADEPT && <MovesVisualisation />}
        </div>
        <div className="flex items-center justify-center w-full h-[12rem] overflow-hidden text-brand-xs text-center">
          {message?.text}
        </div>
        {isChestOpen && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={handleNextChest}
          >
            {t?.game?.nextChest}
          </button>
        )}
        {!lockpicks && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={handleTryAgain}
          >
            {t?.game?.tryAgain}
          </button>
        )}
        <div className="flex flex-col items-center gap-3 self-stretch">
          <div className="lockpicks-count">
            <Lockpicks /> {lockpicks}
          </div>
          <div className="flex items-center justify-between md:justify-center gap-0 md:gap-8 self-stretch">
            <button
              onClick={() => handleMoveWithAnimation(LockpickMoveEnum.LEFT)}
              className="huge-icon-button"
              disabled={!lockpicks || isChestOpen}
            >
              <div className="huge-icon-button-inside">
                <LockpickLeft />
              </div>
            </button>
            <button
              onClick={() => handleMoveWithAnimation(LockpickMoveEnum.RIGHT)}
              className="huge-icon-button"
              disabled={!lockpicks || isChestOpen}
            >
              <div className="huge-icon-button-inside">
                <LockpickRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
