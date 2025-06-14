/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TabFile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `img` to the `SavedFretboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TabFile" DROP CONSTRAINT "TabFile_userId_fkey";

-- AlterTable
ALTER TABLE "SavedFretboard" ADD COLUMN     "img" TEXT NOT NULL;

-- DropTable
DROP TABLE "Attachment";

-- DropTable
DROP TABLE "TabFile";
