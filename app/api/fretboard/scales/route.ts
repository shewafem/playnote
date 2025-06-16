import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scales = await prisma.scale.findMany()
    return NextResponse.json(scales)
  } catch (e) {
    console.error("Произошла ошибка:", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
