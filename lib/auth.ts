 import { cookies } from "next/headers";
import crypto from "crypto";
import { sql } from "./db";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expires.toISOString()})
  `;

  const cookieStore = await cookies();

  cookieStore.set("storylights_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("storylights_session")?.value;

  if (!token) {
    return null;
  }

  const rows = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role
    FROM sessions s
    INNER JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  return (rows[0] as User | undefined) ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("storylights_session")?.value;

  if (token) {
    await sql`
      DELETE FROM sessions
      WHERE token = ${token}
    `;
  }

  cookieStore.delete("storylights_session");
}