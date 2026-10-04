import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
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
} from "lucide-react";

import {
  getCurrentUser,
  logoutUser,
} from "../utils/storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

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

  const { darkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t, isUrdu } = useLanguage();

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
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
  }

  const profile = user.profile || {};
  const fullName = profile.fullName || user.fullName || "Patient";
  const firstName = fullName.trim().split(/\s+/)[0];

  const locationText = profile.lahoreArea
    ? `${profile.lahoreArea}, Lahore`
    : t("notAdded");

  const activities = Array.isArray(user.recentActivity)
    ? user.recentActivity.slice(0, 3)
    : [];

  function handleLogout() {
    logoutUser();
    navigate("/login");
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
                disabled
                title={t("comingSoon")}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 dark:text-slate-600 cursor-not-allowed"
              >
                {t("doctors")}
              </button>
            </nav>

            {/* User Controls */}
            <div className="flex items-center gap-2">
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
                  {showSettings ? (
                    <X size={19} />
                  ) : (
                    <Settings size={19} />
                  )}
                </button>

                {showSettings && (
                  <div className="absolute right-0 top-12 w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50">
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
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                            language === "en"
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            English
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
                            اردو
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
                          {isUrdu ? "طبی تاریخ" : "Medical History"}
                        </span>

                        <ChevronRight
                          size={18}
                          className="text-slate-400"
                        />
                      </button>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-3">
                        {isUrdu
                          ? "اپنی سابقہ علامات کی جانچ اور سفارشات دیکھیں۔"
                          : "View your previous symptom checks and recommendations."}
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
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition"
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
              {formatValue(profile.gender)}
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
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
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

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("availableNow")}
                  </span>
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

                  <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {t("comingSoon")}
                  </span>
                </div>

                <h4 className={`text-lg font-bold ${headingText} mt-6`}>
                  {t("findDoctor")}
                </h4>

                <p className={`text-sm ${mutedText} mt-2 leading-6 max-w-md`}>
                  {t("doctorDescription")}
                </p>

                <button
                  disabled
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                >
                  {t("findDoctors")}
                  <ChevronRight size={18} />
                </button>
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
                  {formatValue(profile.lahoreArea)}
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
                        !Number.isNaN(
                          new Date(activity.date).getTime()
                        )
                          ? new Date(
                              activity.date
                            ).toLocaleDateString(
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
                  <CalendarDays
                    size={20}
                    className="text-slate-400"
                  />
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