// components/profile/StudentInfo.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Enrollment } from "@prisma/client";
import Link from "next/link";

interface StudentInfoProps {
  user: {
    enrollments: Enrollment[];
  };
}

export default function StudentInfo({ user }: StudentInfoProps) {
  const enrolledCourses = user.enrollments || [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои курсы</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Вы записаны в {enrolledCourses.length} курсах.</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/my-courses">Посмотреть все курсы</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}