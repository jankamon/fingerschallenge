"use client";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";
import MenuBox from "@/components/MenuBox";
import { useTranslations } from "@/contexts/TranslationContext";
import Separator from "@/ui/Separator";
import Link from "next/link";

export default function HowToPlayPage() {
  const t = useTranslations();

  return (
    <LogoHeader>
      <MenuBox>
        <div className="flex flex-col items-start text-start">
          <p>{t.howToPlay.paragraph1}</p>
          <p className="mt-4">{t.howToPlay.paragraph2}</p>
          <ul className="list-disc pl-6">
            <li>{t.howToPlay.adept}</li>
            <li>{t.howToPlay.journeyman}</li>
            <li>{t.howToPlay.master}</li>
          </ul>
        </div>
        <Separator />
        <Link href={`/`} className="menu-button">
          {t.menu.return}
        </Link>
      </MenuBox>
      <Footer />
    </LogoHeader>
  );
}
