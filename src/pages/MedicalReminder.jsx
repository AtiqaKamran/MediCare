import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureNavbar from "../components/FeatureNavbar";
import {
  ArrowLeft, Bell, BellRing, Clock3, Pill, Plus, Trash2,
  Pencil, X, Utensils, CalendarDays, Info
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";


const TEXT = {
  en: {
    title: "Medicine Reminders", subtitle: "Stay on track with your medicines",
    add: "Add reminder", edit: "Edit reminder", medicine: "Medicine name",
    dose: "Dose / instructions", meal: "Meal timing", before: "Before meal",
    after: "After meal", with: "With meal", anytime: "Any time",
    custom: "Custom timing", time: "Reminder time", repeat: "Repeat",
    every: "Every day", selected: "Selected days", save: "Save reminder",
    cancel: "منسوخ کریں", noItems: "No reminders yet",
    noItemsText: "Add a medicine and choose the time that suits your routine.",
    notification: "Enable notifications", enabled: "Notifications enabled",
    blocked: "Notifications are blocked in your browser settings.",
    permission: "Allow browser notifications so MediCare can alert you while this website is open.",
    today: "Today's reminders", upcoming: "Your schedule",
    delete: "Delete", taken: "Taken today", markTaken: "Mark as taken",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    mealOptions: ["Before meal", "After meal", "With meal", "Any time", "Custom timing"],
    reminder: "Reminder", due: "It's time to take",
    note: "Optional notes", emptyName: "Please enter the medicine name.",
    emptyTime: "Please select a reminder time.",
    browserOnly: "Browser notifications work on HTTPS or localhost. Keep MediCare open to receive scheduled alerts.",
    permissionDenied: "Notifications are not allowed. Please enable them in your browser site settings.",
    saved: "Reminder saved.", removed: "Reminder deleted.",
    daily: "Daily", repeatDays: "Repeat on",
  },
  ur: {
    title: "ادویات کی یاددہانیاں", subtitle: "اپنی ادویات وقت پر لینا یاد رکھیں",
    add: "یاددہانی شامل کریں", edit: "یاددہانی میں ترمیم کریں", medicine: "دوا کا نام",
    dose: "خوراک / ہدایات", meal: "کھانے کے مطابق وقت", before: "کھانے سے پہلے",
    after: "کھانے کے بعد", with: "کھانے کے ساتھ", anytime: "کسی بھی وقت",
    custom: "اپنی مرضی کا وقت", time: "یاددہانی کا وقت", repeat: "دہرائیں",
    every: "روزانہ", selected: "منتخب دن", save: "یاددہانی محفوظ کریں",
    cancel: "منسوخ کریں", noItems: "ابھی کوئی یاددہانی نہیں",
    noItemsText: "دوا شامل کریں اور اپنے معمول کے مطابق وقت مقرر کریں۔",
    notification: "اطلاعات فعال کریں", enabled: "اطلاعات فعال ہیں",
    blocked: "آپ کے براؤزر کی ترتیبات میں اطلاعات بند ہیں۔",
    permission: "ویب سائٹ کھلی ہونے پر اطلاع حاصل کرنے کے لیے براؤزر کی اطلاعات کی اجازت دیں۔",
    today: "آج کی یاددہانیاں", upcoming: "آپ کا شیڈول",
    delete: "حذف کریں", taken: "آج دوا لے لی", markTaken: "دوا لینے کی تصدیق کریں",
    days: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
    mealOptions: ["کھانے سے پہلے", "کھانے کے بعد", "کھانے کے ساتھ", "کسی بھی وقت", "اپنی مرضی کا وقت"],
    reminder: "یاددہانی", due: "دوا لینے کا وقت ہو گیا ہے",
    note: "اضافی نوٹ (اختیاری)", emptyName: "براہِ کرم دوا کا نام درج کریں۔",
    emptyTime: "براہِ کرم یاددہانی کا وقت منتخب کریں۔",
    browserOnly: "براؤزر کی اطلاعات HTTPS یا localhost پر کام کرتی ہیں۔ مقررہ وقت پر اطلاع کے لیے MediCare کھلا رکھیں۔",
    permissionDenied: "اطلاعات کی اجازت نہیں ہے۔ براہِ کرم براؤزر کی سائٹ سیٹنگز میں انہیں فعال کریں۔",
    saved: "یاددہانی محفوظ ہو گئی۔", removed: "یاددہانی حذف ہو گئی۔",
    daily: "روزانہ", repeatDays: "ان دنوں میں دہرائیں",
  },
};

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function MedicalReminder() {
  const navigate = useNavigate();
  const { language, isUrdu } = useLanguage();
  const { user } = useAuth();
  const t = TEXT[language === "ur" ? "ur" : "en"];
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );
  const [form, setForm] = useState({
    name: "", dose: "", meal: "after", time: "08:00",
    repeat: "daily", days: [1, 2, 3, 4, 5, 6, 0], note: "",
  });

  useEffect(() => {
    let active = true;
    async function loadReminders() {
      try {
        if (!user?.id) { if (active) setReminders([]); return; }
        const { data, error } = await supabase.from("reminders").select("*")
          .eq("user_id", user.id).eq("status", "active")
          .order("scheduled_at", { ascending: true });
        if (error) throw error;
        const mapped = (data || []).map((row) => {
          const recurrence = row.recurrence || { type: "daily" };
          const date = new Date(row.scheduled_at);
          return {
            id: row.id, name: row.medicine_name || row.title,
            dose: row.dosage || "", note: row.description || "", meal: row.meal_timing || "after",
            time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: row.timezone || "Asia/Karachi" }),
            repeat: recurrence.type === "weekly" ? "selected" : "daily",
            days: recurrence.days || [0,1,2,3,4,5,6], lastNotifiedDate: "",
          };
        });
        if (active) setReminders(mapped);
      } catch (err) {
        if (active) setMessage(err.message || "Unable to load reminders.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadReminders();
    return () => { active = false; };
  }, [user?.id]);

  const notifyDueReminders = useCallback(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const today = getTodayKey();
    setReminders((current) => {
      let changed = false;
      const next = current.map((item) => {
        const dayAllowed = item.repeat === "daily" || (item.days || []).includes(now.getDay());
        if (!dayAllowed || item.time !== currentTime || item.lastNotifiedDate === today) return item;
        changed = true;
        if ("Notification" in window && Notification.permission === "granted") {
          const mealText = item.meal === "before" ? t.before : item.meal === "after" ? t.after : item.meal === "with" ? t.with : item.meal === "anytime" ? t.anytime : t.custom;
          const notification = new Notification(`${t.due}: ${item.name}`, {
            body: `${item.dose ? `${item.dose}. ` : ""}${mealText}`,
            tag: `medicare-${item.id}-${today}`,
            icon: "/favicon.svg",
          });
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        }
        return { ...item, lastNotifiedDate: today };
      });
      return changed ? next : current;
    });
  }, [t]);

  useEffect(() => {
    notifyDueReminders();
    const timer = window.setInterval(notifyDueReminders, 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") notifyDueReminders();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [notifyDueReminders]);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  function openNewForm() {
    setEditingId(null);
    setForm({
      name: "", dose: "", meal: "after", time: "08:00",
      repeat: "daily", days: [1, 2, 3, 4, 5, 6, 0], note: "",
    });
    setShowForm(true);
  }

  function editReminder(item) {
    setEditingId(item.id);
    setForm({
      name: item.name || "", dose: item.dose || "", meal: item.meal || "after",
      time: item.time || "08:00", repeat: item.repeat || "daily",
      days: item.days || [1, 2, 3, 4, 5, 6, 0], note: item.note || "",
    });
    setShowForm(true);
  }

  async function saveReminder(event) {
    event.preventDefault();
    if (!form.name.trim()) return setMessage(t.emptyName);
    if (!form.time) return setMessage(t.emptyTime);
    setMessage("");
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("Please sign in to save reminders.");
      const [hours, minutes] = form.time.split(":").map(Number);
      const scheduled = new Date();
      scheduled.setHours(hours, minutes, 0, 0);
      if (scheduled <= new Date()) scheduled.setDate(scheduled.getDate() + 1);
      const payload = {
        user_id: user.id, title: form.name.trim(), medicine_name: form.name.trim(),
        dosage: form.dose.trim() || null, description: form.note.trim() || null,
        meal_timing: form.meal,
        scheduled_at: scheduled.toISOString(), timezone: "Asia/Karachi",
        recurrence: form.repeat === "daily" ? { type: "daily" } : { type: "weekly", days: form.days },
        status: "active", email_enabled: false,
      };
      let saved;
      if (editingId) {
        const { data, error } = await supabase.from("reminders").update(payload)
          .eq("id", editingId).eq("user_id", user.id).select().single();
        if (error) throw error;
        saved = data;
      } else {
        const { data, error } = await supabase.from("reminders").insert(payload).select().single();
        if (error) throw error;
        saved = data;
      }
      const recurrence = saved.recurrence || payload.recurrence;
      const savedDate = new Date(saved.scheduled_at);
      const item = {
        id: saved.id, name: saved.medicine_name || saved.title,
        dose: saved.dosage || "", note: saved.description || "", meal: saved.meal_timing || form.meal,
        time: savedDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" }),
        repeat: recurrence.type === "weekly" ? "selected" : "daily",
        days: recurrence.days || [0,1,2,3,4,5,6], lastNotifiedDate: "",
      };
      setReminders((current) => editingId ? current.map((r) => r.id === editingId ? item : r) : [...current, item]);
      setShowForm(false);
      setEditingId(null);
      setMessage(t.saved);
      window.setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message || "Unable to save reminder.");
    }
  }

  async function deleteReminder(id) {
    try {
      const { error } = await supabase.from("reminders").update({ status: "cancelled" }).eq("id", id).eq("user_id", user?.id);
      if (error) throw error;
      setReminders((current) => current.filter((item) => item.id !== id));
      setMessage(t.removed);
      window.setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message || "Unable to delete reminder.");
    }
  }

  function toggleDay(day) {
    setForm((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((value) => value !== day)
        : [...current.days, day],
    }));
  }

  const todayReminders = reminders
    .filter((item) => item.repeat === "daily" || (item.days || []).includes(new Date().getDay()))
    .sort((a, b) => a.time.localeCompare(b.time));

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10";
  const cardClass = "rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm";
  const muted = "text-slate-500 dark:text-slate-400";

  return (
    <div dir={isUrdu ? "rtl" : "ltr"} className="min-h-screen bg-[#f5f8fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <FeatureNavbar title={t.title} accent="amber" isUrdu={isUrdu} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full border-[35px] border-white/10" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-50">
              <BellRing size={15} />
              MediCare
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">{t.subtitle}</p>
            <button onClick={openNewForm} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50">
              <Plus size={18} /> {t.add}
            </button>
          </div>
        </section>

        <section className={`${cardClass} mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              <Bell size={21} />
            </div>
            <div>
              <h2 className="font-bold">{permission === "granted" ? t.enabled : t.notification}</h2>
              <p className={`mt-1 max-w-2xl text-xs leading-5 ${muted}`}>
                {permission === "denied" ? t.blocked : permission === "granted" ? t.enabled : t.permission}
              </p>
            </div>
          </div>
          {permission !== "granted" && (
            <button onClick={enableNotifications} className="shrink-0 rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-900/30">
              {t.notification}
            </button>
          )}
        </section>

        <div className="mb-6 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/80 p-4 text-xs leading-5 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
          <Info size={17} className="mt-0.5 shrink-0" />
          <span>{t.browserOnly}</span>
        </div>

        {message && <div role="status" className="mb-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">{message}</div>}

        {showForm && (
          <section className={`${cardClass} mb-7 p-5 sm:p-7`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingId ? t.edit : t.add}</h2>
              <button onClick={() => setShowForm(false)} aria-label={isUrdu ? "بند کریں" : "Close"} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={19} /></button>
            </div>
            <form onSubmit={saveReminder} className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">{t.medicine} *
                <input className={`${inputClass} mt-2`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={isUrdu ? "مثلاً دوا کا نام" : "e.g. Medicine name"} required />
              </label>
              <label className="text-sm font-semibold">{t.dose}
                <input className={`${inputClass} mt-2`} value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} placeholder={isUrdu ? "مثلاً ڈاکٹر کی ہدایت کے مطابق" : "e.g. As prescribed"} />
              </label>
              <label className="text-sm font-semibold">{t.meal}
                <select className={`${inputClass} mt-2`} value={form.meal} onChange={(e) => setForm({ ...form, meal: e.target.value })}>
                  <option value="before">{t.before}</option>
                  <option value="after">{t.after}</option>
                  <option value="with">{t.with}</option>
                  <option value="anytime">{t.anytime}</option>
                  <option value="custom">{t.custom}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">{t.time} *
                <input type="time" className={`${inputClass} mt-2`} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              </label>
              <label className="text-sm font-semibold">{t.repeat}
                <select className={`${inputClass} mt-2`} value={form.repeat} onChange={(e) => setForm({ ...form, repeat: e.target.value })}>
                  <option value="daily">{t.every}</option>
                  <option value="selected">{t.selected}</option>
                </select>
              </label>
              {form.repeat === "selected" && (
                <fieldset className="sm:col-span-2">
                  <legend className="mb-2 text-sm font-semibold">{t.repeatDays}</legend>
                  <div className="flex flex-wrap gap-2">
                    {t.days.map((day, index) => (
                      <button type="button" key={day} onClick={() => toggleDay(index)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${form.days.includes(index) ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>{day}</button>
                    ))}
                  </div>
                </fieldset>
              )}
              <label className="text-sm font-semibold sm:col-span-2">{t.note}
                <textarea rows="2" className={`${inputClass} mt-2 resize-y`} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </label>
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button type="submit" className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800">{t.save}</button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">{t.cancel}</button>
              </div>
            </form>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={19} className="text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-bold">{t.today}</h2>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">{todayReminders.length}</span>
          </div>

          {loading ? (
            <div className={`${cardClass} p-8 text-center text-sm ${muted}`}>{isUrdu ? "یاددہانیاں لوڈ ہو رہی ہیں..." : "Loading reminders..."}</div>
          ) : todayReminders.length === 0 ? (
            <div className={`${cardClass} flex flex-col items-center px-6 py-12 text-center`}>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"><Pill size={27} /></div>
              <h3 className="font-bold">{t.noItems}</h3>
              <p className={`mt-2 max-w-sm text-sm ${muted}`}>{t.noItemsText}</p>
              <button onClick={openNewForm} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white"><Plus size={17} /> {t.add}</button>
            </div>
          ) : (
            <div className="grid gap-3">
              {todayReminders.map((item) => (
                <article key={item.id} className={`${cardClass} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5`}>
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"><Pill size={23} /></div>
                    <div className="min-w-0">
                      <h3 className="break-words font-bold">{item.name}</h3>
                      {item.dose && <p className={`mt-1 text-sm ${muted}`}>{item.dose}</p>}
                      <p className={`mt-1 flex items-center gap-1.5 text-xs ${muted}`}><Utensils size={13} /> {item.meal === "before" ? t.before : item.meal === "after" ? t.after : item.meal === "with" ? t.with : item.meal === "anytime" ? t.anytime : t.custom}</p>
                      {item.note && <p className={`mt-1 text-xs ${muted}`}>{item.note}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800 dark:bg-teal-900/30 dark:text-teal-200"><Clock3 size={16} /> {item.time}</span>
                    <button onClick={() => editReminder(item)} title={t.edit} aria-label={t.edit} className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300"><Pencil size={16} /></button>
                    <button onClick={() => deleteReminder(item.id)} title={t.delete} aria-label={t.delete} className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
