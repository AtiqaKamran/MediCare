import { ArrowLeft, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeatureNavbar({ title, accent = "teal", isUrdu = false }) {
  const navigate = useNavigate();
  const accents = {
    teal: "from-teal-500 to-teal-700",
    rose: "from-rose-500 to-pink-600",
    violet: "from-violet-500 to-indigo-600",
    orange: "from-orange-500 to-red-600",
    blue: "from-blue-500 to-indigo-600",
  };
  return <header dir="ltr" className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
    <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-teal-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
        <ArrowLeft size={17}/><span>Dashboard</span>
      </button>
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0 text-right"><h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">MediCare</h1><p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{title}</p></div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent] || accents.teal} text-white shadow-sm`}><HeartPulse size={22}/></div>
      </div>
    </div>
  </header>;
}