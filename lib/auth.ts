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
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expires.toISOString()})
  `;

  const jar = await cookies();

  jar.set("storylights_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/"
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get("storylights_session")?.value;

  if (!token) return null;

  const rows = await sql`
    SELECT u.id, u.name, u.email, u.role
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  return (rows[0] as User | undefined) ?? null;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get("storylights_session")?.value;

  if (token) {
    await sql`
      DELETE FROM sessions
      WHERE token = ${token}
    `;
  }

  jar.delete("storylights_session");
}
