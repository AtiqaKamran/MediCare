import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Trash2,
  ClipboardList,
  UserRound,
} from "lucide-react";

import {
  getCurrentUser,
  getPatientHistory,
  deletePatientHistory,
} from "../utils/storage";

import { useLanguage } from "../context/LanguageContext";

const translations = {
  Yes: "جی ہاں",
  No: "نہیں",
  Mild: "ہلکی",
  Moderate: "درمیانی",
  Severe: "شدید",
  Low: "کم",
  High: "زیادہ",
  "Less than 24 hours": "24 گھنٹے سے کم",
  "1–3 days": "1 سے 3 دن",
  "4–7 days": "4 سے 7 دن",
  "More than a week": "ایک ہفتے سے زیادہ",
  "Rest, maintain adequate hydration, and consider consulting a healthcare professional if symptoms persist or worsen.":
    "آرام کریں، مناسب پانی پئیں، اور علامات برقرار رہنے یا بڑھنے پر مستند طبی ماہر سے مشورہ کریں۔",
  "Avoid suspected triggers when possible.":
    "جہاں ممکن ہو، علامات کا سبب بننے والی چیزوں سے پرہیز کریں۔",
  "Use a cool compress for temporary comfort.":
    "وقتی آرام کے لیے ٹھنڈی پٹی استعمال کریں۔",
  "Avoid scratching irritated skin.":
    "متاثرہ جلد کو کھجانے سے گریز کریں۔",
  "Use gentle, fragrance-free skin products.":
    "جلد کے لیے نرم اور خوشبو سے پاک مصنوعات استعمال کریں۔",
  "Keep track of new products or foods associated with symptoms.":
    "علامات سے منسلک نئی مصنوعات یا غذاؤں کا ریکارڈ رکھیں۔",
  "This tool provides general educational information only. It does not diagnose conditions, prescribe treatment, or confirm that a medicine is safe for you. Always follow the product label and seek professional advice when uncertain.":
    "یہ ٹول صرف عمومی تعلیمی معلومات فراہم کرتا ہے۔ یہ تشخیص یا علاج تجویز نہیں کرتا۔ دوا کے متعلق شک ہو تو مستند طبی ماہر سے مشورہ کریں۔",
  "Your profile lists the following allergies: None known. Always check the active ingredients of medicines and tell your pharmacist or clinician about these allergies before taking any new medicine.":
    "آپ کے پروفائل کے مطابق فی الحال کسی الرجی کی اطلاع نہیں۔ نئی دوا لینے سے پہلے اس کے اجزاء چیک کریں اور اپنے ڈاکٹر یا فارماسسٹ کو معلومات فراہم کریں۔",
  "This information is for educational purposes only and is not a medical diagnosis. Consult a qualified healthcare professional for medical advice.":
    "یہ معلومات صرف تعلیمی مقاصد کے لیے ہیں، طبی تشخیص کا متبادل نہیں۔ طبی مشورے کے لیے مستند طبی ماہر سے رجوع کریں۔",
};

const getReadableText = (value, isUrdu = false) => {
  if (value === null || value === undefined) return "";

  if (typeof value === "string" || typeof value === "number") {
    const stringValue = String(value);
    return isUrdu ? translations[stringValue] || stringValue : stringValue;
  }

  if (typeof value === "boolean") {
    return isUrdu ? (value ? "جی ہاں" : "نہیں") : value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => getReadableText(item, isUrdu))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    const readableValue =
      value.message || value.title || value.description || value.text;

    return readableValue
      ? getReadableText(readableValue, isUrdu)
      : JSON.stringify(value);
  }

  return String(value);
};

export default function History() {
  const navigate = useNavigate();
  const { isUrdu } = useLanguage();

  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const text = {
    dashboard: isUrdu ? "ڈیش بورڈ" : "Dashboard",
    medicalHistory: isUrdu ? "طبی تاریخ" : "Medical History",
    viewManage: isUrdu
      ? "اپنی محفوظ کردہ صحت کی معلومات دیکھیں اور ان کا انتظام کریں۔"
      : "View and manage your previously saved health information.",
    noHistory: isUrdu ? "کوئی طبی تاریخ موجود نہیں" : "No medical history found",
    noHistoryDescription: isUrdu
      ? "آپ کی محفوظ کردہ علامات یہاں ظاہر ہوں گی۔"
      : "Your saved symptom information will appear here.",
    checkSymptoms: isUrdu ? "علامات چیک کریں" : "Check Symptoms",
    symptomAssessment: isUrdu ? "علامات کا جائزہ" : "Symptom Assessment",
    delete: isUrdu ? "حذف کریں" : "Delete",
    confirmDelete: isUrdu
      ? "کیا آپ واقعی اس طبی ریکارڈ کو حذف کرنا چاہتے ہیں؟"
      : "Are you sure you want to delete this health record?",
    selectedSymptoms: isUrdu ? "منتخب کردہ علامات" : "Selected Symptoms",
    noSymptoms: isUrdu ? "کوئی علامات درج نہیں کی گئیں۔" : "No symptoms recorded.",
    duration: isUrdu ? "دورانیہ" : "Duration",
    severity: isUrdu ? "شدت" : "Severity",
    notSpecified: isUrdu ? "درج نہیں کیا گیا" : "Not specified",
    generalGuidance: isUrdu ? "عمومی رہنمائی" : "General Guidance",
    selfCare: isUrdu ? "خود نگہداشت کی تجاویز" : "Self-Care Suggestions",
    safetyNotes: isUrdu ? "اہم حفاظتی ہدایات" : "Important Safety Notes",
    disclaimer: isUrdu
      ? "یہ معلومات صرف تعلیمی مقاصد کے لیے ہیں، طبی تشخیص کا متبادل نہیں۔"
      : "This information is for educational purposes only and is not a medical diagnosis. Consult a qualified healthcare professional for medical advice.",
    dateUnavailable: isUrdu ? "تاریخ دستیاب نہیں" : "Date unavailable",
    patient: isUrdu ? "مریض" : "Patient",
    loading: isUrdu ? "طبی تاریخ لوڈ ہو رہی ہے..." : "Loading medical history...",
    retry: isUrdu ? "دوبارہ کوشش کریں" : "Try Again",
  };

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      // Fetches records belonging to the authenticated Supabase user.
      const patientRecords = await getPatientHistory();

      setRecords(Array.isArray(patientRecords) ? patientRecords : []);
    } catch (err) {
      console.error("Unable to load medical history:", err);
      setError(
        err.message ||
          (isUrdu
            ? "طبی تاریخ لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔"
            : "Could not load medical history. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, isUrdu]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (recordId) => {
    if (!window.confirm(text.confirmDelete)) return;

    setDeletingId(recordId);
    setError("");

    try {
      await deletePatientHistory(recordId);
      setRecords((previous) =>
        previous.filter((record) => record.id !== recordId)
      );
    } catch (err) {
      console.error("Unable to delete medical history:", err);
      setError(
        err.message ||
          (isUrdu
            ? "ریکارڈ حذف نہیں ہو سکا۔"
            : "Could not delete the record.")
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return text.dateUnavailable;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return text.dateUnavailable;

    return parsedDate.toLocaleString(isUrdu ? "ur-PK" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f8fa] text-slate-900 dark:bg-slate-950 dark:text-white"
    >
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft size={17} />
            <span>{text.dashboard}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <UserRound size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                {user?.name || user?.fullName || text.patient}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {text.medicalHistory}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <ClipboardList size={25} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {text.medicalHistory}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {text.viewManage}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={loadHistory}
              className="mt-2 font-semibold underline"
            >
              {text.retry}
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            {text.loading}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <ClipboardList size={27} />
            </div>

            <h2 className="text-lg font-semibold">{text.noHistory}</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {text.noHistoryDescription}
            </p>

            <button
              type="button"
              onClick={() => navigate("/symptoms")}
              className="mt-6 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              {text.checkSymptoms}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {records.map((record, index) => (
              <article
                key={record.id || index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarDays size={16} />
                      <span>{formatDate(record.createdAt || record.created_at)}</span>
                    </div>
                    <h2 className="text-lg font-bold">
                      {text.symptomAssessment}
                    </h2>
                  </div>

                  <button
                    type="button"
                    disabled={deletingId === record.id}
                    onClick={() => handleDelete(record.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:text-red-400"
                  >
                    <Trash2 size={16} />
                    {deletingId === record.id ? "..." : text.delete}
                  </button>
                </div>

                <div className="mb-5">
                  <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {text.selectedSymptoms}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(record.symptoms) &&
                    record.symptoms.length > 0 ? (
                      record.symptoms.map((symptom, symptomIndex) => (
                        <span
                          key={symptomIndex}
                          className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                        >
                          {getReadableText(symptom, isUrdu)}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        {text.noSymptoms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {text.duration}
                    </p>
                    <p className="font-semibold">
                      {getReadableText(record.duration, isUrdu) ||
                        text.notSpecified}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {text.severity}
                    </p>
                    <p className="font-semibold">
                      {getReadableText(record.severity, isUrdu) ||
                        text.notSpecified}
                    </p>
                  </div>
                </div>

                {(record.recommendations || record.guidance) && (
                  <div className="mb-5">
                    <h3 className="mb-2 text-sm font-semibold">
                      {text.generalGuidance}
                    </h3>
                    <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {getReadableText(
                        record.recommendations || record.guidance,
                        isUrdu
                      )}
                    </p>
                  </div>
                )}

                {Array.isArray(record.selfCare) &&
                  record.selfCare.length > 0 && (
                    <div className="mb-5">
                      <h3 className="mb-2 text-sm font-semibold">
                        {text.selfCare}
                      </h3>
                      <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {record.selfCare.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            {getReadableText(item, isUrdu)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {Array.isArray(record.safetyNotes) &&
                  record.safetyNotes.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                      <h3 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                        {text.safetyNotes}
                      </h3>
                      <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-amber-800 dark:text-amber-200">
                        {record.safetyNotes.map((note, noteIndex) => (
                          <li key={noteIndex}>
                            {getReadableText(note, isUrdu)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  {text.disclaimer}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}