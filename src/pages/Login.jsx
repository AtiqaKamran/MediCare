
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  findUserById,
  createUser,
  setCurrentUser,
} from "../utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const { t, isUrdu } = useLanguage();
  const { applyAuthSession } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });

      if (loginError) throw loginError;

      const authUser = data.user;
      if (!data.session) {
        throw new Error("Login succeeded but no active session was returned. Please try again.");
      }

      // Establish the app session and navigate immediately. Profile reads and email
      // alerts are secondary and must never block the signed-in screen.
      applyAuthSession(data.session);

      const localUser = findUserById(authUser.id);
      const user = {
        ...(localUser || {}),
        id: authUser.id,
        name: authUser.user_metadata?.name || localUser?.name || "",
        fullName: authUser.user_metadata?.name || localUser?.fullName || "",
        email: authUser.email || form.email.trim().toLowerCase(),
        profileCompleted: Boolean(localUser?.profileCompleted),
        profile: localUser?.profile || {},
        createdAt: localUser?.createdAt || new Date().toISOString(),
        recentActivity: localUser?.recentActivity || [],
      };

      createUser(user);
      setCurrentUser(user);
      navigate("/dashboard", { replace: true });

      // Best-effort profile refresh after navigation; RLS or network errors
      // must not leave the authenticated user on a blank/login screen.
      supabase.from("patient_profiles").select("*").eq("user_id", authUser.id)
        .maybeSingle().then(({ data: savedProfile, error: profileError }) => {
          if (profileError) {
            console.warn("Patient profile could not be refreshed:", profileError.message);
            return;
          }
          if (!savedProfile) return;
          const refreshedUser = {
            ...user,
            name: savedProfile.full_name || user.name,
            fullName: savedProfile.full_name || user.fullName,
            profileCompleted: true,
            profile: {
              ...user.profile,
              fullName: savedProfile.full_name || "",
              age: savedProfile.age ?? "",
              gender: savedProfile.gender ?? "",
              conditions: savedProfile.conditions ?? "",
              allergies: savedProfile.allergies ?? "",
              medicineAllergies: savedProfile.medicine_allergies ?? [],
              foodAllergies: savedProfile.food_allergies ?? [],
              lahoreArea: savedProfile.lahore_area ?? "",
            },
          };
          createUser(refreshedUser);
          setCurrentUser(refreshedUser);
        }).catch((profileError) => console.warn("Patient profile refresh failed:", profileError));
    } catch (err) {
      setError(
        err.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("welcomeBack")} subtitle={t("loginSubtitle")}>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        <FormField
          label={t("emailAddress")}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {t("password")} <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder={t("enterPassword")}
              required
              className={`w-full px-4 py-3 ${
                isUrdu ? "pl-12" : "pr-12"
              } rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={`absolute ${
                isUrdu ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
        >
          <LogIn size={19} />
          {loading ? t("signingIn") : t("login")}
        </button>

        <p className="text-center text-sm text-slate-500">
          {t("noAccount")}{" "}
          <Link
            to="/signup"
            className="text-teal-600 font-semibold hover:text-teal-700"
          >
            {t("createAccount")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
