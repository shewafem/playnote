"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RegisterSchema, RegistrationFormValues } from "@/schemas/auth-schema"; // Import the RegisterSchema

export default function RegistrationForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegistrationFormValues>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (values: RegistrationFormValues) => {
		setError(null);
		setSuccess(null);

		startTransition(async () => {
			try {
				const response = await fetch("/api/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(values),
				});

				const data = await response.json();

				if (!response.ok) {
					setError(data.error || "An unexpected error occurred.");
					return;
				}

				setSuccess(data.success);

				// Automatically sign in the user after successful registration
				const signInResult = await signIn("credentials", {
					email: values.email,
					password: values.password,
					redirect: false,
				});

				if (signInResult?.error) {
					setError("Registration successful, but auto-login failed. Please log in manually.");
				} else if (signInResult?.ok) {
					// Redirect to home or dashboard on successful login
					router.push("/profile");
				}
			} catch {
				setError("Failed to connect to the server. Please try again.");
			}
		});
	};

	return (
		<div className={cn("flex flex-col gap-3 max-w-100", className)} {...props}>
			<Card>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-3">
							<div className="flex flex-col gap-4">
								<Button
									variant="outline"
									className="w-full h-10 cursor-pointer text-md"
									onClick={() => signIn("google", { callbackUrl: "/" })}
								>
									<Image width={16} height={16} alt="google-icon" src="/google-icon.svg" />
									Войти с Google
								</Button>
							</div>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">или</span>
							</div>
							<div className="grid gap-5">
								<div className="grid gap-2">
									<Label htmlFor="email">Почта</Label>
									<Input
										id="email"
										type="email"
										className="placeholder:text-muted-foreground text-foreground"
										placeholder="playnote@gmail.com"
										{...register("email")}
									/>
									{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Пароль</Label>
									</div>
									<Input id="password" type="password" {...register("password")} />
									{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="confirm-password">Повторите пароль</Label>
									</div>
									<Input id="confirm-password" type="password" {...register("confirmPassword")} />
									{errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
								</div>
								{error && <p className="text-sm text-red-500 text-center">{error}</p>}
								{success && <p className="text-sm text-green-500 text-center">{success}</p>}
								<Button type="submit" className="w-full" disabled={isPending}>
									{isPending ? "Создаем аккаунт..." : "Создать аккаунт"}
								</Button>
							</div>
							<div className="text-center text-sm">
								Уже есть аккаунт?{" "}
								<Link href="/sign-in" className="underline underline-offset-4">
									Войти
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
