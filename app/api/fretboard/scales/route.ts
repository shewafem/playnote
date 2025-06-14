import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const scales = await prisma.scale.findMany()
  return NextResponse.json(scales)
}