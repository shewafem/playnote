import type { Metadata } from "next";
import { Geologica, JetBrains_Mono, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";

const geologica = Geologica({
	variable: "--font-geologica",
	subsets: ["latin", "cyrillic"],
});

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin", "cyrillic"],
});

const delaGothicOne = Dela_Gothic_One({
	variable: "--font-delagothic-one",
	subsets: ["latin", "cyrillic"],
	weight: "400",
});

export const metadata: Metadata = {
	title: "Playnote!",
	description: "Современное приложения для обучения игре на гитаре",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className="scroll-smooth" lang="en" suppressHydrationWarning>
			<body
				className={`${geologica.variable} ${jetBrainsMono.variable} ${delaGothicOne.variable} mt-12 font-sans antialiased`}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Header />
					<main>
						<Container>{children}</Container>
					</main>
					<Footer></Footer>
				</ThemeProvider>
			</body>
		</html>
	);
}
