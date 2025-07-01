"use client";
import LogoHeader from "@/components/LogoHeader";
import MenuBox from "@/components/MenuBox";
import Link from "next/link";
import { PolishFlag, EnglishFlag, DeutschFlag } from "@/ui/Flags";
import Separator from "@/ui/Separator";
import Footer from "@/components/Footer";
import { useLocale, useTranslations } from "next-intl";

export default function LanguagePage() {
  const tMenu = useTranslations("menu");
  const locale = useLocale();

  const isActiveLanguage = (lang: string) => locale === lang;

  return (
    <LogoHeader>
      <MenuBox>
        <Link
          href="/pl"
          className={`menu-button ${
            isActiveLanguage("pl") ? "menu-button-active" : ""
          }`}
        >
          <PolishFlag />
          Polski
        </Link>
        <Link
          href="/en"
          className={`menu-button ${
            isActiveLanguage("en") ? "menu-button-active" : ""
          }`}
        >
          <EnglishFlag />
          English
        </Link>
        <Link
          href="/de"
          className={`menu-button ${
            isActiveLanguage("de") ? "menu-button-active" : ""
          }`}
        >
          <DeutschFlag />
          Deutsch
        </Link>
        <Separator />
        <Link href={`/${locale}`} className="menu-button">
          {tMenu("return")}
        </Link>
      </MenuBox>
      <Footer />
    </LogoHeader>
  );
}
