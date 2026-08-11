"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)return setError(d.error);router.push("/dashboard");}
  return <main className="form-page"><form className="panel" onSubmit={submit}><h1>Welcome back</h1><input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button primary">Log in</button>{error&&<p className="error">{error}</p>}</form></main>;
}
