import Link from "next/link";
import { useContext } from "react";
import { GameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";

export default function QuitGame({
  returnToGame,
}: {
  returnToGame: () => void;
}) {
  const { handleResetGame, score } = useContext(GameContext);
  const t = useTranslations();

  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-between w-[14rem] h-full max-h-[31rem]">
        <h1 className="text-brand text-center">{t?.quitGame?.wantToQuit}</h1>
        <div className="flex flex-col items-center justify-between gap-[3rem]">
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-center">{t?.quitGame?.yourCurrentScore}</p>
            <div className="flex w-fit quit-game-score text-brand">
              {score} {t?.ranking?.pointsShortcut}
            </div>
          </div>
          <button className="global-text-button" onClick={returnToGame}>
            <span className="global-text-button-span">
              {t?.quitGame?.returnToGame}
            </span>
          </button>
        </div>
        <Link
          href="/"
          onClick={handleResetGame}
          className="text-brand text-center"
        >
          {t?.quitGame?.quitToMenu}
        </Link>
      </div>
    </section>
  );
}
