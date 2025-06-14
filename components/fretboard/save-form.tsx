"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { FretboardConfiguration, FretboardConfigurationSchema } from "@/schemas/fretboard-configarion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveFretboardConfigurationAction } from "@/actions/configuration";
import { toast } from "sonner";
import Link from "next/link";
import { useFretboardStore } from "@/lib/fretboard-store";

interface SaveFormProps {
	config: string;
	//imgUrl: string;
}

export default function SaveForm({ config }: SaveFormProps) {
  const imgUrl = useFretboardStore((s) => s.imgUrl);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FretboardConfiguration>({
		resolver: zodResolver(FretboardConfigurationSchema),
		defaultValues: {
			name: "Моя схема",
			configuration: config,
			imageData: imgUrl,
		},
	});

	useEffect(() => {
		reset({
			name: "Моя схема",
			configuration: config,
			imageData: imgUrl,
		});
	}, [config, imgUrl, reset]);

	const onSubmit = async (data: FretboardConfiguration) => {
		setServerError(null);
		const result = await saveFretboardConfigurationAction(data);
		if (result.success) {
			toast.success(<Link href="/profile/fretboards">{result.message} Нажмите здесь, чтобы перейти в профиль</Link>);
			setIsDialogOpen(false);
			reset({ name: "Моя схема", configuration: config, imageData: imgUrl });
		} else {
			setServerError(result.error || "Произошла неизвестная ошибка.");
			if (result.issues) {
				console.error("Ошибки валидации:", result.issues);
			}
			toast.error(result.error || "Ошибка при сохранении.");
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer">
					Сохранить схему в профиль <Save className="ml-2 h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Сохранение схемы</DialogTitle>
						<DialogDescription>Укажите название своей схемы. Схема будет сохранена в вашем профиле.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Название
							</Label>
							<div className="col-span-3">
								<Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
								{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
							</div>
						</div>
						<Input type="hidden" {...register("configuration")} />
						{errors.configuration && <p className="text-xs text-red-500 mt-1">{errors.configuration.message}</p>}
						<Input type="hidden" {...register("imageData")} />
						{errors.imageData && <p className="text-xs text-red-500 mt-1">{errors.imageData.message}</p>}
						{serverError && <p className="text-sm text-red-500 col-span-4 text-center">{serverError}</p>}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline" className="cursor-pointer">
								Отмена
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isSubmitting || imgUrl === ""} className="cursor-pointer">
              {imgUrl === "" ? "Создается изображение..." : isSubmitting ? "Сохранение..." : "Сохранить"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
