"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center gap-4 md:gap-12 w-full h-11 px-4 py-2 bg-slate-800 text-gray-100 text-xl text-center font-bold">
      <Link href="/" className={`${pathname === "/" ? "text-amber-300" : ""}`}>
        Game
      </Link>
      <Link
        href="/ranking"
        className={`${pathname === "/ranking" ? "text-amber-300" : ""}`}
      >
        Leaderboard
      </Link>
      <Link
        href="/stats"
        className={`${pathname === "/stats" ? "text-amber-300" : ""}`}
      >
        Stats
      </Link>
    </nav>
  );
}
