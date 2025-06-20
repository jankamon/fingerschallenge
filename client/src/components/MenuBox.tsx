"use client";

import Image from "next/image";
import React from "react";

interface MenuBoxProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function MenuBox({
  children,
  className = "",
  noPadding = false,
}: MenuBoxProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 menu-box rounded-sm ${
        noPadding ? "" : "px-6 py-10"
      } text-center ${className}`}
    >
      <Image
        src="/assets/ui/elements/corner-top-left.png"
        alt="Corner Top Left"
        width={40}
        height={40}
        className="absolute top-[-0.25rem] left-[-0.25rem]"
        priority={true}
        unoptimized={true}
      />
      <Image
        src="/assets/ui/elements/corner-top-right.png"
        alt="Corner Top Right"
        width={40}
        height={40}
        className="absolute top-[-0.25rem] right-[-0.25rem]"
        priority={true}
        unoptimized={true}
      />
      <Image
        src="/assets/ui/elements/corner-bottom-left.png"
        alt="Corner Bottom Left"
        width={40}
        height={40}
        className="absolute bottom-[-0.25rem] left-[-0.25rem]"
        priority={true}
        unoptimized={true}
      />
      <Image
        src="/assets/ui/elements/corner-bottom-right.png"
        alt="Corner Bottom Right"
        width={40}
        height={40}
        className="absolute bottom-[-0.25rem] right-[-0.25rem]"
        priority={true}
        unoptimized={true}
      />
      {children}
    </div>
  );
}
