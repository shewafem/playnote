// components/profile/TeacherInfo.tsx
//import { Button } from "@/components/ui/button";
//import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//import { Course } from "@prisma/client";
//import Link from "next/link";

//interface TeacherInfoProps {
//  user: {
//    coursesCreated: Course[];
//  };
//}

//export default function TeacherInfo({ user }: TeacherInfoProps) {
//  const createdCourses = user.coursesCreated || [];
//  return (
//    <Card>
//      <CardHeader>
//        <CardTitle>Mои курсы</CardTitle>
//      </CardHeader>
//      <CardContent>
//        <p>Вы создали {createdCourses.length} курсов.</p>
//      </CardContent>
//      <CardFooter>
//        <Button asChild>
//          <Link href="/teacher/courses">Управлять курсами</Link>
//        </Button>
//      </CardFooter>
//    </Card>
//  );
//}