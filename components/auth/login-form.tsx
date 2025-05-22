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

const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат почты" }),
  password: z.string().min(1, { message: "Пароль обязателен" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setLoginError("Неверная почта или пароль.");
      console.error("Ошибка входа: ", result.error);
    } else if (result?.ok) {
      router.push("/");
    }
  };

  const handleOAuthSignIn = (
    provider: string,
    event: React.MouseEvent<HTMLButtonElement> // Add event parameter
  ) => {
    event.preventDefault(); // Prevent default form submission
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
                  onClick={(e) => handleOAuthSignIn("google", e)} // Pass the event
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
                  <Input id="email" type="email" className="placeholder:text-muted-foreground text-foreground" placeholder="playnote@gmail.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Пароль</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Забыли пароль?
                    </a>
                  </div>
                  {/* Регистрация */}
                  <Input id="password" type="password" {...register("password")} />
                  {/* Ошибка валидации */}
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                {/* Ошибка входа */}
                {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}
                <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Загрузка..." : "Войти"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Нет аккаунта?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}