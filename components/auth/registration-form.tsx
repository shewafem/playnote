"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define the registration schema, including password and passwordRepeat with a refinement for matching
const registrationSchema = z
  .object({
    email: z.string().email({ message: "Неверный формат почты" }),
    password: z.string().min(6, { message: "Пароль должен быть не менее 6 символов" }), // Added min length for password
    passwordRepeat: z.string().min(1, { message: "Повторите пароль" }),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"], // Set the error on the passwordRepeat field
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordRepeat: "", // Initialize passwordRepeat
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const onSubmit = async (values: RegistrationFormValues) => {
    setRegistrationError(null);

    // In a real registration scenario, you would send these values to your backend
    // to create a new user. For demonstration purposes, we'll simulate a success
    // or an error.
    console.log("Registration form submitted with:", values);

    // Simulate a successful registration after a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically make an API call to your backend to register the user.
    // Example:
    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: values.email, password: values.password }),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   setRegistrationError(errorData.message || "Ошибка регистрации.");
    //   return;
    // }

    // After successful registration, you might want to automatically sign them in
    // or redirect them to a login page. For now, we'll simulate a successful login redirect.
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setRegistrationError("Ошибка входа после регистрации. Пожалуйста, войдите вручную.");
      console.error("Ошибка входа после регистрации: ", result.error);
    } else if (result?.ok) {
      router.push("/");
    }
  };

  const handleOAuthSignIn = (
    provider: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    signIn(provider, { callbackUrl: "/" });
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
                  onClick={(e) => handleOAuthSignIn("google", e)}
                >
                  <Image width={16} height={16} alt="google-icon" src="/google-icon.svg" />
                  Войти с Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">или</span>
              </div>
              <div className="grid gap-5">
                <div className="grid gap-3">
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
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Пароль</Label>
                  </div>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password-repeat">Повторите пароль</Label>
                  </div>
                  <Input id="password-repeat" type="password" {...register("passwordRepeat")} />
                  {errors.passwordRepeat && (
                    <p className="text-sm text-red-500">{errors.passwordRepeat.message}</p>
                  )}
                </div>
                {registrationError && (
                  <p className="text-sm text-red-500 text-center">{registrationError}</p>
                )}
                <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Загрузка..." : "Зарегистрироваться"}
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