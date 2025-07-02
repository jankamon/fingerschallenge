import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "./providers";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fingerschallenge.com";

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: baseUrl,
      type: "website",
      images: [
        {
          url: "/logo/logo-huge.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/logo/logo-huge.png"],
      creator: "@JanKamonPL",
    },
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
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`flex flex-col w-full h-screen custom-background-dark-2 ${gothicFont.variable} ${archivoFont.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <Providers>
            <main className="flex-1 w-full md:w-3/4 lg:w-2/5 mx-auto">
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
