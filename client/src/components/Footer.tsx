"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const tFooter = useTranslations("footer");

  return (
    <footer className="absolute bottom-4 flex flex-col items-center justify-center text-center gap-2 text-xs p-4">
      <p className="text-caption text-custom-neutral-400">
        {tFooter("description")}
      </p>
      <p className="flex items-center gap-2 text-caption text-custom-neutral-200">
        <span>
          {tFooter("code")}{" "}
          <Link
            href="https://jankamon.dev/"
            className="button-xxs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jan Kamoń
          </Link>
        </span>
        <span>
          {tFooter("design")}{" "}
          <Link
            href="https://www.instagram.com/konrad.holy.studio"
            className="button-xxs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Konrad Hoły
          </Link>
        </span>
      </p>
      <p className="flex items-center gap-1 text-caption text-custom-neutral-200">
        {tFooter("contribute")}{" "}
        <Link
          href="https://github.com/jankamon/fingerschallenge"
          className="button-xxs"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </p>
    </footer>
  );
}
