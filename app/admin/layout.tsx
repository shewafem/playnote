"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	Users,
	SlidersHorizontal,
	GitFork,
	ListMusic,
	LogOut, 
	PanelLeft,
	Guitar,
} from "lucide-react";
import { cn } from "@/lib/utils"; 

interface NavLinkItem {
	href: string;
	label: string;
	icon: React.ElementType;
	segment?: string;
}

const mainNavLinks: NavLinkItem[] = [
	{ href: "/admin/users", label: "Пользователи", icon: Users, segment: "users" },
	{ href: "/admin/tunings", label: "Строй", icon: SlidersHorizontal, segment: "tunings" },
	{ href: "/admin/arpeggios", label: "Арпеджио", icon: GitFork, segment: "arpeggios" },
	{ href: "/admin/scales", label: "Гаммы", icon: ListMusic, segment: "scales" },
];

const secondaryNavLinks: NavLinkItem[] = [
	{ href: "/", label: "Вернуться на сайт", icon: LogOut, segment: undefined },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
		<div className="flex flex-col h-full">
			<div
				className={cn(
					"p-4 border-b",
					isSidebarOpen && !isMobile ? "flex items-center justify-between" : "flex items-center justify-center"
				)}
			>
				<Link href="/admin" className="flex items-center gap-2">
					<Guitar className={cn("h-7 w-7 text-primary", isSidebarOpen || isMobile ? "mr-1" : "")} />
					{(isSidebarOpen || isMobile) && <h1 className="text-xl font-bold text-primary">Панель</h1>}
				</Link>
				{!isMobile && (
					<Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(isSidebarOpen ? "" : "rotate-180")}>
						<PanelLeft className="h-5 w-5" />
					</Button>
				)}
			</div>

			<ScrollArea className="flex-1 px-2 py-4">
				<nav className="grid items-start gap-1">
					<TooltipProvider delayDuration={0}>
						{mainNavLinks.map((link) => {
							const isActive = link.segment === null ? pathname === link.href : pathname.startsWith(link.href);
							return (
								<Tooltip key={link.label}>
									<TooltipTrigger asChild>
										<Link href={link.href}>
											<Button
												variant={isActive ? "secondary" : "ghost"}
												className={cn("w-full justify-start gap-2", !(isSidebarOpen || isMobile) && "justify-center")}
												asChild={isMobile}
											>
												{isMobile ? (
													<SheetClose asChild>
														<div>
															<link.icon className={cn("h-5 w-5", isSidebarOpen || isMobile ? "" : "h-6 w-6")} />
															{(isSidebarOpen || isMobile) && <span className="text-sm font-medium">{link.label}</span>}
														</div>
													</SheetClose>
												) : (
													<>
														<link.icon className={cn("h-5 w-5", isSidebarOpen || isMobile ? "" : "h-6 w-6")} />
														{(isSidebarOpen || isMobile) && <span className="text-sm font-medium">{link.label}</span>}
													</>
												)}
											</Button>
										</Link>
									</TooltipTrigger>
									{!(isSidebarOpen || isMobile) && (
										<TooltipContent side="right">
											<p>{link.label}</p>
										</TooltipContent>
									)}
								</Tooltip>
							);
						})}
					</TooltipProvider>
				</nav>
			</ScrollArea>

			<div className="mt-auto p-2 border-t">
				<nav className="grid items-start gap-1">
					<TooltipProvider delayDuration={0}>
						{secondaryNavLinks.map((link) => {
							const isActive = link.segment ? pathname.startsWith(link.href) : pathname === link.href;
							return (
								<Tooltip key={link.label}>
									<TooltipTrigger asChild>
										<Link href={link.href}>
											<Button
												variant={isActive ? "secondary" : "ghost"}
												className={cn("w-full justify-start gap-2", !(isSidebarOpen || isMobile) && "justify-center")}
												asChild={isMobile}
											>
												{isMobile ? (
													<SheetClose asChild>
														<div>
															<link.icon className={cn("h-5 w-5", isSidebarOpen || isMobile ? "" : "h-6 w-6")} />
															{(isSidebarOpen || isMobile) && <span className="text-sm font-medium">{link.label}</span>}
														</div>
													</SheetClose>
												) : (
													<>
														<link.icon className={cn("h-5 w-5", isSidebarOpen || isMobile ? "" : "h-6 w-6")} />
														{(isSidebarOpen || isMobile) && <span className="text-sm font-medium">{link.label}</span>}
													</>
												)}
											</Button>
										</Link>
									</TooltipTrigger>
									{!(isSidebarOpen || isMobile) && (
										<TooltipContent side="right">
											<p>{link.label}</p>
										</TooltipContent>
									)}
								</Tooltip>
							);
						})}
					</TooltipProvider>
				</nav>
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen bg-muted/40">
			<aside
				className={cn(
					"hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
					isSidebarOpen ? "w-64" : "w-[72px]" 
				)}
			>
				<NavContent />
			</aside>

			<div className="flex flex-col flex-1">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button size="icon" variant="outline" className="md:hidden">
								<PanelLeft className="h-5 w-5" />
								<span className="sr-only">Открыть меню</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-64 md:w-72">
							<SheetHeader>
                <SheetTitle><NavContent isMobile={true} /></SheetTitle>
                </SheetHeader>
						</SheetContent>
					</Sheet>
					<div className="flex-1"><h1 className="font-semibold text-lg">Панель администратора</h1></div>
				</header>
				<main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 overflow-auto">
					<div className="max-w-7xl mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
