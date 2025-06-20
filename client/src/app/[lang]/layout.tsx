import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "./providers";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import i18nConfig from "../../../i18nConfig";
import { getDictionary } from "./dictonaries";

export async function generateMetadata({
  params,
}: {
  params: { lang: "pl" | "en" | "de" };
}): Promise<Metadata> {
  const { lang } = await params;

  const t = await getDictionary(lang);

  return {
    title: t.metadata.title || "Gothic Chest",
    description: t.metadata.description || "Think you're slicker than Fingers?",
  };
}

const gothicFont = localFont({
  src: "../GothicIINocKruka.ttf",
  variable: "--font-gothic",
});

const archivoFont = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: "pl" | "en" | "de" };
}>) {
  const { lang } = await params;

  if (!i18nConfig.locales.includes(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`flex flex-col w-full h-screen custom-background-dark-2 ${gothicFont.variable} ${archivoFont.variable} antialiased`}
      >
        <Providers dictionary={dictionary}>
          <main className="flex-1 w-full md:w-3/4 lg:w-2/5 mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
