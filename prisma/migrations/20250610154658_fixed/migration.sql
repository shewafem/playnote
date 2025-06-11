/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `arpeggiosCreated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `savedFretboards` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `scalesCreated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tuningsCreated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LessonProgress` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_courseId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_studentId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "lessonId";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "arpeggiosCreated",
DROP COLUMN "savedFretboards",
DROP COLUMN "scalesCreated",
DROP COLUMN "tuningsCreated";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "LessonProgress";

-- DropEnum
DROP TYPE "CourseGenre";

-- DropEnum
DROP TYPE "DifficultyLevel";

-- DropEnum
DROP TYPE "LessonContentType";

-- CreateTable
CREATE TABLE "SavedFretboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedFretboard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedFretboard" ADD CONSTRAINT "SavedFretboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
