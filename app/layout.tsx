import type { Metadata } from "next";
import { Geologica, JetBrains_Mono, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { SessionProvider } from "next-auth/react";
import { AppBreadcrumbs } from "@/components/layout/breadcrumbs";
import { Suspense } from "react";
import Loading from "./loading";

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
				className={`${geologica.variable} ${jetBrainsMono.variable} ${delaGothicOne.variable} mt-14 font-sans antialiased`}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<SessionProvider>
						<Header />
						<main>
							<Container>
								<AppBreadcrumbs ></AppBreadcrumbs>
								<Suspense fallback={<Loading></Loading>}>{children}</Suspense>
							</Container>
						</main>
						<Footer></Footer>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
