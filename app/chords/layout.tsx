import TopBar from "@/components/chords/top-bar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Библиотека аккордов 🎶",
	description: "Изучайте гитарные аккорды!",
};

export default function ChordsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<h2 className="text-4xl text-center font-bold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
				Библиотека аккордов
			</h2>
			<TopBar className="mb-4"></TopBar>
			{children}
			<ScrollToTop size={40} minHeight={600} scrollTo={10} className="w-12 h-12"></ScrollToTop>
		</>
	);
}
