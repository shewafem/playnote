import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArpeggiosTable } from "@/components/admin/arpeggios-table";
import { getAllArpeggios } from "@/app/admin/arpeggios/actions"; 
import { PlusCircle } from "lucide-react";

export default async function AdminArpeggiosPage() {
  const arpeggios = await getAllArpeggios(); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Управление арпеджио</h1>
        <Button asChild>
          <Link href="/admin/arpeggios/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить арпеджио
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список арпеджио</CardTitle>
        </CardHeader>
        <CardContent>
          <ArpeggiosTable arpeggios={arpeggios} />
        </CardContent>
      </Card>
    </div>
  );
}