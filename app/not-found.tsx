import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust path as needed

export default function NotFound() {
	return (
		<section className="mt-20 gap-6 text-center w-full flex flex-col items-center justify-center bg-background text-foreground">
			<h1 className="text-8xl sm:text-9xl font-extrabold text-primary tracking-tighter font-logo">404</h1>
			<h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Упс! Такой страницы нет 😔</h2>
			<p className="text-base sm:text-lg text-muted-foreground">
				Эта страница, по-видимому, изучает гаммы в другом измерении.
			</p>
			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
				<Button asChild size="lg" className="w-auto">
					<Link href="/">На главную 🏠</Link>
				</Button>
			</div>
		</section>
	);
}
