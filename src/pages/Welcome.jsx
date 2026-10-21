import { HeartPulse, UserPlus, LogIn, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Welcome() {
  const { language, setLanguage, isUrdu } = useLanguage();

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-8">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950">
            <HeartPulse
              size={32}
              strokeWidth={1.8}
              className="text-teal-600"
            />
          </div>
        </div>

        {/* Welcome Heading */}
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            MediCare
          </h1>

          <h2 className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
            {isUrdu
              ? "MediCare میں خوش آمدید"
              : "Welcome to MediCare"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {isUrdu
              ? "شروع کرنے کے لیے اپنی پسند کی زبان منتخب کریں۔"
              : "Choose your preferred language to get started."}
          </p>
        </div>

        {/* Language Selection */}
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isUrdu ? "زبان منتخب کریں" : "SELECT LANGUAGE"}
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* English Button */}
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`flex min-w-0 items-center gap-2 rounded-xl border p-3 text-left transition-all duration-200 ${
                language === "en"
                  ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600/20 dark:bg-teal-950"
                  : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
                🇬🇧
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800 dark:text-white">
                  English
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                  English (UK)
                </span>
              </span>

              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                  language === "en"
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {language === "en" && (
                  <Check size={12} strokeWidth={3} />
                )}
              </span>
            </button>

            {/* Urdu Button */}
            <button
              type="button"
              onClick={() => setLanguage("ur")}
              aria-pressed={language === "ur"}
              className={`flex min-w-0 items-center gap-2 rounded-xl border p-3 text-right transition-all duration-200 ${
                language === "ur"
                  ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600/20 dark:bg-teal-950"
                  : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
                🇵🇰
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800 dark:text-white">
                  اردو
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                  پاکستانی اردو
                </span>
              </span>

              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                  language === "ur"
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {language === "ur" && (
                  <Check size={12} strokeWidth={3} />
                )}
              </span>
            </button>

          </div>
        </div>

        {/* Description */}
        <p className="mt-5 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
          {isUrdu
            ? "اپنی صحت کا بہتر خیال رکھنے کے لیے اکاؤنٹ بنائیں یا لاگ اِن کریں۔"
            : "Create an account or log in to manage your health in one place."}
        </p>

        {/* Authentication Buttons */}
        <div className="mt-5 space-y-3">

          {/* Create Account */}
          <Link
            to="/signup"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <UserPlus size={18} />
            {isUrdu ? "اکاؤنٹ بنائیں" : "Create Account"}
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-slate-800"
          >
            <LogIn size={18} />
            {isUrdu ? "لاگ اِن کریں" : "Login"}
          </Link>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          {isUrdu
            ? "آپ کی صحت، ہماری ترجیح"
            : "Your health, our priority."}
        </p>

      </div>
    </div>
  );
}
