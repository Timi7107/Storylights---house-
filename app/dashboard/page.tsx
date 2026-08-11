import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export default async function Dashboard(){
  const user=await getCurrentUser(); if(!user) redirect("/login");
  const stories=db.prepare("SELECT * FROM stories WHERE author_id=? ORDER BY created_at DESC").all(user.id) as any[];
  return <main className="container page"><div className="section-head"><div><h1>Writer Dashboard</h1><p className="muted">Welcome, {user.name}.</p></div><Link className="button primary" href="/write">+ New Story</Link></div>
  <div className="table">{stories.map(s=><div className="row" key={s.id}><div><b>{s.title}</b><small>{s.genre}</small></div><span className={`status ${s.status}`}>{s.status.replace("_"," ")}</span></div>)}</div>
  {stories.length===0&&<div className="empty">You have not submitted a story yet.</div>}</main>;
}
