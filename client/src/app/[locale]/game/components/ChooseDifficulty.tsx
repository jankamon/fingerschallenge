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
          <div className="flex flex-col items-center">
            <button
              className="menu-button"
              onClick={() => handleSelectDifficulty(DifficultyEnum.ADEPT)}
            >
              {tDiffLevels("adept")}
            </button>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-0.75rem]">
              {tDiffLevelPage("adeptDesc")}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="menu-button"
              onClick={() => handleSelectDifficulty(DifficultyEnum.JOURNEYMAN)}
            >
              {tDiffLevels("journeyman")}
            </button>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-0.75rem]">
              {tDiffLevelPage("journeymanDesc")}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="menu-button"
              onClick={() => handleSelectDifficulty(DifficultyEnum.MASTER)}
            >
              {tDiffLevels("master")}
            </button>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-0.75rem]">
              {tDiffLevelPage("masterDesc")}
            </span>
          </div>
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
