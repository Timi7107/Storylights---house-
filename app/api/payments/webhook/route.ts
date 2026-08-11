import crypto from "crypto";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPaystack } from "@/lib/paystack";

export async function POST(req:Request){
  const body=await req.text();
  const signature=req.headers.get("x-paystack-signature")||"";
  const expected=crypto.createHmac("sha512",process.env.PAYSTACK_SECRET_KEY||"").update(body).digest("hex");
  if(!signature || !crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return new NextResponse("Invalid signature",{status:401});
  const event=JSON.parse(body);
  if(event.event==="charge.success"){
    const reference=event.data?.reference;
    if(reference){
      try{
        const payment=await verifyPaystack(reference);
        const expectedAmount=Number(process.env.PUBLISHING_FEE_NGN||1000)*100;
        if(payment.status==="success" && payment.amount===expectedAmount){
          db.prepare("UPDATE stories SET status='published', published_at=datetime('now') WHERE payment_reference=? AND status='pending_payment'").run(reference);
        }
      }catch{}
    }
  }
  return NextResponse.json({received:true});
}
