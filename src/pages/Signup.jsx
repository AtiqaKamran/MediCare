
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { useLanguage } from "../context/LanguageContext";
import {
  createUser,
  findUserByEmail,
  setCurrentUser,
} from "../utils/storage";

export default function Signup() {
  const navigate = useNavigate();
  const { t, isUrdu } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError(t("pleaseEnterName"));
      return;
    }

    if (!form.email.trim()) {
      setError(t("pleaseEnterEmail"));
      return;
    }

    if (form.password.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    const existingUser = findUserByEmail(form.email);

    if (existingUser) {
      setError(t("emailAlreadyExists"));
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,

      profileCompleted: false,

      profile: {
        age: "",
        gender: "",
        conditions: "",
        allergies: "",
        lahoreArea: "",
      },

      createdAt: new Date().toISOString(),
      recentActivity: [],
    };

    createUser(newUser);
    setCurrentUser(newUser);

    navigate("/profile");
  }

  return (
    <AuthLayout
      title={t("createYourAccount")}
      subtitle={t("signupSubtitle")}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        <FormField
          label={t("fullName")}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("enterFullName")}
          required
        />

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
            {t("password")}{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder={t("atLeast6Characters")}
              required
              className={`w-full px-4 py-3 ${
                isUrdu ? "pl-12" : "pr-12"
              } rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className={`absolute ${
                isUrdu ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {t("confirmPassword")}{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t("reEnterPassword")}
              required
              className={`w-full px-4 py-3 ${
                isUrdu ? "pl-12" : "pr-12"
              } rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
              className={`absolute ${
                isUrdu ? "left-4" : "right-4"
              } top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
        >
          <UserPlus size={19} />
          {t("createAccount")}
        </button>

        <p className="text-center text-sm text-slate-500">
          {t("alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="text-teal-600 font-semibold hover:text-teal-700"
          >
            {t("login")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}