import { Link } from "@/i18n/navigation";
import { useContext } from "react";
import { GameContext } from "@/contexts/GameContext";
import { useTranslations } from "next-intl";

export default function QuitGame({
  returnToGame,
}: {
  returnToGame: () => void;
}) {
  const { handleResetGame, score } = useContext(GameContext);
  const tQuitGame = useTranslations("quitGame");
  const tRanking = useTranslations("ranking");

  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-between w-[14rem] h-full max-h-[31rem]">
        <h1 className="text-brand text-center">{tQuitGame("wantToQuit")}</h1>
        <div className="flex flex-col items-center justify-between gap-[3rem]">
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-center">{tQuitGame("yourCurrentScore")}</p>
            <div className="flex w-fit quit-game-score text-brand">
              {score} {tRanking("pointsShortcut")}
            </div>
          </div>
          <button className="global-text-button" onClick={returnToGame}>
            <span className="global-text-button-span">
              {tQuitGame("returnToGame")}
            </span>
          </button>
        </div>
        <Link
          href="/"
          onClick={handleResetGame}
          className="text-brand text-center"
        >
          {tQuitGame("quitToMenu")}
        </Link>
      </div>
    </section>
  );
}
