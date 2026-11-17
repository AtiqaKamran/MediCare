import { useEffect, useRef, useState } from "react";
import { X, Send, HeartPulse, LoaderCircle, Plus, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function DoctorChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { language } = useLanguage();
  const isUrdu = language === "ur";
  const listRef = useRef(null);
  const welcome = isUrdu
    ? "السلام علیکم! میں MediCare کا AI ڈاکٹر معاون ہوں۔ آپ اپنی صحت سے متعلق کیا جاننا چاہتے ہیں؟"
    : "Assalam-o-Alaikum! I'm MediCare AI Doctor. Ask me a health question and I'll explain it in simple language.";

  useEffect(() => {
    if (!user?.id) {
      setMessages([]);
      setConversationId(null);
      return;
    }
    let active = true;
    setHistoryLoading(true);
    (async () => {
      try {
        const { data: conversations, error: listError } = await supabase
          .from("ai_chat_conversations").select("id")
          .eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1);
        if (listError) throw listError;
        let current = conversations?.[0];
        if (!current) {
          const { data, error: createError } = await supabase.from("ai_chat_conversations")
            .insert({ user_id: user.id, title: "New chat" }).select("id").single();
          if (createError) throw createError;
          current = data;
        }
        const { data, error: messagesError } = await supabase.from("ai_chat_messages")
          .select("id,role,content,created_at,response_time_ms")
          .eq("user_id", user.id).eq("conversation_id", current.id)
          .order("created_at", { ascending: true }).limit(100);
        if (messagesError) throw messagesError;
        if (active) {
          setConversationId(current.id);
          setMessages(data || []);
          setError("");
        }
      } catch (err) {
        if (active) setError(err.message || "Chat history could not be loaded.");
      } finally {
        if (active) setHistoryLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function startNewChat() {
    if (!user?.id || loading) return;
    setError("");
    setHistoryLoading(true);
    try {
      const { data, error: createError } = await supabase.from("ai_chat_conversations")
        .insert({ user_id: user.id, title: "New chat" }).select("id").single();
      if (createError) throw createError;
      setConversationId(data.id);
      setMessages([]);
    } catch (err) {
      setError(err.message || "Could not start a new chat.");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function openChat() {
    setIsOpen(true);
    if (user?.id) await startNewChat();
  }

  async function send(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading || !user?.id) return;
    setMessage("");
    setError("");
    setLoading(true);
    let activeConversation = conversationId;
    try {
      if (!activeConversation) {
        const { data, error: createError } = await supabase.from("ai_chat_conversations")
          .insert({ user_id: user.id, title: text.slice(0, 48) }).select("id").single();
        if (createError) throw createError;
        activeConversation = data.id;
        setConversationId(activeConversation);
      }
      const optimistic = { role: "user", content: text, id: crypto.randomUUID() };
      setMessages(old => [...old, optimistic]);
      const { error: saveUserError } = await supabase.from("ai_chat_messages").insert({
        user_id: user.id, conversation_id: activeConversation, role: "user", content: text
      });
      if (saveUserError) throw saveUserError;
      await supabase.from("ai_chat_conversations").update({
        title: text.slice(0, 48), updated_at: new Date().toISOString()
      }).eq("id", activeConversation).eq("user_id", user.id);
      const started = performance.now();
      const { data, error: fnError } = await supabase.functions.invoke("medicare-ai", {
        body: { mode: "chat", message: text, language }
      });
      if (fnError) {
        let detail = fnError.message;
        try {
          const payload = await fnError.context?.json?.();
          if (payload?.error) detail = payload.error;
        } catch {}
        throw new Error(detail || "MediCare AI is temporarily unavailable.");
      }
      if (data?.error) throw new Error(data.error);
      if (!data?.answer) throw new Error("MediCare AI returned an empty answer.");
      const elapsed = Math.max(1, Math.round(performance.now() - started));
      const { data: saved, error: saveError } = await supabase.from("ai_chat_messages")
        .insert({
          user_id: user.id, conversation_id: activeConversation,
          role: "assistant", content: data.answer, response_time_ms: elapsed
        }).select("id,role,content,created_at,response_time_ms").single();
      if (saveError) throw saveError;
      setMessages(old => [...old, saved]);
    } catch (err) {
      setError(err.message || (isUrdu ? "جواب حاصل نہیں ہو سکا۔ دوبارہ کوشش کریں۔" : "MediCare AI couldn't respond. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return <div className="fixed bottom-4 right-3 z-[9999] sm:bottom-6 sm:right-6">
    {!isOpen ? <button onClick={openChat} aria-label="Open MediCare Mini Doctor"
      className="group relative flex flex-col items-center touch-manipulation animate-[medicare-float_3s_ease-in-out_infinite]">
      <span className="mb-2 rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white opacity-100 shadow-lg transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {isUrdu ? "اپنے ڈاکٹر سے پوچھیں!" : "Ask your doctor!"}
      </span>
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-100 to-blue-200 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F5CBA7] shadow-inner sm:h-14 sm:w-14">
          <div className="absolute -top-1 h-4 w-9 rounded-t-full bg-gray-800 sm:h-5 sm:w-12"/>
          <div className="mt-1 flex gap-3"><span className="h-1.5 w-1.5 rounded-full bg-gray-800"/><span className="h-1.5 w-1.5 rounded-full bg-gray-800"/></div>
          <div className="absolute top-7 h-1.5 w-3 rounded-full border-b-2 border-gray-700 sm:top-9"/>
          <div className="absolute -bottom-4 flex h-5 w-10 items-center justify-center rounded-t-xl border border-gray-200 bg-white sm:-bottom-5 sm:h-6 sm:w-12">
            <span className="text-[9px] font-black tracking-wide text-teal-700">M+</span>
          </div>
        </div>
        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 sm:h-4 sm:w-4"/>
      </div>
      <span className="mt-2 text-[10px] font-bold text-teal-700 dark:text-teal-300 sm:text-xs">AI Doctor</span>
    </button> : <section className="flex h-[min(620px,calc(100dvh-28px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" dir={isUrdu ? "rtl" : "ltr"}>
      <header className="flex items-center justify-between bg-gradient-to-r from-teal-800 to-teal-600 p-3 text-white sm:p-4">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><HeartPulse size={23}/></div>
          <div><h3 className="font-bold">MediCare AI Doctor</h3><p className="text-xs text-teal-100">{isUrdu ? "آپ کا صحت معلومات معاون" : "Your personal health assistant"}</p></div>
        </div>
        <div className="flex items-center gap-1">
          {user && <button type="button" onClick={startNewChat} disabled={loading || historyLoading} title={isUrdu ? "نئی چیٹ" : "New chat"} className="rounded-lg p-2 hover:bg-white/15 disabled:opacity-40"><Plus size={19}/></button>}
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot" className="rounded-lg p-2 hover:bg-white/15"><X size={20}/></button>
        </div>
      </header>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-teal-50 p-3 leading-6 text-slate-800 dark:bg-slate-800 dark:text-slate-100">{welcome}</div>
        {!user && <div className="rounded-xl bg-teal-50 p-4 text-sm text-slate-800 dark:bg-slate-800 dark:text-white">Sign in or create an account to chat with MediCare AI.<div className="mt-3 flex gap-2"><Link to="/login" className="rounded-lg bg-teal-700 px-4 py-2 text-white">Log in</Link><Link to="/signup" className="rounded-lg border border-teal-700 px-4 py-2">Sign up</Link></div></div>}
        {historyLoading && <p className="text-xs text-slate-500">Loading chat...</p>}
        {messages.map((m,i)=><div key={m.id || i} className={m.role === "user" ? "ml-auto max-w-[90%]" : "max-w-[90%]"}>
          <div className={`whitespace-pre-wrap rounded-2xl p-3 leading-6 ${m.role === "user" ? "rounded-tr-sm bg-teal-700 text-white" : "rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>{m.content}</div>
          {m.role === "assistant" && m.response_time_ms != null && <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><Clock3 size={11}/>{(m.response_time_ms / 1000).toFixed(1)} sec</p>}
        </div>)}
        {loading && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin"/>{isUrdu ? "جواب تیار ہو رہا ہے..." : "MediCare AI is preparing your answer..."}</div>}
        {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">{error}</p>}
      </div>
      <p className="px-3 pb-2 text-[10px] text-slate-500">{isUrdu ? "MediCare AI کا جواب Gemini AI سروس سے تیار ہوتا ہے۔ یہ عمومی معلومات ہیں، طبی تشخیص نہیں۔" : "MediCare AI uses Google Gemini as its backend AI engine. General information only — not a medical diagnosis. Avoid sharing identifying patient details."}</p>
      {user ? <form onSubmit={send} className="flex shrink-0 gap-2 border-t p-3 dark:border-slate-700">
        <input value={message} onChange={e=>setMessage(e.target.value)} placeholder={isUrdu ? "اپنا سوال لکھیں..." : "Ask MediCare AI a health question..."} className="min-w-0 flex-1 rounded-xl border bg-transparent px-3 py-3 text-sm outline-none focus:border-teal-600 dark:border-slate-700"/>
        <button disabled={loading || !message.trim()} aria-label="Send message" className="rounded-xl bg-teal-700 px-4 text-white disabled:opacity-40"><Send size={18}/></button>
      </form> : <p className="border-t p-3 text-center text-xs text-slate-500 dark:border-slate-700">Sign in to start a private chat.</p>}
    </section>}
    <style>{`@keyframes medicare-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
  </div>;
}
