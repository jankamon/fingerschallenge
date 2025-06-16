"use client";
import Link from "next/link";
import MenuBox from "@/components/MenuBox";
import { useTranslations } from "@/contexts/TranslationContext";
import LanguageButton from "@/buttons/LanguageButton";
import LogoHeader from "@/components/LogoHeader";

export default function Home() {
  const dict = useTranslations();

  return (
    <LogoHeader>
      <MenuBox>
        <Link href="/game" className="menu-button">
          {dict.menu.play}
        </Link>
        <Link href="/ranking" className="menu-button">
          {dict.menu.ranking}
        </Link>
        <Link href="/how-to-play" className="menu-button">
          {dict.menu.howToPlay}
        </Link>
        <Link
          href="https://buycoffee.to/jankamon"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-button"
        >
          {dict.menu.donate}
        </Link>
      </MenuBox>
      <LanguageButton />
    </LogoHeader>
  );
}
