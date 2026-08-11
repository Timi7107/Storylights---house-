import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req:Request){
  const {email,password}=await req.json();
  const user=db.prepare("SELECT * FROM users WHERE email=?").get(String(email).toLowerCase()) as any;
  if(!user || !(await bcrypt.compare(password,user.password_hash)))return NextResponse.json({error:"Invalid email or password."},{status:401});
  await createSession(user.id);
  return NextResponse.json({ok:true});
}
