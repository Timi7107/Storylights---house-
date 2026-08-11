import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPaystack } from "@/lib/paystack";

export async function GET(req:Request){
  const url=new URL(req.url); const reference=url.searchParams.get("reference");
  if(!reference)return NextResponse.redirect(new URL("/dashboard?payment=missing",req.url));
  try{
    const payment=await verifyPaystack(reference);
    const expected=Number(process.env.PUBLISHING_FEE_NGN||1000)*100;
    if(payment.status==="success" && payment.amount===expected){
      db.prepare("UPDATE stories SET status='published', published_at=datetime('now') WHERE payment_reference=? AND status='pending_payment'").run(reference);
      return NextResponse.redirect(new URL("/dashboard?payment=success",req.url));
    }
    return NextResponse.redirect(new URL("/dashboard?payment=failed",req.url));
  }catch{return NextResponse.redirect(new URL("/dashboard?payment=error",req.url));}
}
