import { useEffect, useRef, useState } from "react";
import { X, Send, Stethoscope, LoaderCircle, HeartPulse } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function DoctorChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { language } = useLanguage();
  const isUrdu = language === "ur";
  const listRef = useRef(null);
  const welcome = isUrdu
    ? "السلام علیکم! میں MediCare کا AI ڈاکٹر معاون ہوں۔ آپ اپنی صحت سے متعلق کیا جاننا چاہتے ہیں؟"
    : "Assalam-o-Alaikum! I'm MediCare AI Doctor. Ask me a health question and I'll explain it in simple language.";

  useEffect(() => {
    if (!user?.id) { setMessages([]); return; }
    let active = true;
    (async () => {
      const { data, error: loadError } = await supabase.from("ai_chat_messages")
        .select("id,role,content,created_at").eq("user_id", user.id)
        .order("created_at", { ascending: true }).limit(60);
      if (active) {
        if (loadError) setError(isUrdu ? "چیٹ ہسٹری لوڈ نہیں ہو سکی۔" : "Chat history could not be loaded.");
        else setMessages(data || []);
      }
    })();
    return () => { active = false; };
  }, [user?.id, isUrdu]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e) {
    e.preventDefault();
    const text = message.trim();
    if (!text || loading || !user?.id) return;
    setMessage(""); setError(""); setLoading(true);
    const optimistic = { role: "user", content: text, id: crypto.randomUUID() };
    setMessages(old => [...old, optimistic]);
    try {
      const { error: saveUserError } = await supabase.from("ai_chat_messages")
        .insert({ user_id: user.id, role: "user", content: text });
      if (saveUserError) throw saveUserError;
      const { data, error: fnError } = await supabase.functions.invoke("medicare-ai", {
        body: { mode: "chat", message: text, language }
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (!data?.answer) throw new Error("MediCare AI returned an empty answer.");
      const answer = data.answer;
      setMessages(old => [...old, { role: "assistant", content: answer, id: crypto.randomUUID() }]);
      const { error: saveError } = await supabase.from("ai_chat_messages")
        .insert({ user_id: user.id, role: "assistant", content: answer });
      if (saveError) console.error("Could not save assistant reply:", saveError.message);
    } catch (err) {
      setError(err.message || (isUrdu ? "جواب حاصل نہیں ہو سکا۔ دوبارہ کوشش کریں۔" : "MediCare AI couldn't respond. Please try again."));
    } finally { setLoading(false); }
  }

  if (!user) return null;

  return <div className="fixed bottom-4 right-3 z-[9999] sm:bottom-6 sm:right-6">
    {!isOpen ? <button onClick={() => setIsOpen(true)} aria-label="Open MediCare AI Doctor"
      className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-teal-800 text-white shadow-xl transition hover:scale-105">
      <Stethoscope size={27}/><span className="absolute -top-2 right-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">AI</span>
    </button> : <section className="flex h-[min(620px,calc(100dvh-28px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" dir={isUrdu ? "rtl" : "ltr"}>
      <header className="flex items-center justify-between bg-gradient-to-r from-teal-800 to-teal-600 p-4 text-white">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><HeartPulse size={23}/></div>
          <div><h3 className="font-bold">MediCare AI Doctor</h3><p className="text-xs text-teal-100">{isUrdu ? "آپ کا صحت معلومات معاون" : "Your personal health information assistant"}</p></div>
        </div><button type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot"><X/></button>
      </header>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-teal-50 p-3 leading-6 text-slate-800 dark:bg-slate-800 dark:text-slate-100">{welcome}</div>
        {messages.map((m,i)=><div key={m.id || i} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl p-3 leading-6 ${m.role === "user" ? "ml-auto rounded-tr-sm bg-teal-700 text-white" : "rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>{m.content}</div>)}
        {loading && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin"/>{isUrdu ? "جواب تیار ہو رہا ہے..." : "MediCare AI is preparing your answer..."}</div>}
        {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">{error}</p>}
      </div>
      <p className="px-3 pb-2 text-[10px] text-slate-500">{isUrdu ? "MediCare AI کا جواب Gemini AI سروس سے تیار ہوتا ہے۔ یہ عمومی معلومات ہیں، طبی تشخیص نہیں۔" : "MediCare AI uses Google Gemini as its backend AI engine. General information only — not a medical diagnosis. Avoid sharing identifying patient details."}</p>
      <form onSubmit={send} className="flex gap-2 border-t p-3 dark:border-slate-700">
        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder={isUrdu ? "اپنا سوال لکھیں..." : "Ask MediCare AI a health question..."} className="min-w-0 flex-1 rounded-xl border bg-transparent px-3 py-3 text-sm outline-none focus:border-teal-600 dark:border-slate-700"/>
        <button disabled={loading || !message.trim()} aria-label="Send message" className="rounded-xl bg-teal-700 px-4 text-white disabled:opacity-40"><Send size={18}/></button>
      </form>
    </section>}
  </div>;
}
