import { prisma } from "@/lib/prisma";
import ProfileHeader from "@/components/profile/profile-header";
import PersonalInfo from "@/components/profile/personal-info";
import StudentInfo from "@/components/profile/student-info";
import TeacherInfo from "@/components/profile/teacher-info";
import AdminInfo from "@/components/profile/admin-info";
import { auth } from "@/auth";
import { notFound, redirect } from 'next/navigation'; // 1. Импортируем redirect

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    // 2. Если сессии нет, перенаправляем на /sign-in
    redirect('/sign-in');
    // Важно: redirect() выбрасывает ошибку, которую Next.js перехватывает для выполнения редиректа.
    // Код ниже этой строки не будет выполнен, если !session истинно.
  }

  // Если мы дошли сюда, значит сессия есть, и session.user.id точно определен.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }, // TypeScript теперь будет уверен, что session.user.id существует
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      coursesCreated: true,
    },
  });

  if (!user) {
    notFound();
    //return <div className="container mx-auto p-4 text-center">Пользователь не найден</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileHeader user={user} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonalInfo user={user} />
        {user.role === "STUDENT" && <StudentInfo user={user} />}
        {user.role === "TEACHER" && <TeacherInfo user={user} />}
        {user.role === "ADMIN" && <AdminInfo />} {/* Рассмотрите передачу user в AdminInfo, если это необходимо */}
      </div>
    </div>
  );
}