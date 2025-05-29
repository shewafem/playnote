"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, ForgotPasswordFormValues } from "@/schemas/auth-schema";
import { requestPasswordReset } from "@/actions/reset-password";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if (result.error) {
        setError(result.error);
      }
      if (result.success) {
        setSuccess(result.success);
        form.reset(); 
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Сброс пароля</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-500/10 p-3 rounded-md">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-500 text-center bg-green-500/10 p-3 rounded-md">
                {success}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Отправка..." : "Отправить ссылку для сброса"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}