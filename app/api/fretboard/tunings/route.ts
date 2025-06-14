import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tunings = await prisma.tuning.findMany()
  return NextResponse.json(tunings)
}

//export async function POST(req: NextRequest) {
  
//}