import { ArrowLeft, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeatureNavbar({ title, accent = "teal", isUrdu = false }) {
  const navigate = useNavigate();
  return (
    <>
      <header dir="ltr" className="fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex min-h-[68px] w-full max-w-screen-xl items-center justify-between gap-3 px-4 py-2 sm:min-h-[78px] sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:px-4"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="min-w-0 text-right">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">MediCare</h1>
              <p className="max-w-[42vw] truncate text-[10px] text-slate-500 dark:text-slate-400 sm:max-w-none sm:text-xs">{title}</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-emerald-50 text-teal-700 shadow-sm dark:border-teal-900 dark:bg-teal-900/40 dark:text-teal-300 sm:h-11 sm:w-11">
              <HeartPulse size={22} />
            </div>
          </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-[68px] sm:h-[78px]" />
    </>
  );
}
