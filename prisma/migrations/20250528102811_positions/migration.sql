/*
  Warnings:

  - You are about to drop the `UserLearnedArpeggio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLearnedChord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLearnedScale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLearnedArpeggio" DROP CONSTRAINT "UserLearnedArpeggio_arpeggioId_fkey";

-- DropForeignKey
ALTER TABLE "UserLearnedArpeggio" DROP CONSTRAINT "UserLearnedArpeggio_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLearnedChord" DROP CONSTRAINT "UserLearnedChord_chordId_fkey";

-- DropForeignKey
ALTER TABLE "UserLearnedChord" DROP CONSTRAINT "UserLearnedChord_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLearnedScale" DROP CONSTRAINT "UserLearnedScale_scaleId_fkey";

-- DropForeignKey
ALTER TABLE "UserLearnedScale" DROP CONSTRAINT "UserLearnedScale_userId_fkey";

-- DropTable
DROP TABLE "UserLearnedArpeggio";

-- DropTable
DROP TABLE "UserLearnedChord";

-- DropTable
DROP TABLE "UserLearnedScale";

-- CreateTable
CREATE TABLE "_PositionToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PositionToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ScaleToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ScaleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArpeggioToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArpeggioToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PositionToUser_B_index" ON "_PositionToUser"("B");

-- CreateIndex
CREATE INDEX "_ScaleToUser_B_index" ON "_ScaleToUser"("B");

-- CreateIndex
CREATE INDEX "_ArpeggioToUser_B_index" ON "_ArpeggioToUser"("B");

-- AddForeignKey
ALTER TABLE "_PositionToUser" ADD CONSTRAINT "_PositionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PositionToUser" ADD CONSTRAINT "_PositionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScaleToUser" ADD CONSTRAINT "_ScaleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Scale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScaleToUser" ADD CONSTRAINT "_ScaleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArpeggioToUser" ADD CONSTRAINT "_ArpeggioToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Arpeggio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArpeggioToUser" ADD CONSTRAINT "_ArpeggioToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
