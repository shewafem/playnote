"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	TuningFormInput,
	TuningFormShape,
	TuningFormShapeSchema,
	ServerActionError,
	formatFieldArrayToNotesString,
	SingleNoteField,
} from "@/schemas/tuning";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Music3, PlusCircle, Trash2 } from "lucide-react";

const MUSICAL_NOTES = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];
const OCTAVES = ["6", "5", "4", "3", "2", "1"];

interface TuningFormProps {
	defaultValues?: TuningFormShape;
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

	const form = useForm<TuningFormShape>({
		resolver: zodResolver(TuningFormShapeSchema),
		defaultValues: defaultValues || {
			name: "",
			notes: [
				{ note: "E", octave: "4" },
				{ note: "A", octave: "4" },
				{ note: "D", octave: "3" },
				{ note: "G", octave: "3" },
				{ note: "B", octave: "3" },
				{ note: "E", octave: "2" },
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "notes",
	});

	async function handleSubmit(values: TuningFormShape) {
		setServerError(null);
		const submissionData: TuningFormInput = {
			name: values.name,
			notes: formatFieldArrayToNotesString(values.notes),
		};

		toast.promise(onSubmit(submissionData), {
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
							if (fieldName === "notes" && Array.isArray(fieldErrors)) {
								// Handle errors for individual notes in the array
								fieldErrors.forEach((noteError, index) => {
									if (typeof noteError === "object" && noteError !== null) {
										Object.entries(noteError).forEach(([noteField, noteFieldErrors]) => {
											if (Array.isArray(noteFieldErrors) && noteFieldErrors.length > 0) {
												form.setError(`notes.${index}.${noteField as keyof SingleNoteField}`, {
													type: "server",
													message: noteFieldErrors.join(", "),
												});
											}
										});
									}
								});
								if (!err.formErrors?.length && !errorMessage.startsWith("Обнаружены ошибки"))
									errorMessage = "Обнаружены ошибки в нотах.";
							} else if (
								typeof fieldErrors === "string" ||
								(Array.isArray(fieldErrors) && typeof fieldErrors[0] === "string")
							) {
								const message = Array.isArray(fieldErrors) ? fieldErrors.join(", ") : String(fieldErrors);
								form.setError(fieldName as keyof TuningFormShape, { type: "server", message }); // Adjust fieldName type
								if (!err.formErrors?.length && !errorMessage.startsWith("Обнаружены ошибки"))
									errorMessage = "Обнаружены ошибки в полях формы.";
							}
						});
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
		<Card className="w-full max-w-2xl mx-auto">
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
									<FormLabel>Название строя</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>Уникальное название для этого гитарного строя.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-y-4">
							<FormLabel>Струны (от самой толстой/низкой к самой тонкой/высокой)</FormLabel>
							{fields.map((item, index) => (
								<div key={item.id} className="flex items-end gap-2 p-3 border rounded-md relative">
									<span className="absolute top-1 left-2 text-xs text-muted-foreground">Струна {index + 1}</span>
									<FormField
										control={form.control}
										name={`notes.${index}.note`}
										render={({ field }) => (
											<FormItem className="flex-1 mt-3">
												<FormLabel>Нота</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Нота" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{MUSICAL_NOTES.map((note) => (
															<SelectItem key={note} value={note}>
																{note}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`notes.${index}.octave`}
										render={({ field }) => (
											<FormItem className="flex-1 mt-3">
												<FormLabel>Октава</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Октава" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{OCTAVES.map((octave) => (
															<SelectItem key={octave} value={octave}>
																{octave}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() =>
											fields.length > 1 ? remove(index) : toast.error("Должна быть хотя бы одна струна.")
										}
										disabled={fields.length <= 1}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
							{form.formState.errors.notes && typeof form.formState.errors.notes.message === "string" && (
								<p className="text-sm font-medium text-destructive">{form.formState.errors.notes.message}</p>
							)}
							<Button
								type="button"
								variant="outline"
								onClick={() => append({ note: "E", octave: "2" })} 
							>
								<PlusCircle className="mr-2 h-4 w-4" />
								Добавить струну
							</Button>
						</div>

						<CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-8 px-0 gap-2">
							<Button type="button" variant="outline" onClick={() => router.back()}>
								<X className="mr-2 h-4 w-4" />
								Отмена
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting || (!form.formState.isSubmitted && !form.formState.isValid)}
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
