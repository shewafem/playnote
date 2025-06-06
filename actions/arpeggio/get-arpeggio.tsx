"use server"
import prisma from "@/lib/prisma";

export async function getArpeggios() {
  const arpeggios = await prisma.arpeggio.findMany({
    select: {
      id: true,
      name: true,
      formula: true,
    },
  });

  return arpeggios;
}
