// app/admin/tunings/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { TuningsTable } from "@/components/admin/tuning-table";
import { getTunings } from "@/app/admin/tunings/actions"; 
import { PlusCircle } from "lucide-react";

export default async function AdminTuningsPage() {
  const tunings = await getTunings(); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Управление строями</h1>
        <Button asChild>
          <Link href="/admin/tunings/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить строй
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список строев</CardTitle>
        </CardHeader>
        <CardContent>
          <TuningsTable tunings={tunings} />
        </CardContent>
      </Card>
    </div>
  );
}