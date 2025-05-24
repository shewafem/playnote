import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas/auth-schema";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const { email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ success: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
  }
}