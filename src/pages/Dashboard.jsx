import {Pill,} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  LogOut,
  MapPin,
  Moon,
  ShieldCheck,
  Stethoscope,
  Sun,
  UserRound,
  ArrowUpRight,
  Sparkles,
  Settings,
  Languages,
  X,
  History,
  FolderHeart,
  FileSearch,
} from "lucide-react";

import {
  getCurrentUser,
  logoutUser,
} from "../utils/storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

function formatValue(value, fallback = "Not provided") {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { darkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t, isUrdu } = useLanguage();

 useEffect(() => {
  let active = true;
  async function loadNotifications() {
    if (!user?.id) return;
    const { data, error } = await supabase.from("notifications")
      .select("id,title,message,created_at,read_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15);
    if (!error && active) setNotifications(data || []);
  }
  loadNotifications();
  async function loadActivity() {
    if (!user?.id) return;
    const [loginResult, reportResult] = await Promise.all([
      supabase.from("login_notification_events").select("id,logged_in_at")
        .eq("user_id", user.id).order("logged_in_at", { ascending: false }).limit(5),
      supabase.from("health_reports").select("id,title,created_at")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
    ]);
    if (!active) return;
    const items = [
      ...(loginResult.data || []).map(x => ({ id: "login-" + x.id, title: isUrdu ? "اکاؤنٹ میں سائن اِن کیا" : "Signed in to MediCare", date: x.logged_in_at })),
      ...(reportResult.data || []).map(x => ({ id: "report-" + x.id, title: (isUrdu ? "رپورٹ اسکین کی: " : "Scanned report: ") + x.title, date: x.created_at }))
    ];
    setActivities(items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
  }
  loadActivity();
  const refreshTimer = window.setInterval(() => { loadNotifications(); loadActivity(); }, 30000);
  return () => { active = false; window.clearInterval(refreshTimer); };
}, [user?.id, isUrdu]);

 async function markNotificationRead(item) {
  if (item.read_at) return;
  const readAt = new Date().toISOString();
  const { error } = await supabase.from("notifications")
    .update({ read_at: readAt }).eq("id", item.id);
  if (!error) setNotifications((items) => items.map((n) => n.id === item.id ? { ...n, read_at: readAt } : n));
}

 useEffect(() => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    navigate("/login", { replace: true });
  }
}, [navigate]);

  if (!user) return null;

  const hour = new Date().getHours();

  let greeting = t("hello");

  if (hour >= 5 && hour < 12) {
    greeting = t("goodMorning");
  } else if (hour >= 12 && hour < 17) {
    greeting = t("goodAfternoon");
  } else if (hour >= 17 && hour < 21) {
    greeting = t("goodEvening");
  } else {
    greeting = t("goodNight");
  }

  const profile = user.profile || {};
  const fullName = profile.fullName || user.fullName || t("patient");
  const firstName = fullName.trim().split(/\s+/)[0];

  const locationText = profile.lahoreArea
    ? `${profile.lahoreArea}, Lahore`
    : t("notAdded");

  async function handleLogout() {
  if (isLoggingOut) return;

  setIsLoggingOut(true);

  try {
    await logoutUser();
    setUser(null);
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout error:", error);
    setIsLoggingOut(false);
  }
}

  function translateGender(value) {
    if (!value) return t("notAdded");

    const gender = String(value).toLowerCase().trim();

    if (gender === "female") return t("female");
    if (gender === "male") return t("male");
    if (gender === "other") return t("other");

    return String(value);
  }

  const cardClass =
    "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5";

  const mutedText = "text-slate-500 dark:text-slate-400";
  const headingText = "text-slate-900 dark:text-white";

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f8fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
    >
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                <HeartPulse size={23} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  MediCare
                </h1>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                  {t("patientPortal")}
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 transition"
              >
                {t("dashboard")}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                {t("myHealth")}
              </button>

              <button
                onClick={() => navigate("/symptoms")}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                {t("symptoms")}
              </button>

              <button
                onClick={() => navigate("/doctors")}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                {t("doctors")}
              </button>
            </nav>

            {/* User Controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((value) => !value)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  aria-label="Notifications"
                  aria-expanded={showNotifications}
                >
                  <Bell size={19} />
                  {notifications.some((item) => !item.read_at) && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-800" />
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <h3 className="font-bold">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} aria-label="Close notifications" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length ? notifications.map((item) => (
                        <button key={item.id} onClick={() => markNotificationRead(item)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 ${item.read_at ? "opacity-65" : "bg-teal-50/50 dark:bg-teal-950/20"}`}>
                          <span className="block text-sm font-semibold">{item.title}</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.message}</span>
                          <span className="mt-1 block text-[10px] text-slate-400">{new Date(item.created_at).toLocaleString()}</span>
                        </button>
                      )) : <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>}
                    </div>
                  </div>
                )}
              </div>
              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${
                    showSettings
                      ? "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-700"
                  }`}
                  title={t("settings")}
                  aria-label={t("settings")}
                  aria-expanded={showSettings}
                >
                  {showSettings ? <X size={19} /> : <Settings size={19} />}
                </button>

                {showSettings && (
                  <div
                    dir={isUrdu ? "rtl" : "ltr"}
                    className={`absolute ${
                      isUrdu ? "left-0" : "right-0"
                    } top-12 w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {t("settings")}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {t("customizeExperience")}
                        </p>
                      </div>
                      <Settings
                        size={18}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    </div>

                    {/* Appearance */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        {darkMode ? (
                          <Moon
                            size={18}
                            className="text-teal-600 dark:text-teal-400"
                          />
                        ) : (
                          <Sun
                            size={18}
                            className="text-teal-600 dark:text-teal-400"
                          />
                        )}
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {t("appearance")}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            if (darkMode) toggleTheme();
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            !darkMode
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="flex items-center gap-3 text-sm font-medium">
                            <Sun size={18} />
                            {t("lightMode")}
                          </span>
                          {!darkMode && (
                            <span className="text-teal-600 dark:text-teal-400 text-sm font-bold">
                              ✓
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (!darkMode) toggleTheme();
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            darkMode
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="flex items-center gap-3 text-sm font-medium">
                            <Moon size={18} />
                            {t("darkMode")}
                          </span>
                          {darkMode && (
                            <span className="text-teal-600 dark:text-teal-400 text-sm font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Languages
                          size={18}
                          className="text-teal-600 dark:text-teal-400"
                        />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {t("language")}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => setLanguage("en")}
                          dir="ltr"
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            language === "en"
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {t("english")}
                          </span>
                          {language === "en" && (
                            <span className="text-teal-600 dark:text-teal-400 text-sm font-bold">
                              ✓
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => setLanguage("ur")}
                          dir="rtl"
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            language === "ur"
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {t("urdu")}
                          </span>
                          {language === "ur" && (
                            <span className="text-teal-600 dark:text-teal-400 text-sm font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          navigate("/history");
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium">
                          <History
                            size={18}
                            className="text-teal-600 dark:text-teal-400"
                          />
                          {t("medicalHistory")}
                        </span>
                        <ChevronRight size={18} className="text-slate-400" />
                      </button>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-3">
                        {t("medicalHistoryDescription")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3 ml-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/60 dark:to-emerald-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-100 dark:border-teal-800">
                  <UserRound size={18} />
                </div>
                <div className="hidden sm:block max-w-[130px]">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t("patient")}
                  </p>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition disabled:opacity-50"
                title={t("logout")}
                aria-label={t("logout")}
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 dark:from-teal-950 dark:via-teal-900 dark:to-emerald-950 p-7 sm:p-10 mb-8 shadow-xl shadow-teal-900/10">
          <div className="absolute -right-12 -top-20 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute right-20 -bottom-32 w-80 h-80 rounded-full border-[35px] border-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/15 px-3 py-1.5 mb-5 backdrop-blur-sm">
              <Sparkles size={14} className="text-teal-100" />
              <span className="text-xs font-semibold text-teal-50">
                {t("personalHealthSpace")}
              </span>
            </div>

            <p className="text-teal-100 text-sm font-medium mb-2">
              {t("patientDashboard")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-tight">
              {greeting}, {firstName}!
            </h2>
            <p className="text-teal-50/90 mt-4 leading-7 max-w-xl text-sm sm:text-base">
              {t("dashboardWelcome")}
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-teal-800 px-5 py-3 text-sm font-semibold shadow-lg shadow-teal-950/10 hover:bg-teal-50 hover:-translate-y-0.5 transition"
            >
              {t("viewHealthProfile")}
              <ArrowUpRight size={17} />
            </button>
          </div>
        </section>

        {/* Overview Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserRound size={21} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                {t("profile")}
              </span>
            </div>
            <p className={`text-sm ${mutedText}`}>{t("age")}</p>
            <p className={`text-2xl font-bold ${headingText} mt-1`}>
              {formatValue(profile.age, t("notAdded"))}
            </p>
          </div>

          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Activity size={21} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                {t("profile")}
              </span>
            </div>
            <p className={`text-sm ${mutedText}`}>{t("gender")}</p>
            <p className={`text-xl font-bold ${headingText} mt-1`}>
              {translateGender(profile.gender)}
            </p>
          </div>

          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <MapPin size={21} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                {t("location")}
              </span>
            </div>
            <p className={`text-sm ${mutedText}`}>{t("area")}</p>
            <p className={`text-base sm:text-lg font-bold ${headingText} mt-1 break-words`}>
              {locationText}
            </p>
          </div>

          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-900/50 dark:to-teal-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <ShieldCheck size={21} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                {t("health")}
              </span>
            </div>
            <p className={`text-sm ${mutedText}`}>{t("allergies")}</p>
            <p className={`text-base font-bold ${headingText} mt-1 break-words`}>
              {formatValue(profile.allergies, t("noAllergies"))}
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-9">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${headingText}`}>
                {t("quickActions")}
              </h3>
              <p className={`text-sm ${mutedText} mt-1`}>
                {t("healthcareTools")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Symptom Checker */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-teal-50 dark:bg-teal-900/10 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/30 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <ClipboardCheck size={26} />
                  </div>
                </div>
                <h4 className={`text-lg font-bold ${headingText} mt-6`}>
                  {t("checkSymptoms")}
                </h4>
                <p className={`text-sm ${mutedText} mt-2 leading-6 max-w-md`}>
                  {t("symptomDescription")}
                </p>
                <button
                  onClick={() => navigate("/symptoms")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-400 hover:gap-3 transition-all"
                >
                  {t("startSymptomCheck")}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Doctor Finder */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-blue-50 dark:bg-blue-900/10 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <Stethoscope size={26} />
                  </div>
                </div>
                <h4 className={`text-lg font-bold ${headingText} mt-6`}>
                  {t("findDoctor")}
                </h4>
                <p className={`text-sm ${mutedText} mt-2 leading-6 max-w-md`}>
                  {t("doctorDescription")}
                </p>
                <button
                  onClick={() => navigate("/doctors")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 hover:gap-3 transition-all"
                >
                  {t("findDoctors")}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* My Medical Records */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-emerald-50 dark:bg-emerald-900/10 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <FolderHeart size={26} />
                  </div>
                </div>
                <h4 className={`text-lg font-bold ${headingText} mt-6`}>
                  {t("myMedicalRecords")}
                </h4>
                <p className={`text-sm ${mutedText} mt-2 leading-6 max-w-md`}>
                  {t("medicalRecordsDescription")}
                </p>
                <button
                  onClick={() => navigate("/medical-records")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-400 hover:gap-3 transition-all"
                >
                  {t("openMedicalRecords")}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Medicine Reminder */}
<div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
  <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-emerald-100/90 dark:bg-emerald-900/25 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

  <div className="relative z-10">
    <div className="flex items-start justify-between">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
        <Pill size={26} />
      </div>
    </div>

    <h4 className={`text-lg font-bold ${headingText} mt-6`}>
      {isUrdu ? "ادویات کی یاددہانی" : "Medicine Reminder"}
    </h4>

    <p className={`text-sm ${mutedText} mt-2 leading-6 max-w-md`}>
      {isUrdu ? "اپنی ادویات شامل کریں اور انہیں وقت پر لینے کی یاددہانیاں مقرر کریں۔" : "Add your medicines and set reminders for the times you need to take them."}
    </p>

    <button
      onClick={() => navigate("/medical-reminder")}
      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:gap-3 transition-all"
    >
      {isUrdu ? "ادویات کی یاددہانی کھولیں" : "Open Medicine Reminder"}
      <ChevronRight size={18} />
    </button>
  </div>
</div>
            {/* AI Report Scanner */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-violet-100/90 dark:bg-violet-900/25 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/50 dark:to-purple-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center"><FileSearch size={26}/></div>
              <h4 className={`text-lg font-bold ${headingText} mt-6`}>{isUrdu ? "AI رپورٹ اسکینر" : "AI Health Report Scanner"}</h4>
              <p className={`text-sm ${mutedText} mt-2 leading-6`}>{isUrdu ? "اپنی لیب رپورٹ اپ لوڈ کریں اور آسان الفاظ میں وضاحت حاصل کریں۔" : "Upload a lab report and get an easy-to-understand explanation."}</p>
              <button onClick={()=>navigate("/report-scanner")} className="mt-5 text-sm font-bold text-violet-600 dark:text-violet-300">{isUrdu ? "رپورٹ اسکین کریں" : "Scan a Report"} <ChevronRight size={17} className="inline"/></button>
            </div>
              </div>
            {/* Blood Donor Finder */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-rose-100/90 dark:bg-rose-900/25 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/50 dark:to-pink-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center"><HeartPulse size={26}/></div>
              <h4 className={`text-lg font-bold ${headingText} mt-6`}>{isUrdu ? "بلڈ ڈونر تلاش کریں" : "Blood Donor Finder"}</h4>
              <p className={`text-sm ${mutedText} mt-2 leading-6`}>{isUrdu ? "شہر، علاقے اور بلڈ گروپ کے مطابق اجازت یافتہ ڈونرز تلاش کریں۔" : "Find consenting blood donors by city, area and blood group."}</p>
              <button onClick={()=>navigate("/blood-donors")} className="mt-5 text-sm font-bold text-rose-600 dark:text-rose-300">{isUrdu ? "ڈونرز تلاش کریں" : "Find Donors"} <ChevronRight size={17} className="inline"/></button>
            </div>
              </div>
            {/* Ambulance Finder */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-orange-100/90 dark:bg-orange-900/25 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/50 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 flex items-center justify-center"><Activity size={26}/></div>
              <h4 className={`text-lg font-bold ${headingText} mt-6`}>{isUrdu ? "ایمبولینس اور ایمرجنسی" : "Ambulance & Emergency"}</h4>
              <p className={`text-sm ${mutedText} mt-2 leading-6`}>{isUrdu ? "علاقے کے مطابق سروس کی معلومات تلاش کریں۔" : "Search ambulance service information by area."}</p>
              <button onClick={()=>navigate("/ambulance")} className="mt-5 text-sm font-bold text-orange-600 dark:text-orange-300">{isUrdu ? "ایمبولینس تلاش کریں" : "Find Ambulance"} <ChevronRight size={17} className="inline"/></button>
              </div>
            </div>
            {/* Laboratory Finder */}
            <div className={`${cardClass} p-6 sm:p-7 relative overflow-hidden group`}>
              <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-sky-100/90 dark:bg-sky-900/25 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900/50 dark:to-blue-900/40 text-sky-700 dark:text-sky-300 flex items-center justify-center"><FolderHeart size={26}/></div>
              <h4 className={`text-lg font-bold ${headingText} mt-6`}>{isUrdu ? "لیبارٹری اور ٹیسٹ تلاش کریں" : "Lab & Test Finder"}</h4>
              <p className={`text-sm ${mutedText} mt-2 leading-6`}>{isUrdu ? "ٹیسٹ درج کریں اور لیبارٹری کی معلومات دیکھیں۔" : "Enter tests to find matching laboratory listings."}</p>
              <button onClick={()=>navigate("/lab-finder")} className="mt-5 text-sm font-bold text-sky-700 dark:text-sky-300">{isUrdu ? "لیب تلاش کریں" : "Find a Lab"} <ChevronRight size={17} className="inline"/></button>
              </div>
            </div>
          </div>
        </section>

        {/* Health Information and Recent Activity */}
        <section className="grid lg:grid-cols-3 gap-5">
          {/* My Health Information */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <HeartPulse size={17} />
                  </div>
                  <h3 className={`text-lg font-bold ${headingText}`}>
                    {t("healthInformation")}
                  </h3>
                </div>
                <p className={`text-sm ${mutedText} mt-2`}>
                  {t("savedHealthDetails")}
                </p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition"
              >
                {t("edit")}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-teal-100 dark:hover:border-teal-900 transition">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t("existingConditions")}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-3 leading-6">
                  {formatValue(profile.conditions, t("noneProvided"))}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-900 transition">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t("allergies")}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-3 leading-6">
                  {formatValue(profile.allergies, t("noAllergies"))}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 transition">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t("lahoreArea")}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-3">
                  {formatValue(profile.lahoreArea, t("notAdded"))}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className={`font-bold ${headingText}`}>
                  {t("recentActivity")}
                </h3>
                <p className={`text-xs ${mutedText} mt-1`}>
                  {t("latestUpdates")}
                </p>
              </div>
            </div>

            {activities.length > 0 ? (
              <div className="space-y-5">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-teal-50 dark:ring-teal-900/30 mt-1.5 shrink-0" />
                      {index !== activities.length - 1 && (
                        <div className="w-px flex-1 min-h-5 bg-slate-200 dark:bg-slate-700 mt-2" />
                      )}
                    </div>
                    <div className="pb-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 break-words">
                        {activity.title || t("profileUpdated")}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {activity.date &&
                        !Number.isNaN(new Date(activity.date).getTime())
                          ? new Date(activity.date).toLocaleString(
                              isUrdu ? "ur-PK" : "en-US"
                            )
                          : t("recently")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <CalendarDays size={20} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("noRecentActivity")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Health Notice */}
        <section className="mt-7 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-amber-950/30 dark:to-orange-950/20 p-5 sm:p-6 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-300">
                {t("healthNotice")}
              </h4>
              <p className="text-sm text-amber-800/80 dark:text-amber-200/70 mt-1.5 leading-6">
                {t("healthDisclaimer")}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-7 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} {t("footer")}
          </p>
        </footer>
      </main>
    </div>
  );
}
