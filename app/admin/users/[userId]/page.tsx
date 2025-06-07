// app/admin/users/[userId]/edit/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/admin/user-form";
import { getUserById, updateUser } from "../actions";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
	const user = await getUserById(userId);

	if (!user) {
		notFound();
	}

  const hasAccount = !!user?.accounts.length
  const isAdmin = user.role === "ADMIN";

	const handleUpdateUser = async (data: unknown) => {
    "use server";
		return updateUser(userId, data);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Редактировать пользователя: {user.name || user.email}</CardTitle>
			</CardHeader>
			<CardContent>
				<UserForm
					defaultValues={{
						name: user.name || "",
						email: user.email,
						role: user.role as UserRole,
					}}
					onSubmit={handleUpdateUser}
					isEditing={true}
          hasAccount={hasAccount}
          isAdmin={isAdmin}
				/>
			</CardContent>
		</Card>
	);
}
