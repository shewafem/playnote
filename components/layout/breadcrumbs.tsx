"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { formatItem } from "@/lib/chords/utils";

const segmentTranslations: { [key: string]: string } = {
	chords: "Аккорды",
	fretboard: "Гриф",
	//progressions: "Прогрессии",
	profile: "Профиль",
	player: "Проигрыватель",
	"sign-in": "Вход",
	"sign-up": "Регистрация",
	settings: "Настройки",
	admin: "Панель администратора",
	users: "Пользователи",
	tunings: "Строй",
	arpeggios: "Арпеджио",
	scales: "Гаммы",
	add: "Создать",
  fretboards: "Сохраненные",
  "about-us": "О нас",
};

export function AppBreadcrumbs() {
	const pathname = usePathname();
	const segments = pathname
		.split("/")
		.filter(Boolean)
		.map((segment) => formatItem(segment));

	if (segments.length === 0) {
		return;
	}

	const breadcrumbs = segments.map((segment, index) => {
		const href = "/" + segments.slice(0, index + 1).join("/");
		const rawLabel = segmentTranslations[segment.toLowerCase()] || segment;
		const isDynamicSegment = /^[0-9a-fA-F]{24}$/.test(segment) || /^\d+$/.test(segment);

		let label = rawLabel;
		if (!segmentTranslations[segment.toLowerCase()] && !isDynamicSegment) {
			label = segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
		} else if (isDynamicSegment && !segmentTranslations[segment.toLowerCase()]) {
		}

		const isLast = index === segments.length - 1;

		return {
			href,
			label,
			isLast,
		};
	});

	return (
		<Breadcrumb className="mb-4 ml-5">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/">Главная</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{breadcrumbs.map((crumb) => (
					<React.Fragment key={crumb.href}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{crumb.label.startsWith("C") && crumb.label.length === 25 ? (
								<BreadcrumbLink asChild>
									<Link href={crumb.href}>Редактирование</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbLink asChild>
									<Link href={crumb.href}>{crumb.label}</Link>
								</BreadcrumbLink>
							)}

							
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
