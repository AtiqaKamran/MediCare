import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [sessionReady, setSessionReady] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setValidSession(Boolean(session));
        setSessionReady(true);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        setValidSession(true);
        setSessionReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password: password,
        });

      if (updateError) throw updateError;

      setSuccess(
        "Your password has been updated successfully. You can now log in with your new password."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.message || "Unable to update your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!sessionReady) {
    return (
      <AuthLayout
        title="Verifying Reset Link"
        subtitle="Please wait while we verify your password reset link."
      >
        <div className="text-center text-sm text-slate-500">
          Please wait...
        </div>
      </AuthLayout>
    );
  }

  if (!validSession) {
    return (
      <AuthLayout
        title="Invalid or Expired Link"
        subtitle="This password reset link is invalid or has expired."
      >
        <Link
          to="/forgot-password"
          className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition"
        >
          Request a New Reset Link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Choose a new password for your MediCare account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            New Password
          </label>

          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              minLength={8}
              required
              className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Confirm New Password
          </label>

          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={8}
              required
              className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
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

        {success && (
          <div className="bg-teal-50 border border-teal-100 text-teal-700 text-sm rounded-xl p-3">
            {success}
          </div>
        )}

        {!success && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Lock size={19} />
            {loading ? "Updating..." : "Update Password"}
          </button>
        )}

        {success && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition"
          >
            Go to Login
          </button>
        )}
      </form>
    </AuthLayout>
  );
}
