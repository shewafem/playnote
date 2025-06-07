/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/users/components/user-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { CreateUserSchema, UpdateUserSchema, UserFormData } from "@/schemas/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Save, X } from "lucide-react";

interface UserFormProps {
	defaultValues?: Partial<UserFormData>;
	onSubmit: (data: UserFormData) => Promise<{ success: boolean; error?: any }>;
	isEditing?: boolean;
	formTitle?: string;
	formDescription?: string;
  hasAccount ?: boolean;
  isAdmin ?: boolean;
}

const formSchema = (isEditing?: boolean) => (isEditing ? UpdateUserSchema : CreateUserSchema);

export function UserForm({ defaultValues, onSubmit, isEditing = false, formTitle, formDescription, hasAccount, isAdmin}: UserFormProps) {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ruRoles = {
    STUDENT: "Студент",
    TEACHER: "Преподаватель",
    ADMIN: "Администратор",
  }


	const form = useForm<UserFormData>({
		resolver: zodResolver(formSchema(isEditing)),
		defaultValues: {
			name: defaultValues?.name || "",
			email: defaultValues?.email || "",
			role: defaultValues?.role || UserRole.STUDENT,
			password: "", 
			confirmPassword: "",
		},
	});

	async function handleSubmit(values: UserFormData) {
		setServerError(null);
		const dataToSend = { ...values };
		if (isEditing && !values.password?.trim()) {
			delete (dataToSend as any).password;
			delete (dataToSend as any).confirmPassword;
		}

		toast.promise(onSubmit(dataToSend), {
			loading: isEditing ? "Сохранение пользователя..." : "Создание пользователя...",
			success: (result) => {
				if (result.success) {
					router.push("/admin/users");
					router.refresh();
					return isEditing ? "Пользователь успешно обновлен!" : "Пользователь успешно создан!";
				} else {
					// This will be caught by the error part of toast.promise
					throw result.error || new Error("Неизвестная ошибка");
				}
			},
			error: (error) => {
				let errorMessage = "Произошла ошибка.";
				if (error?.formErrors?.length) {
					errorMessage = error.formErrors.join(", ");
					setServerError(errorMessage);
				}
				if (error?.fieldErrors) {
					for (const [field, errors] of Object.entries(error.fieldErrors as Record<string, string[]>)) {
						form.setError(field as keyof UserFormData, { message: errors.join(", ") });
					}
					if (!error.formErrors?.length) errorMessage = "Обнаружены ошибки в полях формы.";
				} else if (typeof error === "string") {
					errorMessage = error;
					setServerError(errorMessage);
				} else if (error instanceof Error) {
					errorMessage = error.message;
					setServerError(errorMessage);
				}
				return errorMessage;
			},
		});
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			{(formTitle || formDescription) && (
				<CardHeader>
					{formTitle && <CardTitle>{formTitle}</CardTitle>}
					{formDescription && <CardDescription>{formDescription}</CardDescription>}
				</CardHeader>
			)}
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						{serverError && (
							<div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
								{serverError}
							</div>
						)}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Имя</FormLabel>
										<FormControl>
											<Input placeholder="Иван Иванов" {...field} />
										</FormControl>
										<FormDescription>Полное имя пользователя.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input disabled={hasAccount} type="email" placeholder="user@example.com" {...field} />
										</FormControl>
										{hasAccount ? (<FormDescription>У вас подключен аккаунт Google</FormDescription>) : (<FormDescription>Адрес электронной почты</FormDescription>)}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Роль</FormLabel>
									<Select disabled={isAdmin} onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Выберите роль пользователя" />
											</SelectTrigger>
										</FormControl>
										<SelectContent >
											{Object.values(UserRole).map((role) => (
												<SelectItem className="cursor-pointer" key={role} value={role}>
													{ruRoles[role]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{isAdmin ? (<FormDescription>Вы являетесь администратором системы</FormDescription>) : (<FormDescription>Уровень доступа пользователя в системе.</FormDescription>)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<Separator className="my-8" /> {/* Visual separator */}
						<h3 className="text-lg font-medium">{isEditing ? "Изменение пароля (опционально)" : "Установка пароля"}</h3>
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{isEditing ? "Новый пароль" : "Пароль"}</FormLabel>
										<FormControl>
											<div className="relative">
												<Input type={showPassword ? "text" : "password"} placeholder="******" {...field} />
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
													<span className="sr-only">{showPassword ? "Скрыть пароль" : "Показать пароль"}</span>
												</Button>
											</div>
										</FormControl>
										{isEditing && <FormDescription>Оставьте пустым, если не хотите изменять пароль.</FormDescription>}
										<FormMessage />
									</FormItem>
								)}
							/>
							{(form.watch("password") || !isEditing) && (
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Подтвердите пароль</FormLabel>
											<FormControl>
												<div className="relative">
													<Input type={showConfirmPassword ? "text" : "password"} placeholder="******" {...field} />
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													>
														{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
														<span className="sr-only">
															{showConfirmPassword ? "Скрыть подтверждение пароля" : "Показать подтверждение пароля"}
														</span>
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
						<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 gap-2">
							<Button className="cursor-pointer" type="button" variant="outline" onClick={() => router.back()}>
								<X className="mr-2 h-4 w-4" />
								Отмена
							</Button>
							<Button
								type="submit"
                className="cursor-pointer"
								disabled={form.formState.isSubmitting || (!form.formState.isValid && form.formState.isSubmitted)}
							>
								<Save className="mr-2 h-4 w-4" />
								{form.formState.isSubmitting
									? isEditing
										? "Сохранение..."
										: "Создание..."
									: isEditing
										? "Сохранить изменения"
										: "Создать пользователя"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
