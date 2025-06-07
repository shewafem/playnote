import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/admin/user-form";
import { createUser } from "../actions";

export default function NewUserPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Добавить нового пользователя</CardTitle>
      </CardHeader>
      <CardContent>
        <UserForm onSubmit={createUser} />
      </CardContent>
    </Card>
  );
}