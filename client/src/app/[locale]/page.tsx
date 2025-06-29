"use client";
import Link from "next/link";
import MenuBox from "@/components/MenuBox";
import LanguageButton from "@/buttons/LanguageButton";
import LogoHeader from "@/components/LogoHeader";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("menu");

  return (
    <LogoHeader>
      <div className="flex flex-col items-center justify-center gap-8">
        <MenuBox>
          <Link href="/game" className="menu-button">
            {t("play")}
          </Link>
          <Link href="/ranking" className="menu-button">
            {t("ranking")}
          </Link>
          <Link href="/how-to-play" className="menu-button">
            {t("howToPlay")}
          </Link>
          <Link
            href="https://buycoffee.to/jankamon"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-button"
          >
            {t("donate")}
          </Link>
        </MenuBox>
        <LanguageButton />
      </div>
      <Footer />
    </LogoHeader>
  );
}
