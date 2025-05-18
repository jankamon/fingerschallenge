import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Gothic Chest",
  description: "Think you're slicker than Fingers?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col w-full h-screen antialiased">
        <Navigation />
        <main className="flex-1 w-full md:w-3/4 lg:w-2/5 mx-auto">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
