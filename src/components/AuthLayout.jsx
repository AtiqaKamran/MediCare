import { HeartPulse, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

        {/* Left Side */}
        <div className="hidden lg:flex bg-teal-700 text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
                <HeartPulse size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">MediCare</h1>
                <p className="text-teal-100 text-sm">
                  Patient Health Portal
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-5">
              Your health information,
              <br />
              organized in one place.
            </h2>

            <p className="text-teal-100 leading-7 max-w-md">
              Manage your basic health information, explore general health
              guidance, and discover doctors in Lahore.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-teal-100">
            <ShieldCheck size={20} />
            <span>Your information is stored locally in this demo.</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center">
              <HeartPulse size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">MediCare</h1>
              <p className="text-xs text-slate-500">
                Patient Health Portal
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-slate-500 mt-2">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}