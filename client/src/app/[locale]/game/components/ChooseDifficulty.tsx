import { GameContext } from "@/contexts/GameContext";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { useContext } from "react";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";
import MenuBox from "@/components/MenuBox";
import Separator from "@/ui/Separator";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ChooseDifficulty() {
  const tDiffLevelPage = useTranslations("difficultyLevelPage");
  const tDiffLevels = useTranslations("difficultyLevels");
  const tMenu = useTranslations("menu");

  const { handleSelectDifficulty } = useContext(GameContext);

  return (
    <LogoHeader>
      <MenuBox>
        <div className="flex flex-col items-center gap-3">
          <span className="text-body text-custom-neutral-200">
            {tDiffLevelPage("title")}
          </span>
          <button
            className="flex flex-col items-center"
            onClick={() => handleSelectDifficulty(DifficultyEnum.ADEPT)}
          >
            <div className="menu-button">{tDiffLevels("adept")}</div>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-1rem]">
              {tDiffLevelPage("adeptDesc")}
            </span>
          </button>
          <button
            className="flex flex-col items-center"
            onClick={() => handleSelectDifficulty(DifficultyEnum.JOURNEYMAN)}
          >
            <div className="menu-button">{tDiffLevels("journeyman")}</div>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-1rem]">
              {tDiffLevelPage("journeymanDesc")}
            </span>
          </button>
          <button
            className="flex flex-col items-center"
            onClick={() => handleSelectDifficulty(DifficultyEnum.MASTER)}
          >
            <div className="menu-button">{tDiffLevels("master")}</div>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-1rem]">
              {tDiffLevelPage("masterDesc")}
            </span>
          </button>
        </div>
        <Separator />
        <Link href={`/`} className="menu-button">
          {tMenu("return")}
        </Link>
      </MenuBox>
      <Footer />
    </LogoHeader>
  );
}
