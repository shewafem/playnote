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
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { LoginFormValues, LoginSchema } from "@/schemas/auth-schema";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError("Неверный логин или пароль.");
        console.error("Ошибка авторизации:", result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-3 max-w-100", className)} {...props}>
      <Card className="p-0">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 cursor-pointer text-md"
                  disabled={isPending}
                  onClick={() => signIn("google", { redirectTo: callbackUrl })}
                >
                  <Image width={16} height={16} alt="google-icon" src="/google-icon.svg" />
                  Войти с Google
                </Button>
              </div>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">или</span>
							</div>
              <div className="grid gap-2">
                <Label htmlFor="email">Почта</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="playnote@gmail.com"
                  {...register("email")}
                  disabled={isPending}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Забыли пароль?
                  </Link>
                </div>
                <Input id="password" type="password" {...register("password")} disabled={isPending} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              {error && <p className="text-sm text-red-500 text-center bg-red-500/10 p-3 rounded-md">{error}</p>}
              
              <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                {isPending ? "Проверка..." : "Войти"}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                Нет аккаунта?{" "}
                <Link href="/sign-up" className="underline">
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