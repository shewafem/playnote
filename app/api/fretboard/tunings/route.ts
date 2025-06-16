import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tunings = await prisma.tuning.findMany()
    return NextResponse.json(tunings)
  } catch (e) {
    console.error("Произошла ошибка:", e)
    return NextResponse.json({error: "Внутренняя ошибка сервера"}, {status: 500})
  }
}
