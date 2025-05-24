// components/profile/AdminInfo.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Админская панель</CardTitle>
      </CardHeader>
      <CardContent>
        <p>As an admin, you have access to administrative features.</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/admin">Go to Admin Panel</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}