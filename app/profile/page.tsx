import { prisma } from "@/lib/prisma"; 
import ProfileHeader from "@/components/profile/profile-header";
import StudentInfo, { LearnedPositionWithChordDetails } from "@/components/profile/student-info";
import TeacherInfo from "@/components/profile/teacher-info";
import AdminInfo from "@/components/profile/admin-info";
import { auth } from "@/auth";
import { notFound, redirect } from 'next/navigation';
import { Enrollment, User as PrismaUser, Course } from "@prisma/client";
import { Container } from "@/components/layout/container";

interface ProfileUser extends Omit<PrismaUser, 'learnedPositions' | 'enrollments' | 'coursesCreated'> {
  enrollments: (Enrollment & { course: Course })[];
  coursesCreated: Course[];
  learnedPositions: LearnedPositionWithChordDetails[];
}


export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in'); 
  }

  const userId = session.user.id;

  const userWithDetails = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: true,
        },
        orderBy: {
          course: { title: 'asc' }
        }
      },
      coursesCreated: {
        orderBy: { createdAt: 'desc' }
      },
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
    },
  });

  if (!userWithDetails) {
    notFound();
  }

  const userForProfile: ProfileUser = {
    ...userWithDetails,

    learnedPositions: userWithDetails.learnedPositions.map(lp => ({
        ...lp,
        chord: lp.chord!,
    })) as LearnedPositionWithChordDetails[],
    enrollments: userWithDetails.enrollments,
    coursesCreated: userWithDetails.coursesCreated,
  };


  return (
    <Container>
      <ProfileHeader user={userForProfile} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 space-y-6">
            {userForProfile.role === "STUDENT" && <StudentInfo user={userForProfile} />}
            {userForProfile.role === "TEACHER" && <TeacherInfo user={userForProfile} />}
            {userForProfile.role === "ADMIN" && <AdminInfo />}
        </div>
      </div>
    </Container>
  );
}