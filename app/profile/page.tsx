import { prisma } from "@/lib/prisma"; 
import ProfileHeader from "@/components/profile/profile-header";
import StudentInfo from "@/components/profile/student-info";
//import TeacherInfo from "@/components/profile/teacher-info";
import { auth } from "@/auth";
import { notFound, redirect } from 'next/navigation';
import { Container } from "@/components/layout/container";


export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in'); 
  }

  const userId = session.user.id;

  const userWithDetails = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      //enrollments: {
      //  include: {
      //    course: true,
      //  },
      //  orderBy: {
      //    course: { title: 'asc' }
      //  }
      //},
      //coursesCreated: {
      //  orderBy: { createdAt: 'desc' }
      //},
      learnedPositions: {
        include: {
          chord: true,
        },
        orderBy: {
          chord: {
            key: 'asc',
          },
        },
      },
      savedFretboards: true
    },
  });

  if (!userWithDetails) {
    notFound();
  }

  return (
    <Container>
      <ProfileHeader user={userWithDetails} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 space-y-6">
            {userWithDetails.role === "STUDENT" && <StudentInfo user={userWithDetails} />}
            {/*{userWithDetails.role === "TEACHER" && <TeacherInfo user={userWithDetails} />}*/}
            {userWithDetails.role === "ADMIN" && redirect("/admin")}
        </div>
      </div>
    </Container>
  );
}