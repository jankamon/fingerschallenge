"use client";
import LogoHeader from "@/components/LogoHeader";
import MenuBox from "@/components/MenuBox";
import { useTranslations } from "@/contexts/TranslationContext";
import Link from "next/link";
import { PolishFlag, EnglishFlag, DeutschFlag } from "@/ui/Flags";
import { usePathname } from "next/navigation";
import Separator from "@/ui/Separator";
import Footer from "@/components/Footer";

const DEFAULT_LANGUAGE = "pl";
const SUPPORTED_LANGUAGES = ["pl", "en", "de"];

export default function LanguagePage() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract language from path
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0] || "";

  // Check if the first path segment is a supported language
  const isLanguageInPath = SUPPORTED_LANGUAGES.includes(firstSegment);

  // Determine current language - if no language in path, use default
  const currentLanguage = isLanguageInPath ? firstSegment : DEFAULT_LANGUAGE;

  // Helper function to determine if a language is active
  const isActiveLanguage = (lang: string) => currentLanguage === lang;

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
        <Link href={`/${currentLanguage}`} className="menu-button">
          {t.menu.return}
        </Link>
      </MenuBox>
      <Footer />
    </LogoHeader>
  );
}
