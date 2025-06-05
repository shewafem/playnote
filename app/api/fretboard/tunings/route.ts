import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tunings = await prisma.tuning.findMany({
    select: {
      name: true,
      notes: true
    }
  })

  return NextResponse.json(tunings)
}