import { useState } from "react";
import { ArrowLeft, FileSearch, Upload, LoaderCircle, Save, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const copy = {
  en: {
    title: "AI Health Report Scanner",
    sub: "Upload a clear lab report or medical document. MediCare AI will explain the visible information in simple words.",
    back: "Dashboard", choose: "Choose report", analyze: "Scan and explain", working: "Reading your report...",
    empty: "Choose a PDF, JPG or PNG file up to 6 MB.", summary: "Simple explanation",
    disclaimer: "AI can misread scans and cannot diagnose. Check values and reference ranges with your clinician. Do not use this for emergencies.",
    consent: "I understand this report is sent to Google Gemini. On the free tier, submitted content may be used to improve Google products. I have removed names, phone numbers, CNIC and other identifiers, and will only use a redacted/sample report.",
    consentRequired: "Please confirm the privacy notice before sending your report.",
    saved: "Your report and explanation have been saved to your private health records.",
    analyzedNotSaved: "The report was analyzed, but could not be saved to your private records.",
    failed: "Could not analyze this report.", noFile: "Please choose a report first.",
    login: "Please sign in to use the report scanner.", history: "Saved report explanations"
  },
  ur: {
    title: "AI میڈیکل رپورٹ اسکینر",
    sub: "لیب رپورٹ یا میڈیکل دستاویز اپ لوڈ کریں۔ MediCare AI نظر آنے والی معلومات آسان اردو میں سمجھائے گا۔",
    back: "ڈیش بورڈ", choose: "رپورٹ منتخب کریں", analyze: "اسکین اور وضاحت کریں", working: "رپورٹ پڑھی جا رہی ہے...",
    empty: "6 MB تک PDF، JPG یا PNG فائل منتخب کریں۔", summary: "آسان وضاحت",
    disclaimer: "AI رپورٹ غلط پڑھ سکتا ہے اور تشخیص نہیں کر سکتا۔ نتائج ڈاکٹر سے ضرور چیک کروائیں۔ ایمرجنسی میں اس ٹول پر انحصار نہ کریں۔",
    consent: "میں سمجھتا/سمجھتی ہوں کہ رپورٹ Google Gemini کو بھیجی جائے گی۔ مفت ورژن میں بھیجا گیا مواد Google کی مصنوعات بہتر بنانے کے لیے استعمال ہو سکتا ہے۔ میں صرف شناختی معلومات سے پاک یا نمونہ رپورٹ استعمال کروں گا/گی۔",
    consentRequired: "رپورٹ بھیجنے سے پہلے رازداری کی ہدایت کی تصدیق کریں۔",
    saved: "رپورٹ اور وضاحت آپ کے نجی طبی ریکارڈ میں محفوظ ہو گئی۔",
    analyzedNotSaved: "رپورٹ کا تجزیہ ہو گیا، لیکن اسے نجی ریکارڈ میں محفوظ نہیں کیا جا سکا۔",
    failed: "رپورٹ کا تجزیہ نہیں ہو سکا۔", noFile: "پہلے رپورٹ منتخب کریں۔",
    login: "رپورٹ اسکینر استعمال کرنے کے لیے لاگ اِن کریں۔", history: "محفوظ شدہ رپورٹ کی وضاحتیں"
  }
};

export default function ReportScanner() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = copy[language === "ur" ? "ur" : "en"];
  const [file, setFile] = useState(null);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [reportId, setReportId] = useState(null);
  const [consent, setConsent] = useState(false);

  async function analyze() {
    if (!user?.id) { setNotice(t.login); return; }
    if (!file) { setNotice(t.noFile); return; }
    if (!consent) { setNotice(t.consentRequired); return; }
    setBusy(true); setNotice(""); setAnswer(""); setReportId(null);
    let uploadedPath = null;
    try {
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) throw new Error(t.empty);
      if (file.size > 6 * 1024 * 1024) throw new Error(t.empty);

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to read the selected file."));
        reader.readAsDataURL(file);
      });
      const base64 = String(dataUrl).split(",")[1];
      const { data, error } = await supabase.functions.invoke("medicare-ai", {
        body: {
          mode: "analyze", language,
          message: "Explain this medical report in simple words. Extract only values you can read. Highlight results outside printed reference ranges without diagnosing.",
          file: { mimeType: file.type, data: base64 }
        }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.answer) throw new Error(t.failed);

      // Show the analysis on this page immediately; saving is a separate step.
      setAnswer(data.answer);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      uploadedPath = user.id + "/" + crypto.randomUUID() + "/" + safeName;
      const { error: uploadError } = await supabase.storage.from("medical-records")
        .upload(uploadedPath, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data: doc, error: docError } = await supabase.from("medical_documents").insert({
        user_id: user.id, bucket_id: "medical-records", storage_path: uploadedPath,
        file_name: file.name, mime_type: file.type, file_size_bytes: file.size,
        document_type: "lab_report", description: "Uploaded via AI Health Report Scanner"
      }).select("id").single();
      if (docError) throw docError;

      const { data: saved, error: saveError } = await supabase.from("health_reports").insert({
        user_id: user.id, document_id: doc.id, title: file.name,
        report_text: data.answer, extracted_text: null,
        simple_summary: data.answer, findings: []
      }).select("id").single();
      if (saveError) throw saveError;
      setReportId(saved.id);
      setNotice(t.saved);
    } catch (e) {
      console.error("Report scanner:", e);
      setNotice((e?.message || t.failed) + (answer ? " " + t.analyzedNotSaved : ""));
      if (uploadedPath) {
        await supabase.storage.from("medical-records").remove([uploadedPath]).catch(() => {});
      }
    } finally {
      setBusy(false);
    }
  }

  return <main dir={language === "ur" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6">
    <div className="mx-auto max-w-4xl">
      <button onClick={() => nav("/dashboard")} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300"><ArrowLeft size={18}/>{t.back}</button>
      <header className="rounded-3xl bg-gradient-to-r from-violet-900 to-indigo-700 p-6 text-white sm:p-8">
        <FileSearch size={32}/><h1 className="mt-3 text-3xl font-black">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-50">{t.sub}</p>
      </header>
      <section className="my-6 rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
          <Upload size={30} className="text-teal-600"/><span className="mt-3 font-bold">{t.choose}</span><span className="mt-1 text-xs text-slate-500">{t.empty}</span>
          <input type="file" accept=".pdf,image/jpeg,image/png" onChange={e => { setFile(e.target.files?.[0] || null); setAnswer(""); setNotice(""); setReportId(null); }} className="sr-only"/>
        </label>
        {file && <p className="mt-3 break-all text-sm font-semibold">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
        <label className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1"/><span>{t.consent}</span></label>
        <button disabled={!file || busy} onClick={analyze} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white disabled:opacity-50"><FileSearch size={18}/>{busy ? t.working : t.analyze}{busy && <LoaderCircle size={17} className="animate-spin"/>}</button>
      </section>
      {notice && <p role="status" className="my-4 rounded-xl bg-teal-50 p-4 text-sm text-teal-900 dark:bg-teal-950/40 dark:text-teal-100">{notice}</p>}
      {answer && <section className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7"><h2 className="mb-4 text-xl font-extrabold">{t.summary}</h2><div className="whitespace-pre-wrap text-sm leading-7">{answer}</div>{reportId && <p className="mt-4 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300"><Save size={15}/>{t.saved}</p>}</section>}
      <p className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><ShieldCheck className="mt-0.5 shrink-0"/>{t.disclaimer}</p>
    </div>
  </main>;
}
