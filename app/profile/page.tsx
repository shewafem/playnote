import { prisma } from "@/lib/prisma";
import ProfileHeader from "@/components/profile/profile-header";
import PersonalInfo from "@/components/profile/personal-info";
import StudentInfo from "@/components/profile/student-info";
import TeacherInfo from "@/components/profile/teacher-info";
import AdminInfo from "@/components/profile/admin-info";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    return <div className="container mx-auto p-4 text-center">Please log in</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    return <div className="container mx-auto p-4 text-center">User not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileHeader user={user} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonalInfo user={user} />
        {user.role === "STUDENT" && <StudentInfo user={user} />}
        {user.role === "TEACHER" && <TeacherInfo user={user} />}
        {user.role === "ADMIN" && <AdminInfo />}
      </div>
    </div>
  );
}