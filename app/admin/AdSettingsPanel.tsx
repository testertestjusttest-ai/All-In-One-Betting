"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Settings = {
  id?: string;
  enabled: boolean;
  multitag_code: string;
  vignette_code: string;
  in_page_push_code: string;
  tag_code_a: string;
  tag_code_b: string;
  direct_link: string;
};

const defaults: Settings = {
  enabled: true,
  multitag_code: "",
  vignette_code: "",
  in_page_push_code: "",
  tag_code_a: "",
  tag_code_b: "",
  direct_link: ""
};

export default function AdSettingsPanel() {
  const [form, setForm] = useState<Settings>(defaults);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("betbass_ad_settings").select("*").eq("provider","monetag").order("updated_at",{ascending:false}).limit(1).maybeSingle()
      .then(({data,error}) => {
        if (error) setMessage(error.message);
        else if (data) setForm({
          id:data.id, enabled:Boolean(data.enabled), multitag_code:data.multitag_code??"",
          vignette_code:data.vignette_code??"", in_page_push_code:data.in_page_push_code??"",
          tag_code_a:data.tag_code_a??"", tag_code_b:data.tag_code_b??"", direct_link:data.direct_link??""
        });
        setLoading(false);
      });
  }, []);

  async function save() {
    setMessage("Saving…");
    const payload = {
      provider:"monetag", enabled:form.enabled, multitag_code:form.multitag_code||null,
      vignette_code:form.vignette_code||null, in_page_push_code:form.in_page_push_code||null,
      tag_code_a:form.tag_code_a||null, tag_code_b:form.tag_code_b||null, direct_link:form.direct_link||null,
      updated_at:new Date().toISOString()
    };
    const q=form.id
      ? supabase.from("betbass_ad_settings").update(payload).eq("id",form.id)
      : supabase.from("betbass_ad_settings").insert(payload);
    const {error}=await q;
    setMessage(error?.message ?? "Ad settings saved. Refresh the public site to reload ad scripts.");
  }

  const fields=[
    ["multitag_code","MultiTag code"],
    ["vignette_code","Vignette Banner code"],
    ["in_page_push_code","In-Page Push code"],
    ["tag_code_a","Additional tag — zone 11907043"],
    ["tag_code_b","Additional tag — zone 11907045"],
    ["direct_link","Direct Link URL"]
  ] as const;

  if (loading) return <section className="glass mt-6 rounded-3xl p-6">Loading ad settings…</section>;

  return <section className="glass mt-6 rounded-3xl p-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">MONETAG ADS</p><h2 className="mt-1 text-2xl font-bold">Ad manager</h2><p className="mt-1 text-sm text-white/40">Enable/disable the configured scripts without editing the site code.</p></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={e=>setForm({...form,enabled:e.target.checked})}/> Ads enabled</label>
    </div>
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {fields.map(([key,label])=><label key={key} className="block"><span className="mb-1 block text-xs text-white/40">{label}</span><textarea rows={key==="direct_link"?2:4} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-mono outline-none focus:border-violet-400/40"/></label>)}
    </div>
    <button onClick={save} className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black">Save ad settings</button>
    {message&&<p className="mt-3 text-sm text-white/50">{message}</p>}
  </section>;
}
