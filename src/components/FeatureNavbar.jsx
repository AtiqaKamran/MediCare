import { ArrowLeft, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeatureNavbar({ title, accent = "teal", isUrdu = false }) {
  const navigate = useNavigate();
  return (
    <header dir="ltr" className="sticky top-0 z-40 relative left-1/2 mb-4 w-screen -translate-x-1/2 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 sm:mx-0 sm:rounded-b-xl">
      <div className="mx-auto flex min-h-[62px] max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:min-h-[74px] sm:gap-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-sm font-medium text-slate-800 transition hover:border-teal-300 hover:bg-teal-50/60 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 sm:gap-2 sm:px-4">
          <ArrowLeft size={17} /><span>Dashboard</span>
        </button>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0 text-right">
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">MediCare</h1>
            <p className="max-w-[42vw] truncate text-[10px] text-slate-500 dark:text-slate-400 sm:max-w-none sm:text-xs">{title}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-700 shadow-sm dark:border-teal-900 dark:from-teal-900/50 dark:to-emerald-900/30 dark:text-teal-300 sm:h-11 sm:w-11">
            <HeartPulse size={22} />
          </div>
        </div>
      </div>
    </header>
  );
}
