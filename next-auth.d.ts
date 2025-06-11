import { User as PrismaUser } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: PrismaUser["role"];
			image: string | null; // Allow null
			name?: string | null; // Allow null for consistency with Prisma
			email?: string | null; // Allow null for consistency
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		role: UserRole;
		image: string | null; // Allow null
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role: UserRole;
		image: string | null; // Allow null
		email?: string | null; // Optional for updates
		name?: string | null; // Optional for updates
	}
}
