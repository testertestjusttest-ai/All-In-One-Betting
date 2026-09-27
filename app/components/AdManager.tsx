"use client";
import { useEffect } from "react";
export default function AdManager({ zone = "banner" }: { zone?: "banner"|"vignette"|"inpage"|"multitag" }) {
  const code = zone==="banner" ? process.env.NEXT_PUBLIC_MONETAG_BANNER_CODE : zone==="vignette" ? process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_CODE : zone==="inpage" ? process.env.NEXT_PUBLIC_MONETAG_INPAGE_PUSH_CODE : process.env.NEXT_PUBLIC_MONETAG_MULTITAG_CODE;
  useEffect(()=>{ if(!code) return; const id="monetag-"+zone; if(document.getElementById(id)) return; const wrap=document.createElement("div"); wrap.id=id; wrap.innerHTML=code; document.body.appendChild(wrap); return()=>wrap.remove(); },[code,zone]);
  if(!code) return null;
  return <div className="my-6 min-h-10" aria-label="Advertisement" />;
}
