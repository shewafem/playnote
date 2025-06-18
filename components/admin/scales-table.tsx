// components/admin/scales-table.tsx
"use client";

import { Scale } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import {
	MoreHorizontal,
	Pencil,
	Trash2,
	Music2,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search as SearchIcon,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { deleteScale } from "@/app/admin/scales/actions";

interface ScalesTableProps {
	scales: Scale[];
	itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export function ScalesTable({ scales: initialScales, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }: ScalesTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, initialScales]);

	const filteredScales = useMemo(() => {
		if (!searchTerm.trim()) {
			return initialScales;
		}
		return initialScales.filter(
			(scale) =>
				scale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				scale.formula.join(", ").includes(searchTerm.toLowerCase())
		);
	}, [initialScales, searchTerm]);

	const totalPages = Math.ceil(filteredScales.length / itemsPerPage);

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		} else if (totalPages === 0 && initialScales.length > 0) {
			setCurrentPage(1);
		} else if (currentPage === 0 && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [totalPages, currentPage, initialScales.length]);

	const paginatedScales = useMemo(() => {
		if (totalPages === 0) return [];
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredScales.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredScales, currentPage, itemsPerPage, totalPages]);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleDeleteScale = async (scale: { id: number; name: string }) => {
		toast.promise(deleteScale(scale.id), {
			loading: "Удаление гаммы...",
			success: (result) => {
				if (result.success) {
					return `Гамма "${scale.name}" успешно удалена.`;
				} else {
					throw new Error(result.error || "Не удалось удалить гамму.");
				}
			},
			error: (error) => error.message || "Произошла ошибка при удалении.",
		});
	};

	const startItemIndex = paginatedScales.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endItemIndex = paginatedScales.length > 0 ? Math.min(currentPage * itemsPerPage, filteredScales.length) : 0;

	return (
		<div className="space-y-4">
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Поиск по названию или формуле..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-sm pl-10"
				/>
			</div>
			{initialScales.length === 0 && !searchTerm && (
				<p className="text-center text-muted-foreground py-4">
					Пока нет ни одной гаммы.{" "}
					<Link href="/admin/scales/add" className="text-primary hover:underline">
						Добавить новую?
					</Link>
				</p>
			)}

			{filteredScales.length > 0 ? (
				<>
					<div className="rounded-md border overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50 hover:bg-muted/60">
									<TableHead className="w-[40%] min-w-[150px]">Название</TableHead>
									<TableHead className="w-[40%] min-w-[200px]">Формула</TableHead>
									<TableHead className="w-[20%] text-right">Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="divide-y">
								{paginatedScales.map((scale) => (
									<TableRow key={scale.id} className="hover:bg-muted/30">
										<TableCell className="font-medium">
											<div className="flex items-center">
												<Music2 className="h-4 w-4 mr-2 text-muted-foreground hidden sm:inline-block" />
												{scale.name}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{scale.formula.map((step, index) => (
													<Badge key={index} variant="secondary" className="font-mono">
														{step}
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
														<span className="sr-only">Открыть меню</span>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Действия</DropdownMenuLabel>
													<DropdownMenuItem asChild>
														<Link href={`/admin/scales/${scale.id}`} className="cursor-pointer">
															<Pencil className="mr-2 h-4 w-4" />
															Редактировать
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDeleteScale({ id: scale.id, name: scale.name })}
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

					{totalPages > 1 && (
						<div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
							<div className="text-sm text-muted-foreground">
								Показано <span className="font-medium">{startItemIndex}</span> -{" "}
								<span className="font-medium">{endItemIndex}</span> из{" "}
								<span className="font-medium">{filteredScales.length}</span> гамм
							</div>
							<div className="flex items-center space-x-1">
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(1)}
									disabled={currentPage === 1}
									title="Первая"
									className="cursor-pointer"
								>
									<ChevronsLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									title="Назад"
									className="cursor-pointer"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<span className="px-2 text-sm">
									Стр. {currentPage} из {totalPages}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									title="Вперед"
									className="cursor-pointer"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(totalPages)}
									disabled={currentPage === totalPages}
									title="Последняя"
									className="cursor-pointer"
								>
									<ChevronsRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</>
			) : (
				searchTerm &&
				initialScales.length > 0 && <p className="text-center text-muted-foreground py-4">Поиск не дал результатов.</p>
			)}
		</div>
	);
}
