"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const db = url && key ? createClient(url, key) : null;

type Casino = {
  id:string; slug:string; name:string; logo_url:string|null; website_url:string|null; affiliate_url:string|null;
  operator_type:"sportsbook"|"casino"|"both"; short_description:string; bonus_text:string; cashback_text:string;
  payment_methods:string[]; countries:string[]; license_text:string; tags:string[]; featured:boolean; active:boolean;
};

const empty: Omit<Casino,"id"> = {
  slug:"", name:"", logo_url:"", website_url:"", affiliate_url:"", operator_type:"both",
  short_description:"", bonus_text:"", cashback_text:"", payment_methods:[], countries:[], license_text:"",
  tags:[], featured:false, active:true
};

export default function AdminPanel() {
  const [user,setUser]=useState<User|null>(null);
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [casinos,setCasinos]=useState<Casino[]>([]); const [form,setForm]=useState<any>(empty);
  const [editing,setEditing]=useState<string|null>(null); const [message,setMessage]=useState("");
  const [search,setSearch]=useState("");

  useEffect(()=>{ if(!db) return; db.auth.getUser().then(({data})=>setUser(data.user)); const {data:sub}=db.auth.onAuthStateChange((_e,s)=>setUser(s?.user??null)); return ()=>sub.subscription.unsubscribe(); },[]);
  useEffect(()=>{ if(user) load(); },[user]);

  async function load(){ if(!db) return; const {data,error}=await db.from("betbass_casinos").select("*").order("sort_order").order("name"); if(error)setMessage(error.message); else setCasinos(data??[]); }

  async function signIn(e:FormEvent){e.preventDefault(); if(!db)return; setMessage("Signing in…"); const {error}=await db.auth.signInWithPassword({email,password}); setMessage(error?.message??"Signed in.");}
  async function signOut(){await db?.auth.signOut();setCasinos([]);}

  function edit(c:Casino){setEditing(c.id);setForm({...c});window.scrollTo({top:0,behavior:"smooth"});}
  function newCasino(){setEditing(null);setForm(empty);window.scrollTo({top:0,behavior:"smooth"});}
  function split(v:string){return v.split(",").map(x=>x.trim()).filter(Boolean);}
  async function save(e:FormEvent){
    e.preventDefault(); if(!db)return;
    const payload={...form, tags:typeof form.tags==="string"?split(form.tags):form.tags, countries:typeof form.countries==="string"?split(form.countries):form.countries, payment_methods:typeof form.payment_methods==="string"?split(form.payment_methods):form.payment_methods, slug:form.slug.trim()||form.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")};
    const q=editing?db.from("betbass_casinos").update(payload).eq("id",editing):db.from("betbass_casinos").insert(payload);
    const {error}=await q; setMessage(error?.message??"Saved successfully."); if(!error){await load();newCasino();}
  }
  async function remove(id:string){if(!db||!confirm("Delete this platform?"))return;const {error}=await db.from("betbass_casinos").delete().eq("id",id);setMessage(error?.message??"Deleted.");if(!error)load();}

  const filtered=useMemo(()=>casinos.filter(c=>[c.name,c.slug].join(" ").toLowerCase().includes(search.toLowerCase())),[casinos,search]);

  if(!url||!key) return <main className="min-h-screen grid place-items-center p-6"><div className="glass max-w-lg rounded-3xl p-8"><h1 className="text-2xl font-black">Admin configuration required</h1><p className="mt-3 text-white/55">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to Vercel environment variables.</p></div></main>;

  if(!user) return <main className="min-h-screen grid place-items-center p-6"><form onSubmit={signIn} className="glass w-full max-w-md rounded-3xl p-8"><div className="text-2xl font-black">Bet<span className="gradient-text">Bass</span> Admin</div><p className="mt-2 text-sm text-white/45">Secure operator directory management.</p><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" className="mt-7 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"/><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"/><button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 font-bold text-black">Sign in</button>{message&&<p className="mt-4 text-sm text-white/50">{message}</p>}</form></main>;

  return <main className="min-h-screen px-5 py-7 md:px-8"><div className="mx-auto max-w-7xl">
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold tracking-[.25em] text-violet-300">BETBASS CONTROL CENTER</p><h1 className="mt-2 text-4xl font-black">Affiliate Directory</h1><p className="mt-2 text-white/45">Manage cards, offers, GEOs and affiliate links.</p></div><div className="flex gap-2"><button onClick={newCasino} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black">+ Add platform</button><button onClick={signOut} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">Sign out</button></div></header>
    {message&&<div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">{message}</div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={save} className="glass rounded-3xl p-6 lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editing?"Edit platform":"Add platform"}</h2>{editing&&<button type="button" onClick={newCasino} className="text-xs text-white/40">Cancel</button>}</div>
        <div className="mt-5 space-y-3">
          {([["name","Platform name"],["slug","Slug"],["logo_url","Logo URL"],["website_url","Official website URL"],["affiliate_url","Affiliate tracking URL"],["bonus_text","Bonus / offer text"],["cashback_text","Cashback text"],["license_text","License / regulation"],["countries","Countries (comma separated)"],["payment_methods","Payments (comma separated)"],["tags","Tags (comma separated)"]] as const).map(([k,label])=><div key={k}><label className="mb-1 block text-xs text-white/40">{label}</label><input value={Array.isArray(form[k])?form[k].join(", "):form[k]??""} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-violet-400/40"/></div>)}
          <div><label className="mb-1 block text-xs text-white/40">Type</label><select value={form.operator_type} onChange={e=>setForm({...form,operator_type:e.target.value})} className="w-full rounded-xl border border-white/10 bg-[#101024] px-3 py-2.5 text-sm"><option value="both">Sportsbook + Casino</option><option value="sportsbook">Sportsbook</option><option value="casino">Casino</option></select></div>
          <div className="flex gap-5 text-sm"><label><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured</label><label><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Active</label></div>
        </div>
        <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-300 px-4 py-3 font-bold text-black">{editing?"Update platform":"Create platform"}</button>
      </form>
      <section className="glass rounded-3xl p-6"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><h2 className="text-xl font-bold">{casinos.length} platforms</h2><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search directory…" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none"/></div>
        <div className="mt-5 space-y-3">{filtered.map(c=><div key={c.id} className="rounded-2xl border border-white/8 bg-white/[.03] p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-bold">{c.name.slice(0,2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b>{c.name}</b><span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/45">{c.operator_type}</span>{c.featured&&<span className="rounded-full bg-violet-400/10 px-2 py-1 text-[10px] text-violet-200">featured</span>}</div><p className="mt-1 truncate text-xs text-white/35">{c.affiliate_url||"Affiliate link not added"}</p></div><div className="flex gap-2"><button onClick={()=>edit(c)} className="rounded-xl border border-white/10 px-3 py-2 text-xs">Edit</button><button onClick={()=>remove(c.id)} className="rounded-xl border border-red-400/15 px-3 py-2 text-xs text-red-200">Delete</button></div></div></div>)}</div>
      </section>
    </div>
  </div></main>;
}
