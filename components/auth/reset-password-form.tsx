//"use client";

//import { useState, useTransition, Suspense } from "react";
//import { useForm } from "react-hook-form";
//import { zodResolver } from "@hookform/resolvers/zod";
//import { ResetPasswordSchema, ResetPasswordFormValues } from "@/schemas/auth-schema";
//import { resetPassword } from "@/actions/reset-password"; 
//import { useSearchParams, useRouter } from "next/navigation";
//import Link from "next/link";

//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
//function ResetPasswordFormComponent() {
//	const router = useRouter();
//	const searchParams = useSearchParams();
//	const token = searchParams.get("token");

//	const [isPending, startTransition] = useTransition();
//	const [error, setError] = useState<string | null>(null);
//	const [success, setSuccess] = useState<string | null>(null);

//	const form = useForm<ResetPasswordFormValues>({
//		resolver: zodResolver(ResetPasswordSchema),
//		defaultValues: {
//			password: "",
//			confirmPassword: "",
//			token: token || "",
//		},
//	});

//	if (token && form.getValues("token") !== token) {
//		form.setValue("token", token);
//	}

//	const onSubmit = (values: ResetPasswordFormValues) => {
//		setError(null);
//		setSuccess(null);

//		if (!token) {
//			setError("Токен для сброса пароля отсутствует или недействителен.");
//			return;
//		}
//		const submissionValues = { ...values, token };

//		startTransition(async () => {
//			const result = await resetPassword(submissionValues);
//			if (result.error) {
//				setError(result.error);
//			}
//			if (result.success) {
//				setSuccess(result.success);
//				form.reset();
//				setTimeout(() => {
//					router.push("/sign-in");
//				}, 3000);
//			}
//		});
//	};

//	if (!token && !success) {
//		return (
//			<Card>
//				<CardHeader>
//					<CardTitle className="text-xl">Ошибка сброса пароля</CardTitle>
//				</CardHeader>
//				<CardContent>
//					<p className="text-red-500">
//						Отсутствует токен для сброса пароля. Пожалуйста, запросите новую ссылку для сброса.
//					</p>
//					<Button asChild className="mt-4 w-full">
//						<Link href="/forgot-password">Запросить новую ссылку</Link>
//					</Button>
//				</CardContent>
//			</Card>
//		);
//	}

//	return (
//		<Card>
//			<CardHeader>
//				<CardTitle className="text-xl">Установите новый пароль</CardTitle>
//			</CardHeader>
//			<CardContent>
//				<Form {...form}>
//					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//						<input type="hidden" {...form.register("token")} />
//						<FormField
//							control={form.control}
//							name="password"
//							render={({ field }) => (
//								<FormItem>
//									<FormLabel>Новый пароль</FormLabel>
//									<FormControl>
//										<Input {...field} type="password" placeholder="******" disabled={isPending} />
//									</FormControl>
//									<FormMessage />
//								</FormItem>
//							)}
//						/>
//						<FormField
//							control={form.control}
//							name="confirmPassword"
//							render={({ field }) => (
//								<FormItem>
//									<FormLabel>Подтвердите новый пароль</FormLabel>
//									<FormControl>
//										<Input {...field} type="password" placeholder="******" disabled={isPending} />
//									</FormControl>
//									<FormMessage />
//								</FormItem>
//							)}
//						/>

//						{error && <p className="text-sm text-red-500 text-center bg-red-500/10 p-3 rounded-md">{error}</p>}
//						{success && (
//							<div className="space-y-3">
//								<p className="text-sm text-green-500 text-center bg-green-500/10 p-3 rounded-md">{success}</p>
//								<Button asChild className="w-full">
//									<Link href="/login">Перейти ко входу</Link>
//								</Button>
//							</div>
//						)}

//						{!success && (
//							<Button type="submit" className="w-full" disabled={isPending}>
//								{isPending ? "Изменение..." : "Изменить пароль"}
//							</Button>
//						)}
//					</form>
//				</Form>
//			</CardContent>
//		</Card>
//	);
//}

//export default function ResetPasswordForm() {
//	return (
//		<Suspense fallback={<div>Загрузка токена...</div>}>
//			<ResetPasswordFormComponent />
//		</Suspense>
//	);
//}
