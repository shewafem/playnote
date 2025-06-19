"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { User, Menu, UserRoundCog, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
//import { NavMenu } from "./nav-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
	className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
	const { status, data } = useSession();
	const navLinks = [
		{ href: "/chords", text: "Аккорды", icon: " 🎶" },
		{ href: "/fretboard", text: "Гриф", icon: " 🎸" },
		{ href: "/profile/player", text: "Плеер", icon: " 🎧" },
		//{ href: "/progressions", text: "Прогрессии", icon: " 🎼" },
		//{ href: "/courses", text: "Курсы", icon: "" },
		//{ href: "/blog", text: "Блог", icon: "" },
	];
	return (
		<header
			className={cn(
				"h-14 fixed top-0 bg-wood-grain left-0 right-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
				className
			)}
		>
			<Container className="px-4 py-2 flex items-center justify-between">
				{/* Левая часть - Логотип */}
				<Logo />
				{/* Навигация для больших экранов */}
				<div className="flex gap-3 md:gap-8">
					{/*<NavMenu></NavMenu>*/}
					<nav className="hidden min-[37rem]:flex gap-4 md:gap-10 items-center">
						{navLinks.map((link) => (
							<Link key={link.href} href={link.href} className="flex gap-2 items-center text-sm sm:text-lg">
								{link.text}
								{link.icon}
							</Link>
						))}
					</nav>

					{/* Правая часть - Действия и мобильное меню */}
					<div className="flex items-center gap-3">
						<ModeToggle />
						{status === "authenticated" && (
							<div className="flex items-center">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Avatar className="cursor-pointer">
											<AvatarImage className="object-cover" src={data?.user.image as string} alt="avatar" />
											<AvatarFallback className="bg-background">
												<UserRoundCog />
											</AvatarFallback>
										</Avatar>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-45">
										<DropdownMenuGroup>
											<DropdownMenuItem className="cursor-pointer">
												<Link href="/profile">Мой профиль</Link>
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
											Выйти <LogOut size={28} />
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
						{status === "unauthenticated" && (
							<Link href="/sign-in" className="hidden xs:block">
								<Button className="gap-1 cursor-pointer">
									Войти
									<User size={24} />
								</Button>
							</Link>
						)}
						{/* Мобильное меню - Hamburger */}
						<div className="min-[37rem]:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline" size="icon">
										<Menu className="h-5 w-5" />
										<span className="sr-only">Открыть меню</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-full xs:w-2/3">
									<SheetHeader className="mb-3">
										<SheetTitle>
											<Logo />
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
										<SheetClose asChild>
											{status === "unauthenticated" ? (
												<Link href="/sign-in" className="nav-link">
													<Button className="w-full">
														Войти
														<User size={17} />
													</Button>
												</Link>
											) : (
												<Button onClick={() => signOut()} className="w-full nav-link cursor-pointer">
													Выйти
													<User size={17} />
												</Button>
											)}
										</SheetClose>
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
