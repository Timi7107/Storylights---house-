import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req:Request){
  try{
    const {name,email,password}=await req.json();
    if(!name||!email||!password||password.length<8)return NextResponse.json({error:"Name, email and an 8+ character password are required."},{status:400});
    const hash=await bcrypt.hash(password,12);
    const result=db.prepare("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)").run(name,email.toLowerCase(),hash);
    await createSession(Number(result.lastInsertRowid));
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e.code==="SQLITE_CONSTRAINT_UNIQUE"?"Email already registered.":"Unable to create account."},{status:400});}
}
