"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, MoreHorizontal, Trash2, ExternalLink, AlertTriangle, Info } from "lucide-react";
import { SavedFretboard } from "@prisma/client";
import { getSavedFretboardConfigurationsAction, deleteFretboardConfigurationAction } from "@/actions/configuration";
import { toast } from "sonner";
import { getDisplayStringFromQuery } from "@/lib/fretboard-utils";

// Helper for date formatting
const formatDate = (dateString: Date | string) => {
	return new Date(dateString).toLocaleDateString("ru-RU", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default function SavedConfigsTable() {
	const [configs, setConfigs] = useState<SavedFretboard[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	const fetchConfigs = async () => {
		setLoading(true);
		setError(null);
		const result = await getSavedFretboardConfigurationsAction();
		if (result.success && result.data) {
			setConfigs(result.data);
		} else {
			setError(result.error || "Произошла неизвестная ошибка.");
			toast.error(result.error || "Не удалось загрузить схему.");
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchConfigs();
	}, []);

	const filteredConfigs = useMemo(() => {
		if (!searchTerm) return configs;
		return configs.filter(
			(config) =>
				config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				getDisplayStringFromQuery(config.link).toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [configs, searchTerm]);

	const handleLoadConfig = (configLink: string) => {
		const basePath = "/fretboard";
		router.push(`${basePath}${configLink}`);
		toast.info("Схема загружается...");
	};

	const handleDeleteConfig = async (configToDelete: SavedFretboard) => {
		if (!configToDelete) return;

		const result = await deleteFretboardConfigurationAction(configToDelete.id);
		if (result.success) {
			toast.success(result.message || "Схема удалена.");
			setConfigs((prevConfigs) => prevConfigs.filter((c) => c.id !== configToDelete.id));
		} else {
			toast.error(result.error || "Не удалось удалить схему.");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-10">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="ml-2">Загрузка схем...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive" className="my-4">
				<AlertTriangle className="h-4 w-4" />
				<AlertTitle>Ошибка</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="w-full space-y-4">
			<div className="flex flex-col sm:flex-row gap-2 items-center">
				<div className="relative w-full sm:max-w-xs">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Поиск по названию или ссылке..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-8 w-full"
						aria-label="Поиск схем"
					/>
				</div>
			</div>

			{filteredConfigs.length === 0 && !loading ? (
				<Alert className="my-4">
					<Info className="h-4 w-4" />
					<AlertTitle>Нет схем</AlertTitle>
					<AlertDescription>
						{searchTerm
							? "Схемы по вашему запросу не найдены."
							: (<Link href="/fretboard">У вас пока нет сохраненных схем грифа. Сохраните одну, чтобы увидеть ее здесь!</Link>)}
					</AlertDescription>
				</Alert>
			) : (
				<div className="rounded-md border overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[150px] sm:w-[200px] font-semibold text-center">Название</TableHead>
								<TableHead className="hidden md:table-cell font-semibold text-center">
									Тоника, тип, имя, строй, начальный лад, конечный лад
								</TableHead>
								<TableHead className="hidden lg:table-cell font-semibold text-center">Создано</TableHead>
								<TableHead className="text-right font-semibold w-[100px]">Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredConfigs.map((config) => (
								<TableRow key={config.id} className="hover:bg-muted/50">
									<TableCell className="font-medium py-3 max-w-[150px] sm:max-w-[200px] text-center">{config.name}</TableCell>
									<TableCell className="hidden md:table-cell text-sm text-muted-foreground py-3 truncate max-w-[200px] lg:max-w-xs text-center">
										<Link
											href={`${"/fretboard/"}${config.link}`}
											title={config.link}
											className="hover:underline hover:text-primary"
										>
											{getDisplayStringFromQuery(config.link)}
										</Link>
									</TableCell>
									<TableCell className="hidden lg:table-cell text-sm text-muted-foreground py-3 text-center">
										{formatDate(config.createdAt)}
									</TableCell>
									<TableCell className="text-right py-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm" className="cursor-pointer h-8 w-8 p-0">
													<span className="sr-only">Открыть меню</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handleLoadConfig(config.link)} className="cursor-pointer">
													<ExternalLink className="mr-2 h-4 w-4" />
													Загрузить
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDeleteConfig(config)}
													className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50 cursor-pointer"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Удалить
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
