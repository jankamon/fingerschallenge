import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

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
      <body
        className={`flex flex-col items-center w-full md:w-2/5 mx-auto antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
