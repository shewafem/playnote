//import { Button } from "@/components/ui/button";
//import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminInfo() {
  redirect("/admin")
  //return (
  //  <Card>
  //    <CardHeader>
  //      <CardTitle>Админская панель</CardTitle>
  //    </CardHeader>
  //    <CardContent>
  //      <p>Вы являетесь администратором</p>
  //    </CardContent>
  //    <CardFooter>
  //      <Button asChild>
  //        <Link href="/admin">Перейти в административную панель</Link>
  //      </Button>
  //    </CardFooter>
  //  </Card>
  //);
}