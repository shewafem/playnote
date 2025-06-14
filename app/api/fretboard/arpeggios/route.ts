import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const arpeggios = await prisma.arpeggio.findMany()
  return NextResponse.json(arpeggios)
}