import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
	className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size }) => {
	return (
		<Link href="/" className={cn("flex items-center justify-center", className)}>
			<Image src="/logo.svg" alt="logo" width={size} height={size} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
			<p className="text-base sm:text-2xl font-logo font-black">Playnote!</p> {/* Hide text on very small screens */}
		</Link>
	);
};

export default Logo;
