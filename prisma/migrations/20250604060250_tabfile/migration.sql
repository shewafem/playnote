/*
  Warnings:

  - The `formula` column on the `Arpeggio` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `formula` column on the `Scale` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Arpeggio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Scale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Arpeggio" DROP COLUMN "formula",
ADD COLUMN     "formula" INTEGER[];

-- AlterTable
ALTER TABLE "Scale" DROP COLUMN "formula",
ADD COLUMN     "formula" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "arpeggiosCreated" INTEGER[],
ADD COLUMN     "scalesCreated" INTEGER[],
ADD COLUMN     "tuningsCreated" INTEGER[];

-- CreateTable
CREATE TABLE "Tuning" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT[],

    CONSTRAINT "Tuning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TabFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "title" TEXT,
    "artist" TEXT,
    "fileContent" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TabFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tuning_name_key" ON "Tuning"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tuning_notes_key" ON "Tuning"("notes");

-- CreateIndex
CREATE INDEX "TabFile_userId_idx" ON "TabFile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Arpeggio_name_key" ON "Arpeggio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Arpeggio_formula_key" ON "Arpeggio"("formula");

-- CreateIndex
CREATE UNIQUE INDEX "Scale_name_key" ON "Scale"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Scale_formula_key" ON "Scale"("formula");

-- AddForeignKey
ALTER TABLE "TabFile" ADD CONSTRAINT "TabFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
