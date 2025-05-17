import { GameContext } from "@/contexts/GameContext";
import { useContext, useState } from "react";

export default function SaveResultDialog() {
  const {
    score,
    openedChests,
    difficulty,
    highestOpenedChestLevel,
    closeSaveResultDialog,
    handleSaveResult,
  } = useContext(GameContext);
  const [userName, setUserName] = useState("");

  return (
    <div className="absolute flex flex-col items-center gap-4 border bg-gray-950 border-gray-300 rounded-md p-4 shadow-md z-10 ">
      <button
        className="absolute right-1 top-0 cursor-pointer text-gray-500 hover:text-gray-300"
        onClick={closeSaveResultDialog}
      >
        X
      </button>
      <div className="flex flex-col items-center">
        <h2>That was good try!</h2>
        <p>Your name is worth to remember.</p>
      </div>
      <div className="flex flex-col items-center">
        <p>Score: {score}</p>
        <p>Difficulty: {difficulty}</p>
        <p>Opened Chests: {openedChests}</p>
        <p>Highest Opened Chest Level: {highestOpenedChestLevel}</p>
      </div>
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        max={64}
      />
      <button
        className="border border-gray-300 hover:bg-gray-900 rounded-md cursor-pointer h-8 w-32"
        onClick={() => handleSaveResult(userName)}
      >
        Save
      </button>
    </div>
  );
}
