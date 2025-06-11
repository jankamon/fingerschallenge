import "server-only";

const dictionaries = {
  pl: () =>
    import("../../dictonaries/pl.json").then((module) => module.default),
  en: () =>
    import("../../dictonaries/en.json").then((module) => module.default),
  de: () =>
    import("../../dictonaries/de.json").then((module) => module.default),
};

export const getDictionary = async (locale: "pl" | "en" | "de") =>
  dictionaries[locale]();
