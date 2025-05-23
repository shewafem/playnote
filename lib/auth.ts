import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
//import { PrismaAdapter } from "@auth/prisma-adapter"
//import { loginSchema } from "@/schemas/login-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
    Google,
    Credentials({}),
  ],
});
