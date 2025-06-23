import { GameContext } from "@/contexts/GameContext";
import { DifficultyEnum } from "@shared/enums/difficulty.enum";
import { useContext } from "react";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";
import MenuBox from "@/components/MenuBox";
import Separator from "@/ui/Separator";
import Link from "next/link";
import { useTranslations } from "@/contexts/TranslationContext";

export default function ChooseDifficulty() {
  const t = useTranslations();

  const { handleSelectDifficulty } = useContext(GameContext);

  return (
    <LogoHeader>
      <MenuBox>
        <div className="flex flex-col items-center gap-3">
          <span className="text-body text-custom-neutral-200">
            {t?.difficultyLevelPage?.title}
          </span>
          <div className="flex flex-col items-center">
            <button
              className="menu-button"
              onClick={() => handleSelectDifficulty(DifficultyEnum.ADEPT)}
            >
              {t?.difficultyLevels?.adept}
            </button>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-0.75rem]">
              {t?.difficultyLevelPage?.adeptDesc}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="menu-button"
              onClick={() => handleSelectDifficulty(DifficultyEnum.JOURNEYMAN)}
            >
              {t?.difficultyLevels?.journeyman}
            </button>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-0.75rem]">
              {t?.difficultyLevelPage?.journeymanDesc}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="menu-button"
              onClick={() => handleSelectDifficulty(DifficultyEnum.MASTER)}
            >
              {t?.difficultyLevels?.master}
            </button>
            <span className="text-center text-caption text-custom-neutral-400 mt-[-0.75rem]">
              {t?.difficultyLevelPage?.masterDesc}
            </span>
          </div>
        </div>
        <Separator />
        <Link href={`/`} className="menu-button">
          {t?.menu?.return}
        </Link>
      </MenuBox>
      <Footer />
    </LogoHeader>
  );
}
