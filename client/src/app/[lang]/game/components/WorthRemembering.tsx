import { GameContext } from "@/contexts/GameContext";
import { useTranslations } from "@/contexts/TranslationContext";
import { useContext, useState } from "react";

export default function WorthRemembering() {
  const t = useTranslations();

  const { difficulty, score, openedChests, handleSaveResult } =
    useContext(GameContext);

  const [username, setUsername] = useState("");

  return (
    <section className="flex flex-col items-center justify-center w-full h-full py-[2.5rem] px-4">
      <div className="flex flex-col items-center justify-between w-full max-w-[35rem] h-full max-h-[35rem]">
        <h1 className="text-brand">{t?.gameOver?.title}</h1>
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <p>{t?.gameOver?.yourNameIsWorthToRemember}</p>
          <div className="text-input">
            <input
              type="text"
              placeholder={t?.gameOver?.placeholder}
              className="text-input-inside"
              maxLength={64}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <p>{t?.gameOver?.score}</p>
          <div className="score-box text-brand">
            {score} {t?.ranking?.pointsShortcut}
          </div>
        </div>
        <div className="flex flex-col items-start w-full gap-3">
          <div className="flex justify-between w-full">
            <p>{t?.gameOver?.difficulty}</p>
            <p className="text-brand">
              {t?.difficultyLevels?.[difficulty || "adept"]}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p>{t?.gameOver?.openedChests}</p>
            <p className="text-brand">{openedChests}</p>
          </div>
        </div>
        <button
          className="menu-button"
          onClick={() => handleSaveResult(username)}
        >
          {t?.gameOver?.saveAndQuit}
        </button>
      </div>
    </section>
  );
}
