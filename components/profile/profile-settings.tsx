"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Loader2 } from "lucide-react"; //Eye, EyeOff,
import { toast } from "sonner";

import {
	ProfileInfoSchema,
	type ProfileInfoFormValues,
	//UpdatePasswordSchema,
	//type UpdatePasswordFormValues,
} from "@/schemas/auth-schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { useSession } from "next-auth/react";

const FieldError: React.FC<{ message?: string }> = ({ message }) => {
	if (!message) return null;
	return <p className="text-sm text-red-500 mt-1">{message}</p>;
};

export default function ProfileSettings({ hasAccount }: { hasAccount: boolean }) {
	const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=100&width=100");
	const [isLoading, setIsLoading] = useState(true);
	const { update } = useSession();
  const router = useRouter()

	const [file, setFile] = useState<File>();
	const [uploading, setUploading] = useState(false);
	useEffect(() => {
		async function fetchProfile() {
			setIsLoading(true);
			try {
				const res = await fetch("/api/profile");
				if (!res.ok) throw new Error("Ошибка загрузки профиля");
				const user = await res.json();
				personalInfoForm.reset({ email: user.email, name: user.name || "" });
				setProfileImage(user.image || "/placeholder.svg?height=100&width=100");
			} catch {
				toast.error("Не удалось загрузить профиль");
			} finally {
				setIsLoading(false);
			}
		}
		fetchProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const personalInfoForm = useForm<ProfileInfoFormValues>({
		resolver: zodResolver(ProfileInfoSchema),
		defaultValues: {
			email: "",
			name: "",
		},
	});


	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.[0]) {
			if (event.target.files?.[0].size > 1024 * 1024) {
				toast.error("Файл слишком большой. Максимум 1МБ.");
				return;
			}
			if (!["image/jpeg", "image/png", "image/gif"].includes(event.target.files?.[0].type)) {
				toast.error("Неверный тип файла. Только JPG, PNG, GIF.");
				return;
			}
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target?.result as string);
			};
			reader.readAsDataURL(event.target.files?.[0]);
			setFile(event.target.files?.[0]);
		}
	};

	const uploadFile = async () => {
		try {
			if (!file) {
				toast.error("Файл не выбран");
				return;
			}
			setUploading(true);
			const data = new FormData();
			data.set("file", file);
			const uploadRequest = await fetch("/api/files", {
				method: "POST",
				body: data,
			});
			const signedUrl = await uploadRequest.json();
			update({ image: signedUrl });
			setUploading(false);
			toast.success("Фото успешно обновлено!");
      router.refresh()
		} catch (e) {
			console.log(e);
			setUploading(false);
			toast.success("Ошибка загрузки файла");
		}
	};

	const onPersonalInfoSubmit: SubmitHandler<ProfileInfoFormValues> = async (data) => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Ошибка обновления профиля");
			const updated = await res.json();
			update({ name: updated.name, email: updated.email });
			toast.success("Личная информация успешно сохранена");
      router.refresh()
			personalInfoForm.reset({ email: updated.email, name: updated.name });
      
		} catch {
			toast.error("Не удалось обновить профиль");
		} finally {
			setIsLoading(false);
		}
	};


	return (
		<div className="w-fit mx-auto max-w-4xl space-y-8">
			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Фото профиля</CardTitle>
						<CardDescription>Это фото будет отображаться в вашем профиле.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center gap-6">
							<Avatar className="h-24 w-24">
								<AvatarImage className="object-cover" src={profileImage || "/placeholder.svg"} alt="Фото профиля" />
								<AvatarFallback className="text-lg">
									{personalInfoForm
										.watch("name")
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
											Загрузить фото
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
								<p className="text-muted-foreground text-xs sm:text-sm">JPG или PNG. Максимум 1МБ.</p>
								<Button className="cursor-pointer" disabled={uploading} onClick={uploadFile}>
									{uploading ? "Сохраняем..." : "Сохранить"}
								</Button>
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
											type="email"
											disabled={hasAccount}
											placeholder="ivan.ivanov@example.com"
											className="text-xs sm:text-base"
											{...personalInfoForm.register("email")}
										/>
										<FieldError message={personalInfoForm.formState.errors.email?.message} />
										{hasAccount ? (
											<p className="text-sm text-muted-foreground mt-2">У вас подключен аккаунт Google</p>
										) : (
											<p className="text-sm text-muted-foreground mt-2">
												Этот email будет использоваться для уведомлений аккаунта.
											</p>
										)}
									</div>
								</div>
								<div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
									<Label htmlFor="name-personal" className="sm:w-1/3 mb-1 sm:mb-0 sm:pt-2">
										Имя пользователя
									</Label>
									<div className="flex-1">
										<Input
											id="name-personal"
											className="text-xs sm:text-base"
											placeholder="Иван Иванов"
											{...personalInfoForm.register("name")}
										/>
										<FieldError message={personalInfoForm.formState.errors.name?.message} />
										<p className="text-sm text-muted-foreground mt-2">Это ваше публичное отображаемое имя.</p>
									</div>
								</div>
							</div>
							<div className="flex justify-center mt-6">
								<Button
									type="submit"
									className="gap-2 cursor-pointer"
									disabled={personalInfoForm.formState.isSubmitting || isLoading}
								>
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
			</div>
		</div>
	);
}
