import { GameContext } from "@/contexts/GameContext";
import { useTranslations } from "next-intl";
import { useContext } from "react";

export default function NotWorthRemembering() {
  const tGameOver = useTranslations("gameOver");
  const tRanking = useTranslations("ranking");

  const { difficulty, score, openedChests, handleResetGame } =
    useContext(GameContext);

  return (
    <section className="flex flex-col items-center justify-center w-full h-full py-[2.5rem] px-4">
      <div className="flex flex-col items-center justify-between w-full max-w-[35rem] h-full max-h-[35rem]">
        <h1 className="text-brand">{tGameOver("title")}</h1>
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <p>{tGameOver("score")}</p>
          <div className="score-box text-brand">
            {score} {tRanking("pointsShortcut")}
          </div>
        </div>
        <div className="flex flex-col items-start w-full gap-3">
          <div className="flex justify-between w-full">
            <p>{tGameOver("difficulty")}</p>
            <p className="text-brand">{tGameOver(difficulty || "adept")}</p>
          </div>
          <div className="flex justify-between w-full">
            <p>{tGameOver("openedChests")}</p>
            <p className="text-brand">{openedChests}</p>
          </div>
        </div>
        <button className="menu-button" onClick={handleResetGame}>
          {tGameOver("quit")}
        </button>
      </div>
    </section>
  );
}
