"use client";
import { useState } from "react";

export default function WriteForm({fee}:{fee:number}) {
  const [form,setForm]=useState({title:"",genre:"Romance",excerpt:"",cover_url:"",content:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  function change(k:string,v:string){setForm({...form,[k]:v});}
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const r=await fetch("/api/stories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const d=await r.json();if(!r.ok){setBusy(false);return setError(d.error)};window.location.href=d.authorization_url;}
  return <form className="writer-form" onSubmit={submit}>
    <input placeholder="Story title" value={form.title} onChange={e=>change("title",e.target.value)} required/>
    <select value={form.genre} onChange={e=>change("genre",e.target.value)}>{["Romance","War","Thriller","Fictional"].map(g=><option key={g}>{g}</option>)}</select>
    <input placeholder="Short description / excerpt" value={form.excerpt} onChange={e=>change("excerpt",e.target.value)} required/>
    <input placeholder="Cover image URL (optional)" value={form.cover_url} onChange={e=>change("cover_url",e.target.value)}/>
    <textarea placeholder="Write your story here..." rows={18} value={form.content} onChange={e=>change("content",e.target.value)} required/>
    <div className="pay-box"><b>Publishing fee: ₦{fee.toLocaleString()}</b><span>Your story becomes public after successful payment verification.</span></div>
    <button className="button primary" disabled={busy}>{busy?"Preparing payment…":`Pay ₦${fee.toLocaleString()} & Publish`}</button>
    {error&&<p className="error">{error}</p>}
  </form>;
}
