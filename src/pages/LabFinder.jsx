import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FlaskConical, MapPin, Phone, Search, Home, ExternalLink, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeatureNavbar from "../components/FeatureNavbar";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const copy = {
  en: {
    title:"Find a Laboratory for Your Test",sub:"Search diagnostic labs by test, city and area — including home sample collection.",
    test:"Test name",city:"City",area:"Area",search:"Find labs",back:"Dashboard",home:"Home sample collection",
    homeOnly:"Show only labs offering home sample collection",homeBadge:"Home sample collection",
    homeFree:"Free collection (confirm at booking)",call:"Call to book",coverage:"Coverage: call to confirm your exact area",
    noLabs:"No matching laboratories found. Try another area or city.",noTests:"Test availability is not listed for this laboratory; call to confirm.",
    statusAvailable:"Test listed as available",statusUnavailable:"Test listed as unavailable",unknown:"Call to confirm test availability",
    note:"Listings are directory information, not live appointments. Confirm test availability, fasting requirements, home-collection coverage, fees and appointment time directly with the laboratory.",
    verified:"Directory listing",source:"Official home collection details",suggest:"Popular tests"
  },
  ur: {
    title:"ٹیسٹ کے لیے لیبارٹری تلاش کریں",sub:"ٹیسٹ، شہر اور علاقے کے مطابق لیب تلاش کریں، گھر سے سیمپل لینے والی لیبز بھی۔",
    test:"ٹیسٹ کا نام",city:"شہر",area:"علاقہ",search:"لیب تلاش کریں",back:"ڈیش بورڈ",home:"گھر سے سیمپل کلیکشن",
    homeOnly:"صرف گھر سے سیمپل لینے والی لیبز دکھائیں",homeBadge:"گھر سے سیمپل کلیکشن",
    homeFree:"مفت کلیکشن (بکنگ پر تصدیق کریں)",call:"بکنگ کے لیے کال کریں",coverage:"علاقے کی تصدیق فون پر کریں",
    noLabs:"اس علاقے میں لیب نہیں ملی۔ دوسرا علاقہ یا شہر آزمائیں۔",noTests:"اس لیب کے لیے ٹیسٹ کی دستیابی درج نہیں، فون پر تصدیق کریں۔",
    statusAvailable:"ٹیسٹ دستیاب درج ہے",statusUnavailable:"ٹیسٹ دستیاب نہیں درج ہے",unknown:"ٹیسٹ کی دستیابی فون پر معلوم کریں",
    note:"یہ ڈائریکٹری ہے، لائیو اپائنٹمنٹ نہیں۔ ٹیسٹ، فاسٹنگ، گھر سے سیمپل کی کوریج، فیس اور وقت کی تصدیق لیب سے کریں۔",
    verified:"ڈائریکٹری لسٹنگ",source:"گھر سے سیمپل کی سرکاری معلومات",suggest:"عام ٹیسٹ"
  }
};

export default function LabFinder() {
  const nav=useNavigate();
  const {language}=useLanguage();
  const t=copy[language==="ur"?"ur":"en"];
  const [test,setTest]=useState("");
  const [city,setCity]=useState("Lahore");
  const [area,setArea]=useState("");
  const [homeOnly,setHomeOnly]=useState(false);
  const [tests,setTests]=useState([]);
  const [labs,setLabs]=useState([]);
  const [availability,setAvailability]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searched,setSearched]=useState(false);

  useEffect(()=>{
    let active=true;
    (async()=>{
      setLoading(true);
      const [testResult,labResult,availabilityResult]=await Promise.all([
        supabase.from("lab_tests").select("id,test_name,category").order("test_name"),
        supabase.from("laboratories").select("id,name,city,area,address,phone,website,verified,home_sample_collection,home_collection_areas,home_collection_fee,home_collection_phone,home_collection_notes,home_collection_source_url,last_verified_at").order("name"),
        supabase.from("lab_test_availability").select("lab_id,test_id,availability_status,last_verified_at")
      ]);
      if(active){
        setTests(testResult.data||[]);
        setLabs(labResult.data||[]);
        setAvailability(availabilityResult.data||[]);
        setLoading(false);
      }
    })();
    return()=>{active=false};
  },[]);

  const suggestions=useMemo(()=>tests.filter(x=>x.test_name.toLowerCase().includes(test.toLowerCase())).slice(0,8),[tests,test]);

  const results=useMemo(()=>{
    const cityLabs=labs.filter(lab=>(!city||lab.city?.toLowerCase()===city.trim().toLowerCase())
      &&(!area||lab.area?.toLowerCase().includes(area.trim().toLowerCase())
        ||(lab.home_collection_areas||[]).some(a=>a.toLowerCase().includes(area.trim().toLowerCase()))
        ||(lab.home_sample_collection && (lab.home_collection_areas||[]).length===0))
      &&(!homeOnly||lab.home_sample_collection));
    if(!test.trim()) return cityLabs.map(lab=>({lab,status:null,verifiedAt:lab.last_verified_at}));
    const matching=tests.filter(x=>x.test_name.toLowerCase().includes(test.trim().toLowerCase()));
    const testIds=new Set(matching.map(x=>x.id));
    return cityLabs.map(lab=>{
      const item=availability.find(a=>a.lab_id===lab.id&&testIds.has(a.test_id));
      return {lab,status:item?.availability_status||null,verifiedAt:item?.last_verified_at||lab.last_verified_at};
    });
  },[labs,city,area,homeOnly,test,tests,availability]);

  function search(){setSearched(true);}

  return <main dir={language==="ur"?"rtl":"ltr"} className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6">
    <FeatureNavbar title={t.title} accent="blue" isUrdu={language==="ur"} />
    <div className="mx-auto max-w-5xl">
      <header className="rounded-3xl border border-sky-300 bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200 p-6 text-slate-800 shadow-sm dark:border-sky-900/40 dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-blue-950/40 dark:text-slate-100 sm:p-8"><FlaskConical size={32}/><h1 className="mt-3 text-3xl font-black">{t.title}</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.sub}</p></header>
      <section className="my-5 grid gap-3 rounded-2xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
        <label className="text-sm font-semibold">{t.test}<input value={test} onChange={e=>setTest(e.target.value)} placeholder="CBC, Vitamin D, HbA1c..." className="mt-1 w-full rounded-xl border bg-transparent p-3 dark:border-slate-700"/></label>
        <label className="text-sm font-semibold">{t.city}<input value={city} onChange={e=>setCity(e.target.value)} placeholder="Lahore" className="mt-1 w-full rounded-xl border bg-transparent p-3 dark:border-slate-700"/></label>
        <label className="text-sm font-semibold">{t.area}<input value={area} onChange={e=>setArea(e.target.value)} placeholder="Johar Town, G-8..." className="mt-1 w-full rounded-xl border bg-transparent p-3 dark:border-slate-700"/></label>
        <label className="flex items-center gap-2 text-sm sm:col-span-3"><input type="checkbox" checked={homeOnly} onChange={e=>setHomeOnly(e.target.checked)}/><Home size={16} className="text-teal-700"/>{t.homeOnly}</label>
        <button onClick={search} className="rounded-xl bg-teal-700 px-5 py-3 font-bold text-white sm:col-span-3"><Search size={17} className="inline"/> {t.search}</button>
        {suggestions.length>0&&test&&<div className="flex flex-wrap gap-2 sm:col-span-3">{suggestions.map(x=><button key={x.id} onClick={()=>setTest(x.test_name)} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">{x.test_name}</button>)}</div>}
      </section>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{homeOnly?t.home:t.search}</h2><span className="text-xs text-slate-500">{results.length} {language==="ur"?"نتائج":"results"}</span></div>
      {loading?<p className="rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">Loading laboratory directory...</p>:results.length===0?<p className="rounded-2xl border border-dashed p-7 text-center text-slate-500 dark:border-slate-700">{searched?t.noLabs:t.noLabs}</p>:
        <div className="grid gap-3 sm:grid-cols-2">{results.map(({lab,status,verifiedAt})=><article key={lab.id} className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-2"><div><h3 className="font-bold">{lab.name}</h3><p className="mt-1 text-sm text-slate-500">{lab.area||"Area not specified"} · {lab.city}</p></div>{lab.verified&&<span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300"><BadgeCheck size={13}/>{t.verified}</span>}</div>
          {lab.address&&<p className="mt-2 text-sm"><MapPin size={14} className="mr-1 inline"/> {lab.address}</p>}
          {test&&<p className="mt-3 text-sm font-semibold">{status==="available"?t.statusAvailable:status==="unavailable"?t.statusUnavailable:t.unknown}</p>}
          {lab.home_sample_collection&&<div className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-teal-900 dark:bg-teal-950/40 dark:text-teal-100"><p className="flex items-center gap-2 font-bold"><Home size={16}/>{t.homeBadge}</p><p className="mt-1 text-xs">{lab.home_collection_notes||t.coverage}</p>{lab.home_collection_fee===0&&<p className="mt-1 text-xs font-semibold">{t.homeFree}</p>}{lab.home_collection_areas?.length>0?<p className="mt-1 text-xs">{lab.home_collection_areas.join(", ")}</p>:<p className="mt-1 text-xs">{t.coverage}</p>}</div>}
          <div className="mt-4 flex flex-wrap gap-3">{(lab.home_collection_phone||lab.phone)&&<a href={'tel:'+(lab.home_collection_phone||lab.phone).replace(/[^+0-9]/g,'')} className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300"><Phone size={15}/>{t.call}</a>}{lab.website&&<a href={lab.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-teal-700 underline dark:text-teal-300"><ExternalLink size={14}/>Website</a>}{lab.home_collection_source_url&&<a href={lab.home_collection_source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-teal-700 underline dark:text-teal-300"><ExternalLink size={14}/>{t.source}</a>}</div>
          {verifiedAt&&<p className="mt-3 text-[10px] text-slate-400">Last checked: {new Date(verifiedAt).toLocaleDateString()}</p>}
        </article>)}</div>}
      <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">{t.note}</p>
    </div>
  </main>;
}
