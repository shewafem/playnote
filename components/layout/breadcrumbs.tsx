// components/custom/AppBreadcrumbs.tsx
"use client"; // Этот компонент использует хуки, поэтому он должен быть клиентским

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Убедитесь, что путь правильный
import React from "react";

// (Опционально) Словарь для кастомных названий сегментов
const segmentTranslations: { [key: string]: string } = {
  chords: "Аккорды",
  fretboard: "Гриф",
  progressions: "Прогрессии",
  profile: "Профиль",
  player: "Проигрыватель",
  // Добавьте другие переводы по необходимости
};

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // Разделяем путь и удаляем пустые строки

  // Если мы на главной странице, можно ничего не показывать или показать "Главная"
  if (segments.length === 0) {
    return 
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Пытаемся получить перевод или используем сам сегмент с большой буквы
    const rawLabel = segmentTranslations[segment.toLowerCase()] || segment;
    // Проверяем, не является ли сегмент динамическим (например, ID)
    // Это очень упрощенная проверка, для реальных ID может потребоваться более сложная логика
    // или загрузка имени по ID на странице и передача его в контекст для крошек
    const isDynamicSegment = /^[0-9a-fA-F]{24}$/.test(segment) || /^\d+$/.test(segment); // Пример для MongoDB ID или просто чисел
    
    let label = rawLabel;
    if (!segmentTranslations[segment.toLowerCase()] && !isDynamicSegment) {
        // Капитализация, если нет перевода и это не явный ID
        label = segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    } else if (isDynamicSegment && !segmentTranslations[segment.toLowerCase()]) {
        // Для динамических сегментов без перевода можно оставить как есть или показать "Детали"
        // label = "Детали"; // или segment;
    }


    const isLast = index === segments.length - 1;

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <Breadcrumb className="mb-4 ml-5"> {/* Добавим немного отступа снизу */}
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
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
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