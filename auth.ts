import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas/auth-schema";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	//oAuth
	providers: [
		Google,
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const user = await prisma.user.findUnique({
						where: { email },
					});

					if (!user || !user.hashedPassword) {
						return null;
					}

					try {
						const passwordsMatch = await bcrypt.compare(password, user.hashedPassword, );

						if (passwordsMatch) {
							return {
								id: user.id,
								email: user.email,
								name: user.name,
								role: user.role,
							};
						}
					} catch (error) {
						console.error("Ошибка подтверждения пароля", error);
						return null;
					}
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			// token ot jwt
			if (session.user && token.id) {
				session.user.id = token.id as string;
			}
			if (session.user && token.role) {
				session.user.role = token.role as UserRole;
			}
			// session.expires будет maxAge (30days)
			return session;
		},
	},
});
