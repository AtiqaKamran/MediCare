import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Upload,
  Search,
  Trash2,
  Eye,
  FolderHeart,
  FilePlus2,
  ShieldCheck,
  FlaskConical,
  Pill,
  ScanLine,
  HeartPulse,
  Activity,
  Syringe,
  ClipboardList,
  FileCheck2,
  X,
  CalendarDays,
  Files,
  Plus,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const categories = [
  {
    id: "Lab Reports",
    en: "Lab Reports",
    ur: "لیب رپورٹس",
    descEn: "Blood tests, CBC, sugar & more",
    descUr: "خون، سی بی سی، شوگر اور دیگر ٹیسٹ",
    icon: FlaskConical,
    color: "blue",
  },
  {
    id: "Prescriptions",
    en: "Prescriptions",
    ur: "نسخے",
    descEn: "Doctor's prescriptions",
    descUr: "ڈاکٹر کے تجویز کردہ نسخے",
    icon: Pill,
    color: "violet",
  },
  {
    id: "X-rays & Scans",
    en: "X-rays & Scans",
    ur: "ایکس رے اور اسکین",
    descEn: "X-rays and medical scans",
    descUr: "ایکس رے اور طبی اسکین",
    icon: ScanLine,
    color: "teal",
  },
  {
    id: "Ultrasound",
    en: "Ultrasound",
    ur: "الٹراساؤنڈ",
    descEn: "Ultrasound reports",
    descUr: "الٹراساؤنڈ رپورٹس",
    icon: Activity,
    color: "pink",
  },
  {
    id: "MRI / CT Scans",
    en: "MRI / CT Scans",
    ur: "ایم آر آئی / سی ٹی اسکین",
    descEn: "MRI and CT scan reports",
    descUr: "ایم آر آئی اور سی ٹی اسکین رپورٹس",
    icon: ScanLine,
    color: "indigo",
  },
  {
    id: "ECG Reports",
    en: "ECG Reports",
    ur: "ای سی جی رپورٹس",
    descEn: "Heart test reports",
    descUr: "دل کے ٹیسٹ کی رپورٹس",
    icon: HeartPulse,
    color: "rose",
  },
  {
    id: "Vaccination Records",
    en: "Vaccination Records",
    ur: "ویکسینیشن ریکارڈ",
    descEn: "Vaccines and immunization",
    descUr: "ویکسین اور حفاظتی ٹیکوں کا ریکارڈ",
    icon: Syringe,
    color: "amber",
  },
  {
    id: "Discharge Summaries",
    en: "Discharge Summaries",
    ur: "ڈسچارج سمریز",
    descEn: "Hospital discharge documents",
    descUr: "ہسپتال سے ڈسچارج کی دستاویزات",
    icon: ClipboardList,
    color: "emerald",
  },
  {
    id: "Other Documents",
    en: "Other Documents",
    ur: "دیگر دستاویزات",
    descEn: "Other medical documents",
    descUr: "دیگر طبی دستاویزات",
    icon: FileText,
    color: "slate",
  },
];

const colorStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    border: "hover:border-blue-300 dark:hover:border-blue-800",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300",
    border: "hover:border-violet-300 dark:hover:border-violet-800",
  },
  teal: {
    icon: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300",
    border: "hover:border-teal-300 dark:hover:border-teal-800",
  },
  pink: {
    icon: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300",
    border: "hover:border-pink-300 dark:hover:border-pink-800",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",
    border: "hover:border-indigo-300 dark:hover:border-indigo-800",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
    border: "hover:border-rose-300 dark:hover:border-rose-800",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
    border: "hover:border-amber-300 dark:hover:border-amber-800",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
    border: "hover:border-emerald-300 dark:hover:border-emerald-800",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    border: "hover:border-slate-400 dark:hover:border-slate-600",
  },
};

function formatDate(date, isUrdu) {
  return new Date(date).toLocaleDateString(
    isUrdu ? "ur-PK" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MedicalRecords() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { isUrdu } = useLanguage();

  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All Documents");
  const [uploadCategory, setUploadCategory] =
    useState("Lab Reports");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewDocument, setPreviewDocument] = useState(null);

  const copy = {
    eyebrow: isUrdu ? "آپ کی ذاتی ہیلتھ لائبریری" : "YOUR PERSONAL HEALTH LIBRARY",
    title: isUrdu ? "میرے طبی ریکارڈز" : "My Medical Records",
    subtitle: isUrdu
      ? "اپنی تمام طبی دستاویزات ایک ہی جگہ محفوظ انداز میں منظم کریں۔"
      : "All your medical documents in one place.",
    back: isUrdu ? "ڈیش بورڈ پر واپس جائیں" : "Back to Dashboard",
    total: isUrdu ? "کل دستاویزات" : "Total Documents",
    categories: isUrdu ? "دستاویزات کی اقسام" : "Document Categories",
    formats: isUrdu ? "قابل قبول فائلیں" : "Supported Formats",
    addTitle: isUrdu ? "نئی دستاویز شامل کریں" : "Add a document",
    addSubtitle: isUrdu
      ? "قسم منتخب کریں، پھر اپنی فائل اپ لوڈ کریں۔"
      : "Select a category, then choose your file.",
    categoryLabel: isUrdu ? "دستاویز کی قسم" : "Document category",
    choose: isUrdu ? "فائل منتخب کریں" : "Choose Files",
    uploadHint: isUrdu
      ? "PDF یا تصاویر، ہر فائل زیادہ سے زیادہ 10 MB"
      : "PDF or image files. Maximum 10 MB per file.",
    searchPlaceholder: isUrdu
      ? "دستاویز تلاش کریں..."
      : "Search documents...",
    all: isUrdu ? "تمام دستاویزات" : "All Documents",
    yourDocuments: isUrdu ? "آپ کی دستاویزات" : "Your Documents",
    browse: isUrdu
      ? "اپنی فائلیں تلاش کریں اور منظم کریں۔"
      : "Search, view and manage your files.",
    view: isUrdu ? "دیکھیں" : "View",
    download: isUrdu ? "ڈاؤن لوڈ" : "Download",
    delete: isUrdu ? "حذف کریں" : "Delete",
    added: isUrdu ? "شامل کرنے کی تاریخ" : "Added",
    emptyTitle: isUrdu
      ? "ابھی کوئی دستاویز نہیں"
      : "Your medical library is empty",
    emptyDescription: isUrdu
      ? "شروع کرنے کے لیے اوپر سے اپنی پہلی طبی دستاویز شامل کریں۔"
      : "Add your first medical document to keep everything organized in one place.",
    noResults: isUrdu
      ? "آپ کی تلاش سے کوئی دستاویز نہیں ملی۔"
      : "No documents match your search.",
    uploadSuccess: isUrdu
      ? "فائلیں اس سیشن میں شامل ہو گئی ہیں۔"
      : "Files added to this session successfully.",
    invalid: isUrdu
      ? "صرف PDF اور تصویر کی فائلیں قابل قبول ہیں۔"
      : "Only PDF files and images are supported.",
    tooLarge: isUrdu
      ? "ہر فائل کا سائز 10 MB یا اس سے کم ہونا چاہیے۔"
      : "Each file must be 10 MB or smaller.",
    deleteConfirm: isUrdu
      ? "کیا آپ واقعی یہ دستاویز حذف کرنا چاہتے ہیں؟"
      : "Are you sure you want to delete this document?",
    privacyTitle: isUrdu ? "آپ کی صحت، آپ کی رازداری" : "Your health, your privacy",
    privacyText: isUrdu
      ? "یہ فی الحال صرف ایک عارضی ڈیمو ہے۔ فائلیں Supabase پر محفوظ نہیں ہوتیں اور صفحہ ریفریش کرنے پر ختم ہو جائیں گی۔"
      : "This is currently a local preview. Files are not saved to Supabase and will disappear when the page is refreshed.",
    close: isUrdu ? "بند کریں" : "Close",
    noFile: isUrdu ? "فائل منتخب نہیں ہوئی" : "No file selected",
  };

  useEffect(() => {
    return () => {
      documents.forEach((document) => {
        URL.revokeObjectURL(document.url);
      });
    };
  }, [documents]);

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    setError("");
    setNotice("");

    const acceptedFiles = [];

    for (const file of files) {
      const isSupported =
        file.type === "application/pdf" ||
        file.type.startsWith("image/");

      if (!isSupported) {
        setError(copy.invalid);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(copy.tooLarge);
        continue;
      }

      acceptedFiles.push(file);
    }

    const newDocuments = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      category: uploadCategory,
      date: new Date().toISOString(),
      file,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
    }));

    if (newDocuments.length > 0) {
      setDocuments((previous) => [...newDocuments, ...previous]);
      setNotice(copy.uploadSuccess);
      setSelectedCategory("All Documents");
    }

    event.target.value = "";
  }

  function deleteDocument(id) {
    if (!window.confirm(copy.deleteConfirm)) return;

    const documentToDelete = documents.find(
      (document) => document.id === id
    );

    if (documentToDelete) {
      URL.revokeObjectURL(documentToDelete.url);
    }

    if (previewDocument?.id === id) {
      setPreviewDocument(null);
    }

    setDocuments((previous) =>
      previous.filter((document) => document.id !== id)
    );
  }

  const filteredDocuments = documents.filter((document) => {
    const matchesCategory =
      selectedCategory === "All Documents" ||
      document.category === selectedCategory;

    const category = categories.find(
      (item) => item.id === document.category
    );

    const searchableText = [
      document.name,
      document.category,
      category?.en,
      category?.ur,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      search.trim().toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  const selectedCategoryInfo = categories.find(
    (category) => category.id === uploadCategory
  );

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f8fa] text-slate-900 dark:bg-slate-950 dark:text-white"
    >
      {/* Navbar: Back button left, brand right */}
      <header
        dir="ltr"
        className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
      >
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-teal-950/40"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">
              {copy.back}
            </span>
            <span className="sm:hidden">
              {isUrdu ? "واپس" : "Back"}
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-right"
          >
            <div className="text-right">
              <h1 className="text-lg font-extrabold tracking-tight">
                MediCare
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {copy.title}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md shadow-teal-700/20">
              <HeartPulse size={24} />
            </div>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Page introduction */}
        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 p-6 text-white shadow-xl shadow-teal-900/10 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full border-[35px] border-white/10" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-50">
              <FolderHeart size={15} />
              {copy.eyebrow}
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {copy.title}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">
              {copy.subtitle}
            </p>

            <button
              onClick={() =>
                document.getElementById("add-document")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50"
            >
              <Plus size={18} />
              {copy.choose}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              <Files size={23} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {copy.total}
            </p>
            <p className="mt-1 text-3xl font-extrabold">
              {documents.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              <FolderHeart size={23} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {copy.categories}
            </p>
            <p className="mt-1 text-3xl font-extrabold">
              {categories.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <ShieldCheck size={23} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {copy.formats}
            </p>
            <p className="mt-1 text-xl font-extrabold">
              PDF, JPG, PNG
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isUrdu ? "10 MB فی فائل تک" : "Up to 10 MB per file"}
            </p>
          </div>
        </section>

        {/* Category cards */}
        <section className="mb-9">
          <div className="mb-5">
            <h3 className="text-xl font-extrabold sm:text-2xl">
              {isUrdu ? "قسم کے لحاظ سے براؤز کریں" : "Browse by category"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isUrdu
                ? "اپنی مطلوبہ دستاویز کی قسم منتخب کریں۔"
                : "Choose a category to find your medical documents."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const styles = colorStyles[category.color];
              const count = documents.filter(
                (document) => document.category === category.id
              ).length;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    document.getElementById("document-list")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`group flex min-w-0 items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-start shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${styles.border}`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}>
                    <Icon size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold">
                        {isUrdu ? category.ur : category.en}
                      </h4>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {count}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {isUrdu ? category.descUr : category.descEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Upload section */}
        <section
          id="add-document"
          className="mb-9 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"
        >
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              <FilePlus2 size={23} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold sm:text-xl">
                {copy.addTitle}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {copy.addSubtitle}
              </p>
            </div>
          </div>

          <label
            htmlFor="record-category"
            className="mb-2 block text-sm font-semibold"
          >
            {copy.categoryLabel}
          </label>

          <select
            id="record-category"
            value={uploadCategory}
            onChange={(event) => setUploadCategory(event.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-950 sm:max-w-lg"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {isUrdu ? category.ur : category.en}
              </option>
            ))}
          </select>

          {selectedCategoryInfo && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
              {(() => {
                const Icon = selectedCategoryInfo.icon;
                return (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorStyles[selectedCategoryInfo.color].icon}`}>
                    <Icon size={20} />
                  </div>
                );
              })()}
              <div>
                <p className="text-sm font-bold">
                  {isUrdu ? selectedCategoryInfo.ur : selectedCategoryInfo.en}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {isUrdu ? selectedCategoryInfo.descUr : selectedCategoryInfo.descEn}
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-800 sm:w-auto"
          >
            <Upload size={19} />
            {copy.choose}
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {copy.uploadHint}
          </p>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}

          {notice && (
            <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              {notice}
            </p>
          )}
        </section>

        {/* Privacy note */}
        <section className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-5">
          <ShieldCheck size={22} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              {copy.privacyTitle}
            </h4>
            <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-200/80">
              {copy.privacyText}
            </p>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} MediCare
        </footer>
      </main>

      {/* Document preview modal */}
      {previewDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setPreviewDocument(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={previewDocument.name}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="min-w-0">
                <h3 className="break-words font-bold">
                  {previewDocument.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(previewDocument.date, isUrdu)}
                </p>
              </div>

              <button
                onClick={() => setPreviewDocument(null)}
                aria-label={copy.close}
                className="shrink-0 rounded-xl border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-[250px] flex-1 overflow-auto bg-slate-100 p-3 dark:bg-slate-950 sm:p-5">
              {previewDocument.type === "application/pdf" ? (
                <iframe
                  src={previewDocument.url}
                  title={previewDocument.name}
                  className="h-[65vh] min-h-[400px] w-full rounded-xl bg-white"
                />
              ) : (
                <img
                  src={previewDocument.url}
                  alt={previewDocument.name}
                  className="mx-auto max-h-[65vh] max-w-full rounded-xl object-contain"
                />
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-800">
              <button
                onClick={() => setPreviewDocument(null)}
                className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
              >
                {copy.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}