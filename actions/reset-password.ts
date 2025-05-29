"use server";

import { z } from "zod";
import crypto from "crypto"; // Node.js crypto module for UUID
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Assuming you have prisma client exported from lib/db.ts
import { ForgotPasswordSchema, ResetPasswordSchema } from "@/schemas/auth-schema";
import { sendPasswordResetEmail } from "@/lib/mail";
//import { getUserByEmail, getUserByPasswordResetToken } from "@/lib/data/user"; // Helper functions

// Helper functions (you can put these in a separate data access file if you prefer)
// lib/data/user.ts
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

export const getUserByPasswordResetToken = async (token: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });
    return user;
  } catch {
    return null;
  }
};
// End of helper functions

export async function requestPasswordReset(
  values: z.infer<typeof ForgotPasswordSchema>
): Promise<{ success?: string; error?: string }> {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Неверный email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) { // Check for hashedPassword to ensure it's not an OAuth only account
    return { error: "Пользователь с таким email не найден или не может сбросить пароль." };
  }

  const passwordResetToken = crypto.randomUUID();
  const passwordResetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  try {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordResetToken,
        passwordResetTokenExpiry,
      },
    });

    const emailResult = await sendPasswordResetEmail(existingUser.email, passwordResetToken);
    if (!emailResult.success) {
        return { error: "Не удалось отправить письмо для сброса пароля." };
    }

    return { success: "Письмо для сброса пароля отправлено! Проверьте свою почту." };
  } catch (error) {
    console.error("REQUEST_PASSWORD_RESET_ERROR", error);
    return { error: "Что-то пошло не так. Попробуйте еще раз." };
  }
}


export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema>
): Promise<{ success?: string; error?: string }> {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Неверные данные!" };
  }

  const { password, token } = validatedFields.data;

  if (!token) {
    return { error: "Отсутствует токен!" };
  }

  const existingUser = await getUserByPasswordResetToken(token);

  if (!existingUser) {
    return { error: "Неверный токен!" };
  }

  if (!existingUser.passwordResetTokenExpiry) {
    return { error: "Токен не имеет срока действия. Пожалуйста, запросите сброс пароля еще раз."}
  }

  const hasExpired = new Date(existingUser.passwordResetTokenExpiry) < new Date();

  if (hasExpired) {
    return { error: "Срок действия токена истек!" };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        hashedPassword,
        passwordResetToken: null, // Clear the token
        passwordResetTokenExpiry: null,
      },
    });

    // Optionally, send a confirmation email that password was changed.

    return { success: "Пароль успешно изменен! Теперь вы можете войти." };
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return { error: "Что-то пошло не так. Не удалось сменить пароль." };
  }
}