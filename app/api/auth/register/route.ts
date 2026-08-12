import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Name, email and an 8+ character password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase();
    const hash = await bcrypt.hash(String(password), 12);

    const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${String(name)}, ${normalizedEmail}, ${hash})
      RETURNING id
    `;

    await createSession(Number(result[0].id));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "23505") {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    console.error("Registration error:", e);

    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 400 }
    );
  }
}