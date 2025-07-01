"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { PolishFlag, EnglishFlag, DeutschFlag } from "@/ui/Flags";
import { useLocale } from "next-intl";

export default function LanguageButton() {
  const locale = useLocale();

  // Determine flag and language code based on current language
  const getLanguageElements = () => {
    switch (locale) {
      case "pl":
        return { flag: <PolishFlag />, code: "PL" };
      case "de":
        return { flag: <DeutschFlag />, code: "DE" };
      case "en":
      default:
        return { flag: <EnglishFlag />, code: "EN" };
    }
  };

  const { flag, code } = getLanguageElements();

  return (
    <Link href="/language">
      <div className="relative menu-solo-button flex items-center justify-center">
        <Image
          src="/assets/ui/elements/ornament-left.png"
          alt="Ornament Left"
          width={32}
          height={48}
          className="absolute left-[-0.9375rem] top-[-0.3125rem]"
          priority={true}
          unoptimized={true}
        />
        <Image
          src="/assets/ui/elements/ornament-right.png"
          alt="Ornament Right"
          width={32}
          height={48}
          className="absolute right-[-0.9375rem] top-[-0.3125rem]"
          priority={true}
          unoptimized={true}
        />
        {flag}
        {code}
      </div>
    </Link>
  );
}
