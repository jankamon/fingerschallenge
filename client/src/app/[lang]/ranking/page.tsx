"use client";

import MenuBox from "@/components/MenuBox";
import { GameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";
import { ArrowLeft, ArrowRight } from "@/ui/Icons";
import Link from "next/link";
import { useContext, useEffect } from "react";

export default function RankingPage() {
  const t = useTranslations();

  const {
    leaderboard,
    handleGetLeaderboard,
    leaderboardPage,
    leaderboardPageSize,
    leaderboardTotal,
    handleNextPage,
    handlePrevPage,
  } = useContext(GameContext);

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
    handleGetLeaderboard(1, 10);
  }, [handleGetLeaderboard]);

  const totalPages = Math.ceil(leaderboardTotal / leaderboardPageSize);
  const startingRank = (leaderboardPage - 1) * leaderboardPageSize + 1;

  return (
    <section className="flex flex-col items-center justify-around w-full h-full p-4 text-body w-max-[35rem]">
      <h1 className="text-brand">{t?.ranking?.title}</h1>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-center self-stretch gap-3">
          <button className="flex-1 global-text-button">
            <span className="global-text-button-span">
              {t?.difficultyLevels?.adept}
            </span>
          </button>
          <button className="flex-1 global-text-button">
            <span className="global-text-button-span">
              {t?.difficultyLevels?.journeyman}
            </span>
          </button>
          <button className="flex-1 global-text-button">
            <span className="global-text-button-span">
              {t?.difficultyLevels?.master}
            </span>
          </button>
        </div>
        <MenuBox className="mt-4 w-full">
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
                {player?.score} {t?.ranking?.pointsShortcut}
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
        {t.menu.return}
      </Link>
    </section>
  );
}
