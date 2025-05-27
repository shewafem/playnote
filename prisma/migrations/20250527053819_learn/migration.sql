-- CreateTable
CREATE TABLE "Scale" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT NOT NULL,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arpeggio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT NOT NULL,

    CONSTRAINT "Arpeggio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLearnedChord" (
    "userId" TEXT NOT NULL,
    "chordId" INTEGER NOT NULL,
    "learnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearnedChord_pkey" PRIMARY KEY ("userId","chordId")
);

-- CreateTable
CREATE TABLE "UserLearnedScale" (
    "userId" TEXT NOT NULL,
    "scaleId" INTEGER NOT NULL,
    "learnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearnedScale_pkey" PRIMARY KEY ("userId","scaleId")
);

-- CreateTable
CREATE TABLE "UserLearnedArpeggio" (
    "userId" TEXT NOT NULL,
    "arpeggioId" INTEGER NOT NULL,
    "learnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearnedArpeggio_pkey" PRIMARY KEY ("userId","arpeggioId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scale_formula_key" ON "Scale"("formula");

-- CreateIndex
CREATE UNIQUE INDEX "Arpeggio_formula_key" ON "Arpeggio"("formula");

-- CreateIndex
CREATE INDEX "UserLearnedChord_userId_idx" ON "UserLearnedChord"("userId");

-- CreateIndex
CREATE INDEX "UserLearnedChord_chordId_idx" ON "UserLearnedChord"("chordId");

-- CreateIndex
CREATE INDEX "UserLearnedScale_userId_idx" ON "UserLearnedScale"("userId");

-- CreateIndex
CREATE INDEX "UserLearnedScale_scaleId_idx" ON "UserLearnedScale"("scaleId");

-- CreateIndex
CREATE INDEX "UserLearnedArpeggio_userId_idx" ON "UserLearnedArpeggio"("userId");

-- CreateIndex
CREATE INDEX "UserLearnedArpeggio_arpeggioId_idx" ON "UserLearnedArpeggio"("arpeggioId");

-- AddForeignKey
ALTER TABLE "UserLearnedChord" ADD CONSTRAINT "UserLearnedChord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearnedChord" ADD CONSTRAINT "UserLearnedChord_chordId_fkey" FOREIGN KEY ("chordId") REFERENCES "Chord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearnedScale" ADD CONSTRAINT "UserLearnedScale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearnedScale" ADD CONSTRAINT "UserLearnedScale_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "Scale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearnedArpeggio" ADD CONSTRAINT "UserLearnedArpeggio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearnedArpeggio" ADD CONSTRAINT "UserLearnedArpeggio_arpeggioId_fkey" FOREIGN KEY ("arpeggioId") REFERENCES "Arpeggio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
