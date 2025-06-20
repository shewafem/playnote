"use client";

import { User, UserRole } from "@prisma/client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { deleteUser } from "@/app/admin/users/actions"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, UserCircle2, ShieldCheck, BookUser } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale"; 
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search as SearchIcon } from "lucide-react";

interface UsersTableProps {
	users: User[];
	itemsPerPage?: number;
}

const ruRoles = {
  "ADMIN" : "АДМИН",
  "STUDENT" : "ПОЛЬЗОВАТЕЛЬ",
  "TEACHER" : "УЧИТЕЛЬ"
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export function UsersTable({ users: initialUsers, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }: UsersTableProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredUsers = useMemo(() => {
		if (!searchTerm.trim()) {
			return initialUsers;
		}
		return initialUsers.filter(
			(user) =>
				(user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.role.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [initialUsers, searchTerm]);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredUsers, currentPage, itemsPerPage]);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleDelete = async (userId: string, userName: string | null) => {
		toast.promise(deleteUser(userId), {
			loading: "Удаление пользователя...",
			success: (result) => {
				if (result.success) {
					router.refresh(); // Обновляет данные на странице
					if (paginatedUsers.length === 1 && currentPage > 1) {
						setCurrentPage(currentPage - 1);
					}
					return `Пользователь ${userName || userId} успешно удален.`;
				} else {
					// Это будет обработано как ошибка в toast.promise
					throw new Error(result.error || "Не удалось удалить пользователя.");
				}
			},
			error: (error) => {
				return error.message || "Произошла ошибка при удалении.";
			},
		});
	};

	const getRoleBadgeVariant = (role: UserRole) => {
		switch (role) {
			case UserRole.ADMIN:
				return "default"; // Или "default" с другим цветом
			case UserRole.TEACHER:
				return "outline";
			case UserRole.STUDENT:
				return "outline";
			default:
				return "default";
		}
	};

	const getRoleIcon = (role: UserRole) => {
		switch (role) {
			case UserRole.ADMIN:
				return <ShieldCheck className="mr-2 h-4 w-4" />;
			case UserRole.TEACHER:
				return <BookUser className="mr-2 h-4 w-4 text-blue-500" />;
			case UserRole.STUDENT:
				return <UserCircle2 className="mr-2 h-4 w-4 text-gray-500" />;
			default:
				return null;
		}
	};

	const startItemIndex = (currentPage - 1) * itemsPerPage + 1;
	const endItemIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length);

	return (
		<div className="space-y-4">
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Поиск по имени, email или роли..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-sm pl-10"
				/>
			</div>

			{paginatedUsers.length === 0 && searchTerm && (
				<p className="text-center text-muted-foreground py-4">Пользователи не найдены.</p>
			)}
			{initialUsers.length === 0 && !searchTerm && (
				<p className="text-center text-muted-foreground py-4">
					Пока нет ни одного пользователя.{" "}
					<Link href="/admin/users/new" className="text-primary hover:underline">
						Добавить нового?
					</Link>
				</p>
			)}

			{paginatedUsers.length > 0 && (
				<>
					<div className="rounded-md border overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									<TableHead className="w-[50px] hidden sm:table-cell px-3">
										<span className="sr-only">Аватар</span>
									</TableHead>
									<TableHead className="min-w-[150px] px-3">Пользователь</TableHead>
									<TableHead className="hidden md:table-cell px-3">Роль</TableHead>
									<TableHead className="hidden lg:table-cell px-3">Дата регистрации</TableHead>
									<TableHead className="text-right px-3">Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="divide-y">
								{paginatedUsers.map((user) => (
									<TableRow key={user.id} className="hover:bg-muted/30">
										<TableCell className="hidden sm:table-cell px-3">
											<Avatar className="h-9 w-9">
												<AvatarImage className="object-cover" src={user.image || undefined} alt={user.name || user.email} />
												<AvatarFallback>
													{user.name
														? user.name.substring(0, 2).toUpperCase()
														: user.email.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell className="font-medium px-3 py-3">
											<div className="flex flex-col">
												<span className="font-semibold text-foreground">
													{user.name || <span className="italic text-muted-foreground">Без имени</span>}
												</span>
												<span className="text-xs text-muted-foreground">{user.email}</span>
												{/* Роль для мобильных */}
												<div className="mt-1 md:hidden">
													<Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
														{getRoleIcon(user.role)} {ruRoles[user.role]}
													</Badge>
												</div>
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell px-3">
											<Badge variant={getRoleBadgeVariant(user.role)}>
												{getRoleIcon(user.role)} {ruRoles[user.role]}
											</Badge>
										</TableCell>
										<TableCell className="hidden lg:table-cell text-sm text-muted-foreground px-3">
											{format(new Date(user.createdAt), "dd MMMM yyyy, HH:mm", { locale: ru })}
										</TableCell>
										<TableCell className="text-right px-3">
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
														<Link href={`/admin/users/${user.id}`} className="cursor-pointer">
															<Pencil className="mr-2 h-4 w-4" />
															Редактировать
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDelete(user.id, user.name)}
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
								Показано <span className="font-medium">{filteredUsers.length > 0 ? startItemIndex : 0}</span> -{" "}
								<span className="font-medium">{endItemIndex}</span> из{" "}
								<span className="font-medium">{filteredUsers.length}</span> пользователей
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
			)}
		</div>
	);
}
