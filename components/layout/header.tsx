"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { User, Menu } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
//import { FaPeopleGroup } from "react-icons/fa6";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavMenu } from "./nav-menu";

interface Props {
	className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
	// Navigation links data
	const navLinks = [
		{ href: "/chords", text: "Аккорды", icon: " 🎶" },
		{ href: "/fretboard", text: "Гриф", icon: " 🎸" },
		{ href: "/progressions", text: "Прогрессии", icon: " 🎼" },
		{ href: "/courses", text: "Курсы", icon: "" },
		{ href: "/blog", text: "Блог", icon: "" },
		{ href: "/about", text: "О нас", icon: "" },
	];

	return (
		<header
			className={cn(
				"h-14 fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
				className
			)}
		>
			<Container className="px-4 py-2 flex items-center justify-between">
				{/* Левая часть - Логотип */}
				<Logo size={28} />
				{/* Навигация для больших экранов */}
				<div className="flex gap-3 md:gap-8">
					<NavMenu></NavMenu>

					{/* Правая часть - Действия и мобильное меню */}
					<div className="flex items-center gap-3">
						{" "}
						<ModeToggle />
						<Link href="/login" className="hidden xs:block">
							<Button className="gap-1 cursor-pointer">
								Войти
								<User size={24} />
							</Button>
						</Link>
						{/* Мобильное меню - Hamburger */}
						<div className="xs:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline" size="icon">
										<Menu className="h-5 w-5" />
										<span className="sr-only">Открыть меню</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-3/4 min-[400px]:w-1/2 sm:w-1/3">
									<SheetHeader className="mb-3">
										<SheetTitle>
											<Logo size={28} />
										</SheetTitle>
									</SheetHeader>
									<nav className="flex flex-col gap-4 px-4">
										{navLinks.map((link) => (
											<SheetClose key={link.href} asChild>
												<Link href={link.href} className="nav-link flex items-center gap-2 text-lg">
													{link.text}
													{link.icon}
												</Link>
											</SheetClose>
										))}
										<hr className="my-2" />
										<Link href="/login" className="nav-link">
											<Button className="w-full">
												Войти
												<User size={17} />
											</Button>
										</Link>
									</nav>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</Container>
		</header>
	);
};
