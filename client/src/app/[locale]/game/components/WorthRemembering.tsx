import { GameContext } from "@/contexts/GameContext";
import { Filter } from "bad-words";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";

const filter = new Filter();

export default function WorthRemembering() {
  const tGameOver = useTranslations("gameOver");
  const tDiffLevels = useTranslations("difficultyLevels");
  const tRanking = useTranslations("ranking");
  const tNameless = useTranslations();

  const { difficulty, score, openedChests, handleSaveResult } =
    useContext(GameContext);

  const [username, setUsername] = useState("");

  const checkUsername = (username: string) => {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length > 64) {
      return;
    }

    // Use nameless translation if username is empty
    const finalUsername =
      trimmedUsername.length === 0
        ? tNameless("nameless") || "Nameless"
        : filter.clean(trimmedUsername);

    handleSaveResult(finalUsername);
  };

  return (
    <section className="flex flex-col items-center justify-center w-full h-full py-[2.5rem] px-4">
      <div className="flex flex-col items-center justify-between w-full max-w-[35rem] h-full max-h-[35rem]">
        <h1 className="text-brand">{tGameOver("title")}</h1>
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <p>{tGameOver("yourNameIsWorthToRemember")}</p>
          <div className="text-input">
            <input
              type="text"
              placeholder={tGameOver("placeholder")}
              className="text-input-inside"
              maxLength={64}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <p>{tGameOver("score")}</p>
          <div className="score-box text-brand">
            {score} {tRanking("pointsShortcut")}
          </div>
        </div>
        <div className="flex flex-col items-start w-full gap-3">
          <div className="flex justify-between w-full">
            <p>{tGameOver("difficulty")}</p>
            <p className="text-brand">{tDiffLevels(difficulty || "adept")}</p>
          </div>
          <div className="flex justify-between w-full">
            <p>{tGameOver("openedChests")}</p>
            <p className="text-brand">{openedChests}</p>
          </div>
        </div>
        <button className="menu-button" onClick={() => checkUsername(username)}>
          {tGameOver("saveAndQuit")}
        </button>
      </div>
    </section>
  );
}
