// app/admin/page.tsx
import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  redirect("/admin/users");
}