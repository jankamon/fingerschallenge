"use client";

import { GameContext } from "@/contexts/GameContext";
import { useContext, useEffect } from "react";

export default function RankingPage() {
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
    <section className="flex flex-col items-center w-full h-full p-4">
      <h1 className="text-4xl font-bold mb-4">Ranking</h1>
      <div className="mt-4 w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-start w-8">#</th>
              <th className="text-start">Name</th>
              <th className="text-start">Difficulty</th>
              <th className="text-start">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index} className="border-b">
                <td>{startingRank + index}</td>
                <td>{player.username}</td>
                <td>{player.difficulty}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between gap-4">
        <button
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            leaderboardPage <= 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={handlePrevPage}
          disabled={leaderboardPage <= 1}
        >
          Prev page
        </button>
        <span className="py-2">
          Page {leaderboardPage} of {totalPages || 1}
        </span>
        <button
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            leaderboardPage >= totalPages
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={handleNextPage}
          disabled={leaderboardPage >= totalPages}
        >
          Next page
        </button>
      </div>
    </section>
  );
}
