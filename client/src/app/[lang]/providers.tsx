"use client";

import { GameProvider } from "@/contexts/GameContext";
import TranslationProvider from "@/contexts/TranslationContext";

export default function Providers({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: Record<string, string | object>;
}) {
  return (
    <TranslationProvider dictionary={dictionary}>
      <GameProvider>{children}</GameProvider>
    </TranslationProvider>
  );
}
