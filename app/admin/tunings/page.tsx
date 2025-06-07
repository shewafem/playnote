// app/admin/tunings/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { TuningsTable } from "@/components/admin/tuning-table";
import { getTunings } from "@/app/admin/tunings/actions"; // Предполагаем, что у вас есть эта серверная функция
import { PlusCircle } from "lucide-react";

export default async function AdminTuningsPage() {
  const tunings = await getTunings(); // Получаем все тюнинги

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Управление Тюнингами</h1>
        <Button asChild>
          <Link href="/admin/tunings/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить тюнинг
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список тюнингов</CardTitle>
          {/* Можно добавить CardDescription с количеством тюнингов, если нужно */}
        </CardHeader>
        <CardContent>
          <TuningsTable tunings={tunings} />
        </CardContent>
      </Card>
    </div>
  );
}