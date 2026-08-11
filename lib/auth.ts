import { cookies } from "next/headers";
import crypto from "crypto";
import db from "./db";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .run(token, userId, expires);

  const jar = await cookies();
  jar.set("storylights_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expires),
    path: "/"
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get("storylights_session")?.value;
  if (!token) return null;

  const row = db.prepare(`
    SELECT u.id, u.name, u.email, u.role
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as User | undefined;

  return row ?? null;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get("storylights_session")?.value;
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  jar.delete("storylights_session");
}
