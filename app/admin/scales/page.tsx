// app/admin/scales/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ScalesTable } from "@/components/admin/scales-table";
import { getAllScales } from "@/app/admin/scales/actions"; 
import { PlusCircle } from "lucide-react";

export default async function AdminScalesPage() {
  const scales = await getAllScales(); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Управление ладами</h1>
        <Button asChild>
          <Link href="/admin/scales/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить лад
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список ладов</CardTitle>
        </CardHeader>
        <CardContent>
          <ScalesTable scales={scales} />
        </CardContent>
      </Card>
    </div>
  );
}