"use client";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";
import MenuBox from "@/components/MenuBox";
import Separator from "@/ui/Separator";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HowToPlayPage() {
  const tHowToPlay = useTranslations("howToPlay");
  const tMenu = useTranslations("menu");

  return (
    <LogoHeader>
      <MenuBox>
        <div className="flex flex-col items-start text-start">
          <p>{tHowToPlay("paragraph1")}</p>
          <p className="mt-4">{tHowToPlay("paragraph2")}</p>
          <ul className="list-disc pl-6">
            <li>{tHowToPlay("adept")}</li>
            <li>{tHowToPlay("journeyman")}</li>
            <li>{tHowToPlay("master")}</li>
          </ul>
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
