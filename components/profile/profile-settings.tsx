"use client";
import type React from "react";
import { useState, useEffect } from "react"; 
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
	ProfileInfoSchema,
	type ProfileInfoFormValues,
	UpdatePasswordSchema,
	type UpdatePasswordFormValues,
} from "@/schemas/auth-schema";

const FieldError: React.FC<{ message?: string }> = ({ message }) => {
	if (!message) return null;
	return <p className="text-sm text-red-500 mt-1">{message}</p>;
};

const MOCK_USER_DATA = {
	email: "ivan.ivanov@example.com",
	name: "Ivan Ivanov",
};

export default function ProfileSettings() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100");

	// TODO: Fetch actual user data and profile image URL
	// For example:
	// const { data: user, isLoading: isUserLoading } = useCurrentUser();
	// useEffect(() => {
	//   if (user) {
	//     personalInfoForm.reset({ email: user.email, name: user.name || "" });
	//     if(user.image) setProfileImage(user.image);
	//   }
	// }, [user, personalInfoForm]);

	const personalInfoForm = useForm<ProfileInfoFormValues>({
		resolver: zodResolver(ProfileInfoSchema),
		defaultValues: {
			email: MOCK_USER_DATA.email,
			name: MOCK_USER_DATA.name,
		},
	});

	// React Hook Form for Password Update
	const passwordUpdateForm = useForm<UpdatePasswordFormValues>({
		resolver: zodResolver(UpdatePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 1024 * 1024) {
				toast.error("Файл слишком большой. Максимум 1МБ.");
				return;
			}
			if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
				toast.error("Неверный тип файла. Только JPG, PNG, GIF.");
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target?.result as string);
				// Here you would typically call an API to upload the image
				// e.g., uploadProfileImage(file).then(() => toast.success("Фото профиля успешно обновлено"));
				toast.success("Фото профиля успешно обновлено (превью).");
			};
			reader.readAsDataURL(file);
		}
	};

	const onPersonalInfoSubmit: SubmitHandler<ProfileInfoFormValues> = async (data) => {
		console.log("Personal Info Data:", data);
		// TODO: API call to update personal information
		// await updateProfileApi(data);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		toast.success("Личная информация успешно сохранена");
	};

	const onPasswordUpdateSubmit: SubmitHandler<UpdatePasswordFormValues> = async (data) => {
		console.log("Password Update Data:", data);
		// TODO: API call to update password
		// await updatePasswordApi({ currentPassword: data.currentPassword, newPassword: data.newPassword });
		await new Promise((resolve) => setTimeout(resolve, 1000));
		toast.success("Пароль успешно обновлен");
		passwordUpdateForm.reset();
	};

	useEffect(() => {
		// Replace MOCK_USER_DATA with your actual fetched user data
		// if (fetchedUserData) {
		//   personalInfoForm.reset({
		//     email: fetchedUserData.email || "",
		//     name: fetchedUserData.name || "",
		//   });
		//   if (fetchedUserData.image) {
		//     setProfileImage(fetchedUserData.image);
		//   }
		// }
	}, [/* fetchedUserData, */ personalInfoForm.reset]);

	return (
		<div className="container mx-auto max-w-4xl p-6 space-y-8">
			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Фото профиля</CardTitle>
						<CardDescription>Это фото будет отображаться в вашем профиле.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center gap-6">
							<Avatar className="h-24 w-24">
								<AvatarImage src={profileImage || "/placeholder.svg"} alt="Фото профиля" />
								<AvatarFallback className="text-lg">
									{MOCK_USER_DATA.name
										?.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase() || "🧑"}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-2">
								<Label htmlFor="photo-upload" className="cursor-pointer">
									<Button variant="outline" className="gap-2" asChild>
										<span>
											<Camera className="h-4 w-4" />
											Изменить фото
										</span>
									</Button>
								</Label>
								<Input
									id="photo-upload"
									type="file"
									accept="image/png, image/jpeg, image/gif"
									className="hidden"
									onChange={handleImageUpload}
								/>
								<p className="text-sm text-muted-foreground">JPG или PNG. Максимум 1МБ.</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Личная информация</CardTitle>
						<CardDescription>Обновите ваши личные данные здесь.</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
							<div className="space-y-4">
								<div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
									<Label htmlFor="email-personal" className="sm:w-1/3 mb-1 sm:mb-0 sm:pt-2">
										Адрес электронной почты
									</Label>
									<div className="flex-1">
										<Input
											id="email-personal"
                      className="text-sm"
											type="email"
											placeholder="ivan.ivanov@example.com"
											{...personalInfoForm.register("email")}
										/>
										<FieldError message={personalInfoForm.formState.errors.email?.message} />
										<p className="text-sm text-muted-foreground mt-2">
											Этот email будет использоваться для уведомлений аккаунта.
										</p>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
									<Label htmlFor="name-personal" className="sm:w-1/3 mb-1 sm:mb-0 sm:pt-2">
										Имя пользователя
									</Label>
									<div className="flex-1">
										<Input id="name-personal" className="text-sm" placeholder="Иван Иванов" {...personalInfoForm.register("name")} />
										<FieldError message={personalInfoForm.formState.errors.name?.message} />
										<p className="text-sm text-muted-foreground mt-2">Это ваше публичное отображаемое имя.</p>
									</div>
								</div>
							</div>
							<div className="flex justify-center mt-6">
								<Button type="submit" className="gap-2 cursor-pointer" disabled={personalInfoForm.formState.isSubmitting}>
									{personalInfoForm.formState.isSubmitting ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Save className="h-4 w-4" />
									)}
									{personalInfoForm.formState.isSubmitting ? "Сохранение..." : "Сохранить изменения"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Сменить пароль</CardTitle>
						<CardDescription>Обновите ваш пароль, чтобы обеспечить безопасность аккаунта.</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={passwordUpdateForm.handleSubmit(onPasswordUpdateSubmit)} className="space-y-6">
							<div className="space-y-4">
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<Label htmlFor="current-password" className="sm:w-1/3 mb-1 sm:mb-0">
										Текущий пароль
									</Label>
									<div className="relative flex-1">
										<Input
                    className="text-sm"
											id="current-password"
											type={showCurrentPassword ? "text" : "password"}
											placeholder="Введите текущий пароль"
											{...passwordUpdateForm.register("currentPassword")}
										/>
										<FieldError message={passwordUpdateForm.formState.errors.currentPassword?.message} />
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowCurrentPassword(!showCurrentPassword)}
											aria-label={showCurrentPassword ? "Скрыть текущий пароль" : "Показать текущий пароль"}
										>
											{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</Button>
									</div>
								</div>
								<Separator />
								<div className="space-y-4">
									<div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
										<Label htmlFor="new-password" className="sm:w-1/3 mb-1 sm:mb-0">
											Новый пароль
										</Label>
										<div className="relative flex-1">
											<Input
                      className="text-sm"
												id="new-password"
												type={showNewPassword ? "text" : "password"}
												placeholder="Введите новый пароль"
												{...passwordUpdateForm.register("newPassword")}
											/>
											<FieldError message={passwordUpdateForm.formState.errors.newPassword?.message} />
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowNewPassword(!showNewPassword)}
												aria-label={showNewPassword ? "Скрыть новый пароль" : "Показать новый пароль"}
											>
												{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</Button>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
										<Label htmlFor="confirm-new-password" className="sm:w-1/3 mb-1 sm:mb-0">
											Подтвердите новый пароль
										</Label>
										<div className="relative flex-1">
											<Input
                        className="text-sm"
												id="confirm-new-password"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Подтвердите новый пароль"
												{...passwordUpdateForm.register("confirmNewPassword")}
											/>
											<FieldError message={passwordUpdateForm.formState.errors.confirmNewPassword?.message} />
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												aria-label={
													showConfirmPassword
														? "Скрыть подтверждение нового пароля"
														: "Показать подтверждение нового пароля"
												}
											>
												{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</Button>
										</div>
									</div>
								</div>
							</div>
							<div className="flex justify-center">
								<Button type="submit" className="gap-2 cursor-pointer" disabled={passwordUpdateForm.formState.isSubmitting}>
									{passwordUpdateForm.formState.isSubmitting ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Save className="h-4 w-4" />
									)}
									{passwordUpdateForm.formState.isSubmitting ? "Обновление..." : "Обновить пароль"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
