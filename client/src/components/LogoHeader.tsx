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
      className={`relative flex flex-col items-center justify-center w-full h-full min-h-screen ${className}`}
    >
      <Image
        src="/assets/logo/logo-huge.png"
        alt="Fingers Challenge Logo"
        width={320}
        height={141}
        className="absolute top-[0.5rem] md:top-[4.5rem] w-[246px] h-auto md:w-[320px]"
        priority={true}
        unoptimized={true}
      />
      {children}
    </section>
  );
}
