"use client";

import { GameContext } from "@/contexts/GameContext";
import { useContext, useEffect, useState } from "react";

export default function RankingPage() {
  const { leaderboard, handleGetLeaderboard } = useContext(GameContext);

  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
    handleGetLeaderboard(limit);
  }, [handleGetLeaderboard, limit]);

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Ranking</h1>
      <select
        className="mb-4 p-2 border border-gray-300 rounded bg-gray-900"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      >
        <option value={10}>Top 10</option>
        <option value={50}>Top 50</option>
        <option value={100}>Top 100</option>
        <option value={1000}>Top 1000</option>
      </select>
      <p className="text-lg">Top {limit} players</p>
      <div className="mt-4">
        <ul className="list-inside">
          {leaderboard.map((player, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold">{index + 1}. </span>
              <span>{player.username}</span>
              <span className="ml-2">Score: {player.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
