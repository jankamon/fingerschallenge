import { GameContext } from "@/contexts/GameContext";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import { useContext } from "react";

export default function MovesVisualisation() {
  const { userMovesVisualisation, currentChestLevel } = useContext(GameContext);

  let gridCols = "grid-cols-4";
  let gridRows = "grid-rows-1";

  switch (currentChestLevel) {
    case 1:
      gridCols = "grid-cols-2"; // 2 moves
      break;
    case 2:
      gridCols = "grid-cols-3"; // 3 moves
      break;
    case 3:
      gridCols = "grid-cols-5"; // 5 moves
      break;
    case 4:
      gridCols = "grid-cols-4"; // 8 moves
      gridRows = "grid-rows-2"; // 8 moves
      break;
    default:
      gridCols = "grid-cols-4"; // 4 moves
      gridRows = "grid-rows-1"; // 4 moves
  }

  if (userMovesVisualisation.length === 0) {
    return null;
  }

  return (
    <div
      className={`absolute top-35 grid ${gridCols} ${gridRows} gap-2 text-4xl bg-gray-950/30 border-1 border-gray-500 rounded-md p-2 z-10`}
    >
      {userMovesVisualisation.map((move, index) => (
        <span
          key={index}
          className={move?.success ? "text-green-500" : "text-red-500"}
        >
          {move?.direction === LockpickMoveEnum.LEFT ? "←" : "→"}
        </span>
      ))}
    </div>
  );
}
