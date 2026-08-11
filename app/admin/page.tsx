import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export default async function Admin(){
  const user=await getCurrentUser(); if(!user || user.role!=="admin") redirect("/");
  const rows=db.prepare(`SELECT s.*,u.name author_name,u.email FROM stories s JOIN users u ON u.id=s.author_id ORDER BY s.created_at DESC`).all() as any[];
  return <main className="container page"><h1>Admin Dashboard</h1><p className="muted">Manage stories and publishing activity.</p><div className="table">{rows.map(s=><div className="row" key={s.id}><div><b>{s.title}</b><small>{s.author_name} · {s.email}</small></div><span className={`status ${s.status}`}>{s.status}</span></div>)}</div></main>;
}
