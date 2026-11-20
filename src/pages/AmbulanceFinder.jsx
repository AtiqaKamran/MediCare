import { useEffect, useState } from "react";
import { Ambulance, MapPin, Phone, ShieldCheck, ExternalLink } from "lucide-react";
import FeatureNavbar from "../components/FeatureNavbar";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const copy = {
  en: {
    title: "Ambulance & Emergency Help", sub: "Find emergency transport and important emergency contacts.",
    city: "City", area: "Area", empty: "No verified area-specific ambulance listing is available yet.",
    ambulance: "Ambulance services", police: "Police emergency", policeText: "For immediate police assistance in Pakistan, call the police emergency helpline.",
    callPolice: "Call Police 15", callRescue: "Call Rescue 1122",
    note: "For life-threatening emergencies, call the relevant emergency service directly. Directory listings do not confirm live dispatch availability.",
    address: "Address", unverified: "Not independently verified"
  },
  ur: {
    title: "ایمبولینس اور ایمرجنسی مدد", sub: "ایمرجنسی ٹرانسپورٹ اور اہم ہنگامی رابطے تلاش کریں۔",
    city: "شہر", area: "علاقہ", empty: "ابھی علاقے کے مطابق تصدیق شدہ ایمبولینس لسٹنگ دستیاب نہیں۔",
    ambulance: "ایمبولینس سروسز", police: "پولیس ایمرجنسی", policeText: "پاکستان میں فوری پولیس مدد کے لیے پولیس ایمرجنسی ہیلپ لائن پر کال کریں۔",
    callPolice: "پولیس 15 پر کال کریں", callRescue: "ریسکیو 1122 پر کال کریں",
    note: "جان لیوا ایمرجنسی میں متعلقہ سروس کو براہ راست کال کریں۔ ڈائریکٹری لائیو ڈسپیچ کی تصدیق نہیں کرتی۔",
    address: "پتہ", unverified: "آزادانہ تصدیق نہیں ہوئی"
  }
};

export default function AmbulanceFinder() {
  const { language } = useLanguage();
  const t = copy[language === "ur" ? "ur" : "en"];
  const [city, setCity] = useState("Lahore");
  const [area, setArea] = useState("");
  const [rows, setRows] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      let query = supabase.from("ambulance_services").select("*")
        .eq("active", true).ilike("city", city).order("area").limit(100);
      if (area.trim()) query = query.ilike("area", `%${area.trim()}%`);
      const { data, error } = await query;
      if (!active) return;
      setRows(data || []);
      setLoadError(error?.message || "");
    })();
    return () => { active = false; };
  }, [city, area]);

  return (
    <main dir={language === "ur" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 px-4 pb-8 pt-6 dark:bg-slate-950 dark:text-white">
      <FeatureNavbar title={t.title} accent="orange" isUrdu={language === "ur"} />
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="relative overflow-hidden isolate rounded-3xl border border-orange-400 bg-gradient-to-r from-orange-300 via-amber-300 to-rose-300 p-6 text-slate-800 shadow-sm dark:border-orange-900/40 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-rose-950/40 dark:text-slate-100 sm:p-8">
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-orange-400/60 blur-[1px]"/>
          <Ambulance size={32}/>
          <h1 className="mt-3 text-3xl font-black">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t.sub}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 font-bold">{t.ambulance}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">{t.city}<input value={city} onChange={e=>setCity(e.target.value)} className="mt-1 w-full rounded-xl border bg-transparent p-3 dark:border-slate-700"/></label>
            <label className="text-sm font-medium">{t.area}<input value={area} onChange={e=>setArea(e.target.value)} placeholder="e.g. Gulberg" className="mt-1 w-full rounded-xl border bg-transparent p-3 dark:border-slate-700"/></label>
          </div>
        </section>

        {loadError && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Ambulance directory could not be loaded: {loadError}</p>}
        {rows.length ? <div className="grid gap-3 sm:grid-cols-2">{rows.map(item=><article key={item.id} className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold">{item.provider_name}</h3><p className="mt-1 text-sm text-slate-500"><MapPin size={14} className="inline"/> {item.area}, {item.city}</p>{item.address&&<p className="mt-2 text-sm">{item.address}</p>}{(item.phone||item.emergency_number)&&<a href={`tel:${item.phone||item.emergency_number}`} className="mt-3 inline-flex gap-2 font-bold text-teal-700 dark:text-teal-300"><Phone size={16}/>{item.phone||item.emergency_number}</a>}{!item.verified&&<p className="mt-2 text-xs text-amber-600">{t.unverified}</p>}</article>)}</div>:<p className="rounded-2xl border border-dashed p-6 text-center text-slate-500 dark:border-slate-700">{t.empty}</p>}

        <section className="rounded-3xl border border-sky-300 bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100 p-5 text-slate-800 shadow-sm dark:border-sky-900/50 dark:from-sky-950/40 dark:via-blue-950/30 dark:to-indigo-950/40 dark:text-slate-100 sm:p-6">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/80 p-3 text-sky-800 shadow-sm dark:bg-slate-900"><ShieldCheck size={27}/></div><div><h2 className="text-xl font-extrabold">{t.police}</h2><p className="mt-1 text-sm">{t.policeText}</p></div></div>
          <a href="tel:15" className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-800 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-sky-900"><Phone size={18}/>{t.callPolice}</a>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Pakistan Police Emergency: 15</p>
        </section>

        <a href="tel:1122" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-700 p-4 font-bold text-white hover:bg-red-800"><Phone size={18}/>{t.callRescue}</a>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">{t.note}</p>
      </div>
    </main>
  );
}
