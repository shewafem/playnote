"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react"; // Import useState and useEffect

const features = [
	{
		id: "feature-1",
		title: "Интерактивный гриф 🎸",
		description:
			"Обучающий интерактивный гриф для упражнений с расположением нот. Вы можете менять строй гитары, выбирать тонику и гаммы, распознавать ноты и аккорды, а также тренировать слух с помощью встроенного воспроизведения нот.",
		image: "/images/fretboard.png",
		darkImage: "/images/fretboard-dark.png",
		link: "/fretboard",
	},
	{
		id: "feature-2",
		title: "Библиотека аккордов 🎶",
		description:
			"Обширная интерактивная библиотека гитарных аппликатур, с помощью которой можно искать нужные аккорды, выбирая тонику (C, D, E...) и тип аккорда (minor, major...). Каждый аккорд можно скачать в SVG или PNG. Также вы можете прослушать звучание аккорда при клике на него.",
		image: "/images/chords.png",
		darkImage: "/images/chords-dark.png",
		link: "/chords",
	},
	{
		id: "feature-3",
		title: "Генератор прогресий 🎵",
		description:
			"Генератор аккордовых прогрессий с выбором тоники и популярных прогрессий и с возможностью экспорта в PNG.",
		image: "/images/progressions.png",
		darkImage: "/images/progressions-dark.png",
		link: "/progressions",
	},
	{
		id: "feature-4",
		title: "Онлайн-плеер табулатур 🎼",
		description:
			"Плеер alphaTab для проигрывания музыкальных файлов-табулатур (Guitar Pro файлы .gp, MusicXML, alphaTex)",
		image: "/images/player.png",
		darkImage: "/images/player-dark.png",
		link: "/player",
	},
];

const Feature = () => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<section className="py-20 mx-auto flex items-center justify-center">
			<div className="container flex flex-col gap-8 lg:px-16">
				<div className="w-full">
					<h2 className="mb-3 text-xl font-extrabold leading-[1.15] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary md:mb-4 md:text-4xl lg:mb-6 text-center">
						Наши преимущества
					</h2>
					<p className="mb-4 text-muted-foreground lg:text-lg text-center">
						Откройте для себя возможности, которые помогут вам научиться играть на гитаре.
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:gap-8 items-start">
					{features.map((feature) => {
                        // Determine the correct image source
                        // Fallback to light image if not mounted or theme is not yet resolved correctly,
                        // though `resolvedTheme` should be stable once `mounted` is true.
                        const imageSrc = mounted && resolvedTheme === "dark" 
                            ? feature.darkImage 
                            : feature.image;
                        
                        // Alternatively, to avoid any flash and ensure layout is stable,
                        // you can render a placeholder until mounted.
                        if (!mounted) {
                            // Render a placeholder or null. A placeholder div with the same aspect ratio is best.
                            // This prevents the image from "popping in" and causing layout shift.
                            return (
                                <div key={feature.id} className="flex flex-col rounded-xl border border-border">
                                    <div className="aspect-16/9 h-full w-full bg-muted/20 animate-pulse" /> {/* Placeholder */}
                                    <div className="px-4 py-4 ">
                                        <h3 className="mb-3 text-lg font-semibold md:text-2xl">{feature.title}</h3>
                                        <p className="text-muted-foreground lg:text-lg">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        }

						return (
							<div key={feature.id} className="flex flex-col rounded-xl border border-border">
								<Link href={feature.link}>
									<div>
										<Image
											width={1000}
											height={1000}
											src={imageSrc}
											alt={feature.title}
											className="aspect-16/9 h-full w-full object-contain"
										/>
									</div>
									<div className="px-4 py-4 ">
										<h3 className="mb-3 text-lg font-semibold md:text-2xl">{feature.title}</h3>
										<p className="text-muted-foreground lg:text-lg">{feature.description}</p>
									</div>
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { Feature };