import { HeartPulse } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientProfile from "./pages/PatientProfile";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import History from "./pages/History";
import MedicalRecords from "./pages/MedicalRecords";
import DoctorFinder from "./pages/DoctorFinder";
import MedicalReminder from "./pages/MedicalReminder";
import BloodDonorFinder from "./pages/BloodDonorFinder";
import AmbulanceFinder from "./pages/AmbulanceFinder";
import LabFinder from "./pages/LabFinder";

import SupabaseTest from "./SupabaseTest";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorChatbot from "./components/DoctorChatbot";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  LanguageProvider,
  useLanguage,
} from "./context/LanguageContext";

/* Language Selection Screen */
function LanguageSelection() {
  const { setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-2" dir="ltr">
      <div className="w-full max-w-[600px] mx-auto bg-[#0F766E] rounded-[10px] px-3 pt-3 pb-3 text-center">
        <div className="flex justify-center mb-3">
          <HeartPulse size={27} strokeWidth={1.8} className="text-white" />
        </div>
        <h1 className="text-[20px] font-semibold text-white leading-7">Welcome to MediCare</h1>
        <p className="text-[13px] text-teal-50 mt-2 mb-3">Please select your preferred language</p>
        <button onClick={() => setLanguage("en")} className="w-full h-[57px] bg-white rounded-[9px] flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-[0.99] transition">
          <span className="text-teal-700 text-xs">◎</span>
          <span className="text-[10px] text-slate-600 font-normal">Continue in English</span>
        </button>
        <button onClick={() => setLanguage("ur")} className="w-full h-[57px] bg-white rounded-[9px] flex flex-col items-center justify-center gap-1 mt-2 hover:bg-slate-50 active:scale-[0.99] transition" dir="rtl">
          <span className="text-teal-700 text-xs">◎</span>
          <span className="text-[10px] text-slate-600 font-normal">اردو میں جاری رکھیں</span>
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { language } = useLanguage();
  const { user, loading } = useAuth();

  if (!language) return <LanguageSelection />;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
      </div>
    );
  }

  const isLoggedIn = Boolean(user);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Welcome />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/symptoms" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><DoctorFinder /></ProtectedRoute>} />
      <Route path="/medical-reminder" element={<ProtectedRoute><MedicalReminder /></ProtectedRoute>} />
      <Route path="/blood-donors" element={<ProtectedRoute><BloodDonorFinder /></ProtectedRoute>} />
      <Route path="/ambulance" element={<ProtectedRoute><AmbulanceFinder /></ProtectedRoute>} />
      <Route path="/lab-finder" element={<ProtectedRoute><LabFinder /></ProtectedRoute>} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
          <DoctorChatbot />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
