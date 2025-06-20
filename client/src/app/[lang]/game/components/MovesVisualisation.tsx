import { GameContext } from "@/contexts/GameContext";
import { RotateLeft, RotateRight } from "@/ui/Icons";
import { LockpickMoveEnum } from "@shared/enums/lockpickMove.enum";
import { useContext } from "react";

export default function MovesVisualisation() {
  const { userMovesVisualisation } = useContext(GameContext);

  if (userMovesVisualisation.length === 0) {
    return null;
  }

  return (
    <div className="moves-history-box">
      {userMovesVisualisation.map((move, index) => (
        <div
          key={index}
          className={`history-move ${move?.success ? "success" : "error"}`}
        >
          {move?.direction === LockpickMoveEnum.LEFT ? (
            <div
              className={`history-move-icon ${
                move?.success ? "success" : "error"
              }`}
            >
              <RotateLeft />
            </div>
          ) : (
            <div
              className={`history-move-icon ${
                move?.success ? "success" : "error"
              }`}
            >
              <RotateRight />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
