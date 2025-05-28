import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Chord, Enrollment, Position as PrismaPosition } from "@prisma/client";
import LearnedChordsTable from "./learned-chords-table";

export interface LearnedPositionWithChordDetails extends PrismaPosition {
  chord: Chord;
}

interface StudentInfoProps {
  user: {
    enrollments: Enrollment[];
    learnedPositions: LearnedPositionWithChordDetails[];
  };
}

export default function StudentInfo({ user }: StudentInfoProps) {
  //const enrolledCourses = user.enrollments || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Мои выученные аккорды</CardTitle>
          <CardDescription>
            Здесь отображаются все гитарные аккорды, которые вы отметили как выученные.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LearnedChordsTable learnedPositions={user.learnedPositions} />
        </CardContent>
      </Card>
    </div>
  );
}