import { Prisma } from "@prisma/client";

export type InstrumentType = {
	strings: number;
	fretsOnChord: number;
	name: "Guitar" | "Ukulele";
	keys: string[];
	tunings: {
		standard: string[];
	};
};
// chord with positions
export type ChordWithPositions = Prisma.ChordGetPayload<{
  include: {
    positions: true;
  };
}>;

export type PositionWithChord = Prisma.PositionGetPayload<{
  include: {
    chord: true;
  };
}>;

export type UserWithPositions = Prisma.UserGetPayload<{
  include: {
    learnedPositions: {
      include: {
        chord: true;
      }
    }
  };
}>;