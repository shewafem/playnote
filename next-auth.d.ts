import { User as PrismaUser } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: PrismaUser["role"];
			image: string | null;
			name?: string | null;
			email?: string | null;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		role: UserRole;
		image: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role: UserRole;
		image: string | null;
		email?: string | null;
		name?: string | null;
	}
}
