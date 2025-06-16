"use client"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link href="/" className={cn("flex items-center justify-center w-30 sm:w-40", className)}>
      <Image 
        src="/logo-light.svg" 
        alt="logo" 
        width={0} 
        height={0} 
        sizes="100vw" 
        className="w-full h-full dark:hidden" 
        priority
      />
      <Image 
        src="/logo-dark.svg" 
        alt="logo" 
        width={0} 
        height={0} 
        sizes="100vw" 
        className="hidden w-full h-full dark:block" 
        priority
      />
    </Link>
  );
};

export default Logo;