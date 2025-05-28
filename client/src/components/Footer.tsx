"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center text-center text-xs p-4 text-gray-400">
      <p>
        This is a non-commercial fan project inspired by the Gothic series.
        <br /> It is not affiliated with or endorsed by THQ Nordic or Piranha
        Bytes, the rightful owners of the Gothic brand and assets.
      </p>
      <p>
        Project:{" "}
        <Link
          href="https://jankamon.dev/"
          className="text-amber-300 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jan Kamoń
        </Link>{" "}
        • Design:{" "}
        <Link
          href="#"
          className="text-amber-300 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Konrad Hoły
        </Link>
      </p>
      <p>
        Add something from yourself:{" "}
        <Link
          href="https://github.com/jankamon/fingerschallenge"
          className="text-amber-300 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </p>
      <p>Tested on Gothic Community.</p>
      <Link
        href="https://buycoffee.to/jankamon"
        className="text-amber-300 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Support project ☕
      </Link>
    </footer>
  );
}
