// app/admin/tunings/components/tuning-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TuningFormInput, TuningFormSchema, ServerActionError } from "@/schemas/tuning";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Music3 } from "lucide-react"; // Иконки

interface TuningFormProps {
	defaultValues?: TuningFormInput;
	onSubmit: (data: TuningFormInput) => Promise<{ success: boolean; error?: ServerActionError | string }>;
	isEditing?: boolean;
	formTitle?: string;
	formDescription?: string;
}

export function TuningForm({
	defaultValues,
	onSubmit,
	isEditing = false,
	formTitle,
	formDescription,
}: TuningFormProps) {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null); 

	const form = useForm<TuningFormInput>({
		resolver: zodResolver(TuningFormSchema),
		defaultValues: defaultValues || { name: "", notes: "" },
	});

	async function handleSubmit(values: TuningFormInput) {
		setServerError(null); // Сбрасываем общую ошибку перед отправкой

		toast.promise(onSubmit(values), {
			loading: isEditing ? "Сохранение тюнинга..." : "Создание тюнинга...",
			success: (result) => {
				if (result.success) {
					router.push("/admin/tunings");
					router.refresh();
					return isEditing ? "Тюнинг успешно обновлен!" : "Тюнинг успешно создан!";
				} else {
					throw result.error || new Error("Неизвестная ошибка при сохранении тюнинга.");
				}
			},
			error: (error) => {
				let errorMessage = "Произошла ошибка.";
				if (typeof error === "string") {
					errorMessage = error;
					setServerError(errorMessage);
				} else if (error && typeof error === "object") {
					const err = error as ServerActionError;
					if (err.formErrors?.length) {
						errorMessage = err.formErrors.join(", ");
						setServerError(errorMessage);
					}
					if (err.fieldErrors) {
						Object.entries(err.fieldErrors).forEach(([fieldName, fieldErrors]) => {
							const message = Array.isArray(fieldErrors) ? fieldErrors.join(", ") : String(fieldErrors);
							form.setError(fieldName as keyof TuningFormInput, { type: "server", message });
						});
						if (!err.formErrors?.length) errorMessage = "Обнаружены ошибки в полях формы.";
					} else if (err.message && !err.formErrors?.length) {
						errorMessage = err.message;
						setServerError(errorMessage);
					}
				} else if (error instanceof Error) {
					errorMessage = error.message;
					setServerError(errorMessage);
				}
				return errorMessage;
			},
		});
	}

	return (
		<Card className="w-full max-w-lg mx-auto">
			{(formTitle || formDescription) && (
				<CardHeader>
					{formTitle && (
						<CardTitle className="flex items-center gap-2">
							<Music3 className="h-6 w-6" /> {formTitle}
						</CardTitle>
					)}
					{formDescription && <CardDescription>{formDescription}</CardDescription>}
				</CardHeader>
			)}
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						{serverError && (
							<div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
								{serverError}
							</div>
						)}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Название тюнинга</FormLabel>
									<FormControl>
										<Input placeholder="Например: E Стандартный, Drop D, Open G" {...field} />
									</FormControl>
									<FormDescription>Уникальное и понятное название для этого гитарного строя.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ноты строя</FormLabel>
									<FormControl>
										<Input placeholder="Например: E,A,D,G,B,E" {...field} />
									</FormControl>
									<FormDescription>
										Перечислите ноты через запятую, начиная с самой толстой (низкой) струны.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-8 px-0 gap-2">
							<Button type="button" variant="outline" onClick={() => router.back()}>
								<X className="mr-2 h-4 w-4" />
								Отмена
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting || (!form.formState.isValid && form.formState.isSubmitted)}
							>
								<Save className="mr-2 h-4 w-4" />
								{form.formState.isSubmitting
									? isEditing
										? "Сохранение..."
										: "Создание..."
									: isEditing
										? "Сохранить тюнинг"
										: "Создать тюнинг"}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
