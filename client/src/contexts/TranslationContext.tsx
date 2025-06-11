"use client";

import React, { createContext, useContext } from "react";

type TranslationContextType = {
  [key: string]: string | object;
};

const TranslationContext = createContext<TranslationContextType>({});

export const useTranslations = () => useContext(TranslationContext);

export default function TranslationProvider({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: TranslationContextType;
}) {
  return (
    <TranslationContext.Provider value={dictionary}>
      {children}
    </TranslationContext.Provider>
  );
}
