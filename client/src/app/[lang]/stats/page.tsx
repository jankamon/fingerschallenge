"use client";

import { GameContext } from "@/contexts/GameContext";
import { useContext, useEffect } from "react";

export default function GameStatsPage() {
  const { gameStats, handleGetGameStats } = useContext(GameContext);

  useEffect(() => {
    handleGetGameStats();
  }, [handleGetGameStats]);

  const statsItems = [
    { label: "Visits", value: gameStats?.playersConnected || 0 },
    { label: "Games played", value: gameStats?.gamesPlayed || 0 },
    { label: "Total moves", value: gameStats?.totalLockpickMoves || 0 },
    { label: "Broken lockpicks", value: gameStats?.brokenLockpicks || 0 },
    { label: "Chests opened", value: gameStats?.chestsOpened || 0 },
    {
      label: "Chests generated",
      value: gameStats?.chestPatternsGenerated || 0,
    },
    {
      label: "Highest opened chest level",
      value: gameStats?.highestOpenedChestLevel || 0,
    },
    { label: "Highest score", value: gameStats?.highestScore || 0 },
  ];

  return (
    <section className="flex flex-col items-center w-full h-full p-4 gap-8">
      <h1 className="text-4xl font-bold mb-4">Game Stats</h1>
      <div className="w-full md:w-1/2">
        <h2 className="text-center">Today</h2>
        <ul className="space-y-2 mt-4">
          {statsItems.map((item, index) => (
            <li key={index} className="flex justify-between border-b">
              <span>{item.label}:</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
