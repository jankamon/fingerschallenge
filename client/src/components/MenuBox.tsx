"use client";

import Image from "next/image";
import React from "react";

interface MenuBoxProps {
  children: React.ReactNode;
  className?: string;
}

export default function MenuBox({ children, className }: MenuBoxProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 menu-box rounded-sm px-6 py-10 text-center ${className}`}
    >
      <Image
        src="/assets/ui/elements/corner-top-left.png"
        alt="Corner Top Left"
        width={32}
        height={32}
        className="absolute top-[-0.25rem] left-[-0.25rem]"
        priority={true}
      />
      <Image
        src="/assets/ui/elements/corner-top-right.png"
        alt="Corner Top Right"
        width={32}
        height={32}
        className="absolute top-[-0.25rem] right-[-0.25rem]"
        priority={true}
      />
      <Image
        src="/assets/ui/elements/corner-bottom-left.png"
        alt="Corner Bottom Left"
        width={32}
        height={32}
        className="absolute bottom-[-0.25rem] left-[-0.25rem]"
        priority={true}
      />
      <Image
        src="/assets/ui/elements/corner-bottom-right.png"
        alt="Corner Bottom Right"
        width={32}
        height={32}
        className="absolute bottom-[-0.25rem] right-[-0.25rem]"
        priority={true}
      />
      {children}
    </div>
  );
}
