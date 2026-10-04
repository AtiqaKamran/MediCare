
import { HeartPulse } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientProfile from "./pages/PatientProfile";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

import { getCurrentUser } from "./utils/storage";

import { ThemeProvider } from "./context/ThemeContext";
import {
  LanguageProvider,
  useLanguage,
} from "./context/LanguageContext";

/* =========================================
   Language Selection Screen
========================================= */

function LanguageSelection() {
  const { setLanguage } = useLanguage();

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-950 p-2"
      dir="ltr"
    >
      <div className="w-full max-w-[600px] mx-auto bg-[#0F766E] rounded-[10px] px-3 pt-3 pb-3 text-center">

        {/* Logo */}
        <div className="flex justify-center mb-3">
          <HeartPulse
            size={27}
            strokeWidth={1.8}
            className="text-white"
          />
        </div>

        {/* Heading */}
        <h1 className="text-[20px] font-semibold text-white leading-7">
          Welcome to MediCare
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-teal-50 mt-2 mb-3">
          Please select your preferred language
        </p>

        {/* English Button */}
        <button
          onClick={() => setLanguage("en")}
          className="w-full h-[57px] bg-white rounded-[9px] flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-[0.99] transition"
        >
          <span className="text-teal-700 text-xs">◎</span>

          <span className="text-[10px] text-slate-600 font-normal">
            Continue in English
          </span>
        </button>

        {/* Urdu Button */}
        <button
          onClick={() => setLanguage("ur")}
          className="w-full h-[57px] bg-white rounded-[9px] flex flex-col items-center justify-center gap-1 mt-2 hover:bg-slate-50 active:scale-[0.99] transition"
          dir="rtl"
        >
          <span className="text-teal-700 text-xs">◎</span>

          <span className="text-[10px] text-slate-600 font-normal">
            اردو میں جاری رکھیں
          </span>
        </button>

      </div>
    </div>
  );
}

/* =========================================
   Application Routes
========================================= */

function AppRoutes() {
  const { language } = useLanguage();

  // Show language selection if no language is saved
  if (!language) {
    return <LanguageSelection />;
  }

  // Check whether a user is already logged in
  const isLoggedIn = Boolean(getCurrentUser());

  return (
    <Routes>

      {/* Home Route */}
      <Route
        path="/"
        element={
          <Navigate
            to={isLoggedIn ? "/dashboard" : "/login"}
            replace
          />
        }
      />

      {/* Login Route */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Signup Route */}
      <Route
        path="/signup"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup />
          )
        }
      />

      {/* Patient Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PatientProfile />
          </ProtectedRoute>
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Symptom Checker */}
      <Route
        path="/symptoms"
        element={
          <ProtectedRoute>
            <SymptomChecker />
          </ProtectedRoute>
        }
      />

      {/* Medical History */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn ? "/dashboard" : "/login"}
            replace
          />
        }
      />

    </Routes>
  );
}

/* =========================================
   Main App
========================================= */

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </ThemeProvider>
  );
}