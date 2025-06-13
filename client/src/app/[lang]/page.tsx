"use client";
import Link from "next/link";
import Image from "next/image";
import MenuBox from "@/components/MenuBox";
import { useTranslations } from "@/contexts/TranslationContext";

export default function Home() {
  const dict = useTranslations();
  return (
    <section className="relative flex flex-col items-center justify-center gap-2 w-full h-full">
      <Image
        src="/assets/logo/logo-huge.png"
        alt="Fingers Challenge Logo"
        width={300}
        height={300}
        className="absolute top-[1.5rem]"
        priority={true}
      />
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
    </section>
  );
}
