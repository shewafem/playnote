// components/admin/scale-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScaleFormData, ScaleFormSchema, ServerActionError } from "@/schemas/scale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Music2 } from "lucide-react";

interface ScaleFormProps {
	defaultValues?: ScaleFormData;
	onSubmit: (
		data: ScaleFormData
	) => Promise<{ success: boolean; error?: ServerActionError | string; scaleId?: number }>;
	isEditing?: boolean;
	formTitle: string;
	formDescription: string;
}

export function ScaleForm({ defaultValues, onSubmit, isEditing = false, formTitle, formDescription }: ScaleFormProps) {
	const router = useRouter();
	const [serverErrors, setServerErrors] = useState<{
		formErrors?: string[];
		fieldErrors?: Record<string, string[]>;
	} | null>(null);

	const form = useForm<ScaleFormData>({
		resolver: zodResolver(ScaleFormSchema),
		defaultValues: defaultValues || {
			name: "",
			formula: "",
		},
		mode: "onChange",
	});

	async function handleSubmit(values: ScaleFormData) {
		setServerErrors(null);

		toast.promise(onSubmit(values), {
			loading: isEditing ? "Сохранение гаммы..." : "Создание гаммы...",
			success: (result) => {
				if (result.success) {
					router.push("/admin/scales");
					router.refresh();
					return isEditing ? "Гамма успешно обновлена!" : "Гамма успешно создана!";
				} else {
					throw result.error || new Error("Неизвестная ошибка.");
				}
			},
			error: (error) => {
				let errorMessage = "Произошла ошибка.";
				if (typeof error === "object" && error !== null) {
					const errorObj = error as ServerActionError;

					if (errorObj.formErrors?.length) {
						errorMessage = errorObj.formErrors.join(", ");
					} else if (errorObj.fieldErrors) {
						Object.entries(errorObj.fieldErrors).forEach(([field, messages]) => {
							form.setError(field as keyof ScaleFormData, { type: "server", message: messages.join(", ") });
						});

						errorMessage = "Пожалуйста, исправьте ошибки в форме.";

					} else if (typeof errorObj === "string") {
						errorMessage = errorObj;
					}

					setServerErrors({ formErrors: errorObj.formErrors });
				} else if (typeof error === "string") {
          
					errorMessage = error;
				}

				return errorMessage;
			},
		});
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Music2 className="h-6 w-6" /> {formTitle}
				</CardTitle>
				<CardDescription>{formDescription}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
						{serverErrors?.formErrors && (
							<div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
								{serverErrors.formErrors.join(", ")}
							</div>
						)}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Название гаммы</FormLabel>
									<FormControl>
										<Input placeholder="Мажорный, Минорный, Пентатоника..." {...field} />
									</FormControl>
									<FormDescription>Уникальное название для этой гаммы.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="formula"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Формула гаммы (интервалы)</FormLabel>
									<FormControl>
										<Input placeholder="0,2,4,5,7,9,11" {...field} />
									</FormControl>
									<FormDescription>
										Введите интервалы в соответствии с целочисленной нотацией. Например, для мажорной гаммы: 0,2,4,5,7,9,11
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
							<Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
								<Save className="mr-2 h-4 w-4" />
								{form.formState.isSubmitting
									? isEditing
										? "Сохранение..."
										: "Создание..."
									: isEditing
										? "Сохранить гамму"
										: "Создать гамму"}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
