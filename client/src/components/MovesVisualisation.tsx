import { GameContext } from "@/contexts/GameContext";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import { useContext } from "react";

export default function MovesVisualisation() {
  const { userMovesVisualisation } = useContext(GameContext);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-4xl w-3/4 md:w-1/2">
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
