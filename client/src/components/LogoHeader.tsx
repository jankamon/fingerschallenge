import React from "react";
import Image from "next/image";

interface LogoHeaderProps {
  children?: React.ReactNode;
  className?: string;
  logoSize?: number;
  logoPosition?: string;
  gap?: string;
}

export default function LogoHeader({
  children,
  className = "",
}: LogoHeaderProps) {
  return (
    <section
      className={`relative flex flex-col items-center justify-center w-full h-full min-h-screen gap-8 p-6 ${className}`}
    >
      <Image
        src="/assets/logo/logo-huge.png"
        alt="Fingers Challenge Logo"
        width={300}
        height={300}
        className="absolute top-[0.5rem]"
        priority={true}
        unoptimized={true}
      />
      {children}
    </section>
  );
}
