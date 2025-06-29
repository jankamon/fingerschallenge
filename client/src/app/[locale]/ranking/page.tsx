"use client";

import MenuBox from "@/components/MenuBox";
import { GameContext } from "@/contexts/GameContext";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { ArrowLeft, ArrowRight } from "@/ui/Icons";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function RankingPage() {
  const tRanking = useTranslations("ranking");
  const tDiffLevels = useTranslations("difficultyLevels");
  const tMenu = useTranslations("menu");

  const {
    leaderboard,
    handleGetLeaderboard,
    leaderboardPage,
    leaderboardPageSize,
    leaderboardTotal,
    handleNextPage,
    handlePrevPage,
    handleChangeRankingDifficulty,
    rankingDifficulty,
  } = useContext(GameContext);

  // Need this for redirecting after game over
  const defaultDifficulty = rankingDifficulty || DifficultyEnum.JOURNEYMAN;

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
    handleGetLeaderboard(defaultDifficulty, 1, 10);
  }, [handleGetLeaderboard, defaultDifficulty]);

  const totalPages = Math.ceil(leaderboardTotal / leaderboardPageSize);
  const startingRank = (leaderboardPage - 1) * leaderboardPageSize + 1;

  return (
    <section className="flex flex-col items-center justify-around w-full h-full p-4 text-body w-max-[35rem]">
      <h1 className="text-brand">{tRanking("title")}</h1>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-center self-stretch gap-3">
          <button
            className={`flex-1 global-text-button ${
              rankingDifficulty === DifficultyEnum.ADEPT ? "active" : ""
            }`}
            onClick={() => handleChangeRankingDifficulty(DifficultyEnum.ADEPT)}
          >
            <span className="global-text-button-span">
              {tDiffLevels("adept")}
            </span>
          </button>
          <button
            className={`flex-1 global-text-button ${
              rankingDifficulty === DifficultyEnum.JOURNEYMAN ? "active" : ""
            }`}
            onClick={() =>
              handleChangeRankingDifficulty(DifficultyEnum.JOURNEYMAN)
            }
          >
            <span className="global-text-button-span">
              {tDiffLevels("journeyman")}
            </span>
          </button>
          <button
            className={`flex-1 global-text-button ${
              rankingDifficulty === DifficultyEnum.MASTER ? "active" : ""
            }`}
            onClick={() => handleChangeRankingDifficulty(DifficultyEnum.MASTER)}
          >
            <span className="global-text-button-span">
              {tDiffLevels("master")}
            </span>
          </button>
        </div>
        <MenuBox className="mt-4 w-full justify-start min-h-[24.65rem] ">
          {leaderboard.map((player, index) => (
            <div
              key={index}
              className="flex h-6 items-center justify-center gap-4 self-stretch leaderboard-table"
            >
              <span className="w-10 text-brand text-end">
                #{startingRank + index}
              </span>
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start">
                {player.username}
              </span>
              <span className="text-body-bold text-end">
                {player?.score} {tRanking("pointsShortcut")}
              </span>
            </div>
          ))}
        </MenuBox>
        <div className="mt-4 flex justify-between w-full gap-4">
          <button
            className="global-text-button w-20"
            onClick={handlePrevPage}
            disabled={leaderboardPage <= 1}
          >
            <span className="global-text-button-span">
              <ArrowLeft />
            </span>
          </button>
          <span className="py-2">
            {leaderboardPage} / {totalPages || 1}
          </span>
          <button
            className="global-text-button w-20"
            onClick={handleNextPage}
            disabled={leaderboardPage >= totalPages}
          >
            <span className="global-text-button-span">
              <ArrowRight />
            </span>
          </button>
        </div>
      </div>
      <Link href={`/`} className="menu-button">
        {tMenu("return")}
      </Link>
    </section>
  );
}
