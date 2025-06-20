"use client";

import { Arpeggio } from "@prisma/client";
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
import { deleteArpeggio } from "@/app/admin/arpeggios/actions";

interface ArpeggiosTableProps {
	arpeggios: Arpeggio[];
	itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export function ArpeggiosTable({ arpeggios: initialArpeggios, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }: ArpeggiosTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, initialArpeggios]);

	const filteredArpeggios = useMemo(() => {
		if (!searchTerm.trim()) {
			return initialArpeggios;
		}
		return initialArpeggios.filter(
			(arpeggio) =>
				arpeggio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				arpeggio.formula.join(", ").includes(searchTerm.toLowerCase())
		);
	}, [initialArpeggios, searchTerm]);

	const totalPages = Math.ceil(filteredArpeggios.length / itemsPerPage);

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		} else if (totalPages === 0 && initialArpeggios.length > 0) {
			setCurrentPage(1);
		} else if (currentPage === 0 && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [totalPages, currentPage, initialArpeggios.length]);
	
	const paginatedArpeggios = useMemo(() => {
		if (totalPages === 0) return [];
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredArpeggios.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredArpeggios, currentPage, itemsPerPage, totalPages]);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleDeleteArpeggio = async (arpeggio: { id: number; name: string }) => {
		toast.promise(deleteArpeggio(arpeggio.id), {
			loading: "Удаление арпеджио...",
			success: (result) => {
				if (result.success) {
					return `Арпеджио "${arpeggio.name}" успешно удалено.`;
				} else {
					throw new Error(result.error || "Не удалось удалить арпеджио.");
				}
			},
			error: (error) => error.message || "Произошла ошибка при удалении.",
		});
	};

	const startItemIndex = paginatedArpeggios.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endItemIndex = paginatedArpeggios.length > 0 ? Math.min(currentPage * itemsPerPage, filteredArpeggios.length) : 0;

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
			{initialArpeggios.length === 0 && !searchTerm && (
				<p className="text-center text-muted-foreground py-4">
					Пока нет ни одного арпеджио.{" "}
					<Link href="/admin/arpeggios/add" className="text-primary hover:underline">
						Добавить новое?
					</Link>
				</p>
			)}

			{filteredArpeggios.length > 0 ? (
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
								{paginatedArpeggios.map((arpeggio) => (
									<TableRow key={arpeggio.id} className="hover:bg-muted/30">
										<TableCell className="font-medium">
											<div className="flex items-center">
												<Music2 className="h-4 w-4 mr-2 text-muted-foreground hidden sm:inline-block" />
												{arpeggio.name}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{arpeggio.formula.map((step, index) => (
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
														<Link href={`/admin/arpeggios/${arpeggio.id}`} className="cursor-pointer">
															<Pencil className="mr-2 h-4 w-4" />
															Редактировать
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDeleteArpeggio({ id: arpeggio.id, name: arpeggio.name })}
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
								<span className="font-medium">{filteredArpeggios.length}</span> арпеджио
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
				initialArpeggios.length > 0 && <p className="text-center text-muted-foreground py-4">Поиск не дал результатов.</p>
			)}
		</div>
	);
}