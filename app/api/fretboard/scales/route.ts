import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const scales = await prisma.scale.findMany({
    select: {
      name: true,
      formula: true,
    }
  })

  return NextResponse.json(scales)
}