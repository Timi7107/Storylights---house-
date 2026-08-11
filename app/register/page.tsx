"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});const d=await r.json();if(!r.ok)return setError(d.error);router.push("/dashboard");}
  return <main className="form-page"><form className="panel" onSubmit={submit}><h1>Join StoryLights House</h1><input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required/><input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input placeholder="Password (8+ characters)" type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/><button className="button primary">Create account</button>{error&&<p className="error">{error}</p>}</form></main>;
}
