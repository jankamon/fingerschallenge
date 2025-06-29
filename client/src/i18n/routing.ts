import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["pl", "en", "de"],

  // Used when no locale matches
  defaultLocale: "pl",
});
