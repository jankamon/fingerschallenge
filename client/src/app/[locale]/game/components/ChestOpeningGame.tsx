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
import MenuBox from "@/components/MenuBox";
import { useTranslations } from "next-intl";

export default function ChestOpeningLogic({
  quitGame,
}: {
  quitGame: () => void;
}) {
  const tGame = useTranslations("game");
  const tDiffLevels = useTranslations("difficultyLevels");
  const tMessages = useTranslations("messages");
  const tRanking = useTranslations("ranking");

  const {
    handleMove,
    difficulty,
    lockpicks,
    animatedMessages,
    currentChestLevel,
    isChestOpen,
    score,
    openedChests,
  } = useContext(GameContext);

  const [isMoving, setIsMoving] = useState(false);
  const [activeButton, setActiveButton] = useState<LockpickMoveEnum | null>(
    null
  );

  const isAdeptDifficulty = difficulty === DifficultyEnum.ADEPT;

  const handleMoveWithAnimation = useCallback(
    (direction: LockpickMoveEnum) => {
      handleMove(direction);

      // Display animation
      setIsMoving(true);
      setActiveButton(direction);

      setTimeout(() => {
        setIsMoving(false);
      }, 300); // 300ms animation duration

      setTimeout(() => {
        setActiveButton(null);
      }, 200); // 200ms animation duration
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
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMoveWithAnimation, isChestOpen]);

  return (
    <div className="relative flex flex-col items-center justify-between pt-[4rem] pr-[1rem] pb-[5rem] pl-[1rem] h-screen">
      <button
        className="absolute top-1 right-1 h-2 pt-[0.375rem] pr-0 pb-[0.25rem] pl-0 cursor-pointer"
        onClick={quitGame}
      >
        <span className="close-text">{tGame("finish")}</span>
      </button>
      <div className="flex flex-col flex-1 items-center justify-between self-stretch text-brand max-h-[61.25rem]">
        <div className="flex flex-col items-center gap-3 self-stretch">
          <div className="flex items-center justify-between self-stretch">
            <div className="flex items-center gap-2">
              <Chest /> {openedChests}
            </div>
            <div className="text-body capitalize text-center">
              {tDiffLevels(difficulty || "adept")}
            </div>

            <p>
              {score} {tRanking("pointsShortcut")}
            </p>
          </div>
          <MenuBox
            className="h-[14rem] md:h-[28rem] w-full md:w-full self-stretch relative"
            noPadding={true}
          >
            <div className="w-full h-full self-stretch">
              <Image
                src={`/assets/chests/${currentChestLevel}/${
                  isChestOpen ? "open" : isMoving ? "move" : "idle"
                }.jpg`}
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
          {isAdeptDifficulty && <MovesVisualisation />}
        </div>
        <div
          className={`relative flex flex-col items-center justify-center w-full overflow-hidden text-brand-xs text-center ${
            isAdeptDifficulty ? "h-[9rem]" : "h-[12rem]"
          }`}
        >
          {animatedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flying-message-animation ${
                msg.text === "openedChest"
                  ? "text-custom-extra-light-green"
                  : msg.text === "brokenLockpick"
                  ? "text-custom-extra-light-red"
                  : ""
              }`}
            >
              {tMessages(msg.text)}
            </div>
          ))}
        </div>
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
              <div
                className={`huge-icon-button-inside ${
                  activeButton === LockpickMoveEnum.LEFT ? "active" : ""
                }`}
              >
                <LockpickLeft />
              </div>
            </button>
            <button
              onClick={() => handleMoveWithAnimation(LockpickMoveEnum.RIGHT)}
              className={`huge-icon-button ${
                activeButton === LockpickMoveEnum.RIGHT ? "active" : ""
              }`}
              disabled={!lockpicks || isChestOpen}
            >
              <div
                className={`huge-icon-button-inside ${
                  activeButton === LockpickMoveEnum.RIGHT ? "active" : ""
                }`}
              >
                <LockpickRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
