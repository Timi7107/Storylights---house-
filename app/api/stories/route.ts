import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { initializePaystack } from "@/lib/paystack";

function slugify(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}

export async function POST(req:Request){
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:"Please log in first."},{status:401});
  const {title,genre,excerpt,cover_url,content}=await req.json();
  if(!title||!genre||!excerpt||!content)return NextResponse.json({error:"Please complete all required fields."},{status:400});
  const base=slugify(title); let slug=base; let n=2;
  while(db.prepare("SELECT id FROM stories WHERE slug=?").get(slug)){slug=`${base}-${n++}`;}
  const result=db.prepare(`INSERT INTO stories(title,slug,excerpt,content,genre,cover_url,author_id,status) VALUES(?,?,?,?,?,?,?,'pending_payment')`).run(title,slug,excerpt,content,genre,cover_url||null,user.id);
  const id=Number(result.lastInsertRowid);
  const reference=`SLH_${id}_${Date.now()}`;
  db.prepare("UPDATE stories SET payment_reference=? WHERE id=?").run(reference,id);
  try{
    const fee=Number(process.env.PUBLISHING_FEE_NGN||1000);
    const callback=`${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/api/payments/callback`;
    const payment=await initializePaystack(user.email,fee,reference,callback);
    return NextResponse.json(payment);
  }catch(e:any){db.prepare("DELETE FROM stories WHERE id=?").run(id);return NextResponse.json({error:e.message},{status:500});}
}
