import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const arpeggios = await prisma.arpeggio.findMany()
    return NextResponse.json(arpeggios)
  } catch (e) {
    console.error("Произошла ошибка:", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

//export async function DELETE(req: NextRequest) {
//  try {
//    const { id } = await req.json();
    
//    if (!id) {
//      return NextResponse.json(
//        { error: "ID обязателен" },
//        { status: 400 }
//      );
//    }

//    const arpeggio = await prisma.arpeggio.findUnique({ where: { id } });
//    if (!arpeggio) {
//      return NextResponse.json(
//        { error: "Арпеджио не найден" },
//        { status: 404 }
//      );
//    }

//    await prisma.arpeggio.delete({ where: { id } });
//    return NextResponse.json(
//      { message: "Арпеджио успешно удалено" },
//      { status: 200 }
//    );
//  } catch (e) {
//    console.error("Произошла ошибка:", e);
//    return NextResponse.json(
//      { error: "Внутренняя ошибка сервера" },
//      { status: 500 }
//    );
//  }
//}
