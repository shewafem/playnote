import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust path as needed
import { Home } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex mt-8 flex-col items-center justify-center bg-background text-foreground">
			<div className="text-center space-y-6 max-w-md w-full">
				<div className="flex justify-center"></div>
				<h1 className="text-8xl sm:text-9xl font-extrabold text-primary tracking-tighter font-logo">404</h1>

				<h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Упс! Такой страницы нет 😔</h2>

				<p className="text-base sm:text-lg text-muted-foreground">
					Эта страница, по-видимому, изучает гаммы в другом измерении.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
					<Button asChild size="lg" className="w-auto">
						<Link href="/">
							На главную 🏠
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
