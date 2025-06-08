// app/admin/tunings/components/tunings-table.tsx
"use client";

import { Tuning } from "@prisma/client"; // Предполагаем, что Prisma генерирует тип Tuning
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
	Music3,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search as SearchIcon,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { deleteTuning } from "@/app/admin/tunings/actions";

interface TuningsTableProps {
	tunings: Tuning[];
	itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

interface TuningToDelete {
	id: number;
	name: string;
}

export function TuningsTable({ tunings: initialTunings, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }: TuningsTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, initialTunings]);

	const filteredTunings = useMemo(() => {
		if (!searchTerm.trim()) {
			return initialTunings;
		}
		return initialTunings.filter(
			(tuning) =>
				tuning.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				tuning.notes.join(",").toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [initialTunings, searchTerm]);

	const totalPages = Math.ceil(filteredTunings.length / itemsPerPage);

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		} else if (totalPages === 0 && initialTunings.length > 0) {
			setCurrentPage(1);
		} else if (currentPage === 0 && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [totalPages, currentPage, initialTunings.length]);

	const paginatedTunings = useMemo(() => {
		if (totalPages === 0) return [];
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredTunings.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredTunings, currentPage, itemsPerPage, totalPages]);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		} else if (totalPages === 0 && newPage === 1) {
			setCurrentPage(1);
		}
	};

	const handleDeleteTuning = async (tuning: TuningToDelete) => {
		if (!tuning) return;

		toast.promise(deleteTuning(tuning.id), {
			// Используем числовой ID
			loading: "Удаление строя...",
			success: (result) => {
				if (result.success) {
					return `Тюнинг "${tuning.name}" успешно удален.`;
				} else {
					throw new Error(result.error || "Не удалось удалить строй.");
				}
			},
			error: (error) => {
				return error.message || "Произошла ошибка при удалении.";
			},
		});
	};

	const startItemIndex = paginatedTunings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endItemIndex = paginatedTunings.length > 0 ? Math.min(currentPage * itemsPerPage, filteredTunings.length) : 0;

	return (
		<div className="space-y-4">
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Поиск по названию или нотам..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-sm pl-10"
				/>
			</div>
			{initialTunings.length === 0 && !searchTerm && (
				<p className="text-center text-muted-foreground py-4">
					Пока нет ни одного строя.
					<Link href="/admin/tunings/new" className="text-primary hover:underline">
						Добавить новый?
					</Link>
				</p>
			)}

			{filteredTunings.length > 0 ? (
				<>
					<div className="rounded-md border overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50 hover:bg-muted/60">
									<TableHead className="w-[40%] min-w-[150px] px-4 py-3">Название</TableHead>
									<TableHead className="w-[40%] min-w-[200px] px-4 py-3">Ноты строя</TableHead>
									<TableHead className="w-[20%] text-right px-4 py-3">Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="divide-y">
								{paginatedTunings.map((tuning) => (
									<TableRow key={tuning.id} className="hover:bg-muted/30">
										<TableCell className="font-medium px-4 py-3">
											<div className="flex items-center">
												<Music3 className="h-4 w-4 mr-2 text-muted-foreground hidden sm:inline-block" />
												{tuning.name}
											</div>
										</TableCell>
										<TableCell className="px-4 py-3">
											<div className="flex flex-wrap gap-1">
												{tuning.notes.map((note, index) => (
													<Badge key={index} variant="secondary" className="font-mono">
														{note}
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell className="text-right px-4 py-3">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<span className="sr-only">Открыть меню</span>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Действия</DropdownMenuLabel>
													<DropdownMenuItem asChild>
														<Link href={`/admin/tunings/${tuning.id}`} className="cursor-pointer">
															<Pencil className="mr-2 h-4 w-4" />
															Редактировать
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDeleteTuning({ id: tuning.id, name: tuning.name })}
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
								<span className="font-medium">{filteredTunings.length}</span> тюнингов
							</div>
							<div className="flex items-center space-x-1">
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(1)}
									disabled={currentPage === 1}
									title="Первая"
								>
									<ChevronsLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									title="Назад"
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
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handlePageChange(totalPages)}
									disabled={currentPage === totalPages}
									title="Последняя"
								>
									<ChevronsRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</>
			) : (
				searchTerm &&
				initialTunings.length > 0 && <p className="text-center text-muted-foreground py-4">Поиск не дал результатов.</p>
			)}
		</div>
	);
}
