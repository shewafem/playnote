import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinata";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth()
  const userId = session?.user.id
	try {
		const data = await request.formData();
		const file: File | null = data.get("file") as unknown as File;
		const { cid } = await pinata.upload.public.file(file);
		const url = await pinata.gateways.public.convert(cid);
    await prisma.user.update({
      where: { id: userId },
      data: { image: url },
    })
		return NextResponse.json(url, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
	}
}
