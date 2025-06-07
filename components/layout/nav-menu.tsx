"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Guitar, Music } from "lucide-react";

interface NestedLink {
	href: string;
	text: string;
	description?: string;
	icon?: React.ReactNode;
}

interface NavItem {
	type: "link" | "trigger";
	text: string;
	href?: string; 
	icon?: React.ReactNode;
	items?: NestedLink[]; 
}

const navItems: NavItem[] = [
	{
		type: "trigger",
		text: "Практика",
		items: [
			{ href: "/fretboard", text: "Гриф", description: "Изучение нот на грифе.", icon: <Guitar size={17} /> },
			//{ href: "/progressions", text: "Прогрессии", description: "Работа с аккордовыми прогрессиями." },
			{ href: "/profile/player", text: "Плеер", description: "Музыкальный плеер для практики." },
		],
	},
	{
		type: "trigger",
		text: "Теория",
		items: [
			{ href: "/chords", text: "Аккорды", description: "Энциклопедия аккордов.", icon: <Music size={17} /> },
			//{ href: "/courses", text: "Курсы", description: "Обучающие курсы по гитаре." },
			//{ href: "/blog", text: "Статьи", description: "Статьи и уроки." },
		],
	},
	//{
	//	type: "link",
	//	text: "О нас",
	//	href: "/about",
	//},
];

export function NavMenu() {
	return (
		<NavigationMenu className="hidden min-[37rem]:block">
			<NavigationMenuList className="">
				{navItems.map((item) => {
					if (item.type === "trigger") {
						return (
							<NavigationMenuItem key={item.text}>
								<NavigationMenuTrigger className="cursor-pointer">{item.text}</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="flex flex-col md:w-50 lg:w-75 ">
										{/* You can add a prominent item on the left grid column here if needed */}
										{item.items?.map((nestedItem) => (
											<ListItem key={nestedItem.href} href={nestedItem.href} title={nestedItem.text}>
												{nestedItem.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						);
					} else {
						return (
							<NavigationMenuItem key={item.href}>
								<NavigationMenuLink href={item.href} className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
									{item.icon && <span className="mr-2">{item.icon}</span>}
									{item.text}
								</NavigationMenuLink>
							</NavigationMenuItem>
						);
					}
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

export const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<a
						ref={ref}
						className={cn(
							"block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className
						)}
						{...props}
					>
						<div className="text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
					</a>
				</NavigationMenuLink>
			</li>
		);
	}
);
ListItem.displayName = "ListItem";
