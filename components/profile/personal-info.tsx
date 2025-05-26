// components/profile/PersonalInfo.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalInfoProps {
  user: {
    email: string;
    createdAt: Date;
  };
}

export default function PersonalInfo({ user }: PersonalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Личная информация</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col justify-center">
          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
          <dd className="text-sm mb-3">{user.email}</dd>
          <dt className="text-sm font-medium text-muted-foreground">Дата регистрации:</dt>
          <dd className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</dd>
        </dl>
      </CardContent>
    </Card>
  );
}