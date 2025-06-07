import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getUsers } from "./actions";
import { UsersTable } from "@/components/admin/user-table";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Пользователи</CardTitle>
        <Button asChild>
          <Link href="/admin/users/add">Добавить пользователя</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <UsersTable users={users} />
        ) : (
          <p>Пользователи не найдены.</p>
        )}
      </CardContent>
    </Card>
  );
}