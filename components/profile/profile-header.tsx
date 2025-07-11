"use-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale"; 
const roleText = {
	STUDENT: "Студент",
	TEACHER: "Учитель",
	ADMIN: "Админ",
};

interface ProfileHeaderProps {
	user: {
		name?: string | null;
		image?: string | null;
		role: string;
		email: string;
		createdAt: Date;
	};
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
	return (
		<div className="flex flex-col max-w-200 mx-auto items-center md:flex-row gap-4 p-4 bg-card rounded-lg shadow">
			<Avatar className="w-24 h-24 ">
				<AvatarImage className="object-cover" src={user.image || ""} alt={user.name || "Пользователь"} />
				<AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
			</Avatar>
			<div className="text-center md:text-left">
				<h1 className="text-2xl font-bold">{user.name}</h1>
				<p className="text-muted-foreground mb-2">{user.role === "STUDENT" ? roleText.STUDENT : roleText.TEACHER}</p>
				<dl className="flex flex-col justify-center">
					<dt className="text-sm font-medium text-muted-foreground">Email</dt>
					<dd className="text-sm mb-3">{user.email}</dd>
					<dt className="text-sm font-medium text-muted-foreground">Дата регистрации:</dt>
					<dd className="text-sm">{format(new Date(user.createdAt), "dd MMMM yyyy, HH:mm", { locale: ru })}</dd>
				</dl>
			</div>
			<Link
				className="text-background text-center dark:text-foreground ml-auto mr-auto self-end bg-primary p-3 rounded-lg"
				href="/profile/settings"
			>
				Редактировать профиль ✍
			</Link>
		</div>
	);
}
