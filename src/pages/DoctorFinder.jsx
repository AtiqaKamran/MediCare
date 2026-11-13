import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowLeft,
  Search,
  MapPin,
  Stethoscope,
  UserRound,
  Filter,
  HeartPulse,
  Phone,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const DIRECTORY_URL = "https://oladoc.com/pakistan/lahore";

const AREAS = [
  "All Lahore", "DHA", "Gulberg", "Johar Town", "Model Town",
  "Faisal Town", "Garden Town", "Muslim Town", "Township",
  "Wapda Town", "Bahria Town", "Lake City", "Allama Iqbal Town",
  "Samanabad", "Shadman", "Ichhra", "Askari", "Raiwind Road",
  "Valencia Town", "Sabzazar", "Mughalpura", "Shahdara", "Cantt",
];

const AREA_URLS = {
  DHA: `${DIRECTORY_URL}/dha`,
  Gulberg: `${DIRECTORY_URL}/gulberg`,
  "Johar Town": `${DIRECTORY_URL}/johar-town`,
  "Model Town": `${DIRECTORY_URL}/model-town`,
  "Faisal Town": `${DIRECTORY_URL}/faisal-town`,
  "Garden Town": `${DIRECTORY_URL}/garden-town`,
  "Muslim Town": `${DIRECTORY_URL}/muslim-town`,
  Township: `${DIRECTORY_URL}/township`,
  "Wapda Town": `${DIRECTORY_URL}/wapda-town`,
  "Bahria Town": `${DIRECTORY_URL}/bahria-town`,
  "Lake City": `${DIRECTORY_URL}/lake-city`,
  "Allama Iqbal Town": `${DIRECTORY_URL}/allama-iqbal-town`,
  Samanabad: `${DIRECTORY_URL}/samanabad`,
  Shadman: `${DIRECTORY_URL}/shadman`,
  Ichhra: `${DIRECTORY_URL}/ichhra`,
  Askari: `${DIRECTORY_URL}/askari`,
  "Raiwind Road": `${DIRECTORY_URL}/raiwind-road`,
  "Valencia Town": `${DIRECTORY_URL}/valencia-town`,
  Sabzazar: `${DIRECTORY_URL}/sabzazar`,
  Mughalpura: `${DIRECTORY_URL}/mughalpura`,
  Shahdara: `${DIRECTORY_URL}/shahdara`,
  Harbanspura: `${DIRECTORY_URL}/harbanspura`,
  Cantt: `${DIRECTORY_URL}/cantt`,
};

const TEXT = {
  en: {
    tagline: "Your health, our priority",
    back: "Back to Dashboard",
    title: "Find a Suitable Doctor",
    description: "Search doctors by name, specialty, clinic, or area in Lahore.",
    finder: "Doctor Finder",
    filters: "Search and Filters",
    searchLabel: "Doctor, clinic, or specialty",
    searchPlaceholder: "e.g. cardiologist, Dr. Ali...",
    specialty: "Medical specialty",
    allSpecialties: "All Specialties",
    location: "City or area",
    allLahore: "All Lahore",
    clear: "Clear all filters",
    profiles: "Doctor Profiles",
    loading: "Loading...",
    refresh: "Refresh",
    results: "results",
    loadingMessage: "Loading doctor listings...",
    error: "Unable to load doctors. Check your Supabase connection and doctors table.",
    retry: "Try again",
    none: "No doctors found",
    noResults: "No database records match these filters yet.",
    explore: "Find doctors on Oladoc",
    clinic: "Clinic",
    call: "Call clinic",
    book: "View Profile / Booking",
    find: "Find on Oladoc",
    source: "Listing source",
    rating: "Rating",
    reviews: "reviews",
    notice: "Confirm clinic details, fees, and appointment availability with the provider. Directory links may show multiple doctors.",
    databaseEmpty: "Your database has no doctor records yet. Add doctor records to Supabase or browse the directory below.",
    online: "Open online directory",
    allAreas: "Browse Lahore doctors",
    notVerified: "Listing not independently verified",
    addressUnavailable: "Address unavailable",
    clinicUnavailable: "Clinic details unavailable",
    noPhone: "Phone number not available",
    countLabel: "doctors",
  },
  ur: {
    tagline: "آپ کی صحت، ہماری ترجیح",
    back: "ڈیش بورڈ پر واپس جائیں",
    title: "اپنے لیے مناسب ڈاکٹر تلاش کریں",
    description: "لاہور میں ڈاکٹر کو نام، اسپیشلٹی، کلینک یا علاقے سے تلاش کریں۔",
    finder: "ڈاکٹر تلاش کریں",
    filters: "تلاش اور فلٹرز",
    searchLabel: "ڈاکٹر، کلینک یا اسپیشلٹی",
    searchPlaceholder: "مثلاً کارڈیالوجسٹ، ڈاکٹر علی...",
    specialty: "طبی اسپیشلٹی",
    allSpecialties: "تمام اسپیشلٹیز",
    location: "شہر یا علاقہ",
    allLahore: "پورا لاہور",
    clear: "تمام فلٹرز ختم کریں",
    profiles: "ڈاکٹرز کی پروفائلز",
    loading: "لوڈ ہو رہا ہے...",
    refresh: "دوبارہ لوڈ کریں",
    results: "نتائج",
    loadingMessage: "ڈاکٹرز کی معلومات لوڈ ہو رہی ہیں...",
    error: "ڈاکٹرز لوڈ نہیں ہو سکے۔ Supabase کنکشن اور doctors ٹیبل چیک کریں۔",
    retry: "دوبارہ کوشش کریں",
    none: "کوئی ڈاکٹر نہیں ملا",
    noResults: "ان فلٹرز کے مطابق کوئی ریکارڈ نہیں ملا۔",
    explore: "Oladoc پر ڈاکٹر تلاش کریں",
    clinic: "کلینک",
    call: "کلینک پر کال کریں",
    book: "پروفائل / بکنگ دیکھیں",
    find: "Oladoc پر تلاش کریں",
    source: "معلومات کا ذریعہ",
    rating: "ریٹنگ",
    reviews: "ریویوز",
    notice: "کلینک، فیس اور اپائنٹمنٹ کی دستیابی کی تصدیق ضرور کریں۔ ڈائریکٹری کے لنک پر متعدد ڈاکٹرز بھی دکھائے جا سکتے ہیں۔",
    databaseEmpty: "آپ کے ڈیٹا بیس میں ابھی ڈاکٹرز کا ریکارڈ موجود نہیں۔ Supabase میں ریکارڈ شامل کریں یا نیچے ڈائریکٹری دیکھیں۔",
    online: "آن لائن ڈائریکٹری کھولیں",
    allAreas: "لاہور کے ڈاکٹرز دیکھیں",
    notVerified: "اس لسٹنگ کی آزادانہ تصدیق نہیں ہوئی",
    addressUnavailable: "پتہ دستیاب نہیں",
    clinicUnavailable: "کلینک کی تفصیلات دستیاب نہیں",
    noPhone: "فون نمبر دستیاب نہیں",
    countLabel: "ڈاکٹرز",
  },
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getSpecialties(doctor) {
  const specialty = doctor.specialty;

  if (Array.isArray(specialty)) {
    return specialty
      .flatMap((value) => String(value).split(/[;,|]/))
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return String(specialty ?? "")
    .split(/[;,|]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function getDirectoryUrl(area) {
  if (!area || area === "All Lahore") return DIRECTORY_URL;
  return AREA_URLS[area] || DIRECTORY_URL;
}

function getDoctorProfileUrl(doctor) {
  return (
    doctor.profile_url ||
    doctor.booking_url ||
    doctor.source_url ||
    getDirectoryUrl(doctor.area)
  );
}

export default function DoctorFinder() {
  const navigate = useNavigate();
  const { language, isUrdu } = useLanguage();
  const { darkMode } = useTheme();

  const activeLanguage = language || "en";
  const t = TEXT[activeLanguage] || TEXT.en;

  // Use the existing global theme state for this page.
  const dark = Boolean(darkMode);

  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("All Specialties");
  const [location, setLocation] = useState("All Lahore");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("doctors")
        .select("*")
        .order("name", { ascending: true })
        .limit(1000);

      if (fetchError) throw fetchError;

      setDoctors(data || []);
    } catch (err) {
      console.error("Doctor Finder:", err);
      setError(t.error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const specialties = useMemo(() => {
    const all = doctors.flatMap(getSpecialties);

    return [
      "All Specialties",
      ...Array.from(new Set(all)).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [doctors]);

  const areas = useMemo(() => [
    "All Lahore",
    ...Array.from(
      new Set(AREAS.filter((area) => area !== "All Lahore"))
    ).sort((a, b) => a.localeCompare(b)),
  ], []);

  const filteredDoctors = useMemo(() => {
    const query = normalize(searchTerm);
    const areaQuery = normalize(location);

    return doctors.filter((doctor) => {
      const searchableText = [
        doctor.name,
        doctor.specialty,
        doctor.clinic_name,
        doctor.address,
        doctor.area,
      ]
        .filter(Boolean)
        .join(" ");

      const matchesSearch =
        !query || normalize(searchableText).includes(query);

      const doctorSpecialties = getSpecialties(doctor);

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doctorSpecialties.some(
          (item) =>
            normalize(item) === normalize(selectedSpecialty)
        );

      const doctorArea = normalize(doctor.area);
      const doctorAddress = normalize(doctor.address);

      const matchesLocation =
        !areaQuery ||
        areaQuery === "all lahore" ||
        doctorArea === areaQuery ||
        doctorArea.includes(areaQuery) ||
        doctorAddress.includes(areaQuery);

      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [doctors, searchTerm, selectedSpecialty, location]);

  const directoryUrl = getDirectoryUrl(location);
  const noDatabaseRecords = !loading && !error && doctors.length === 0;

  // These classes explicitly follow ThemeContext, so they do not depend
  // on Tailwind's dark-mode configuration.
  const page = dark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-800";

  const header = dark
    ? "border-b border-slate-700 bg-slate-900"
    : "border-b border-slate-200 bg-white";

  const panel = dark
    ? "rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm"
    : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  const heading = dark ? "text-slate-100" : "text-slate-900";
  const bodyText = dark ? "text-slate-300" : "text-slate-600";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";

  const inputClass = dark
    ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-900"
    : "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

  const buttonBorder = dark
    ? "border border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700"
    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-100";

  const cardClass = dark
    ? "flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    : "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md";

  return (
    <div dir={isUrdu ? "rtl" : "ltr"} lang={activeLanguage} className={page}>
      <header className={header}>
        <div className="mx-auto flex max-w-7xl flex-row-reverse flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-100 p-2 text-teal-700">
              <HeartPulse size={25} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${heading}`}>MediCare</h1>
              <p className={`text-xs ${mutedText}`}>{t.tagline}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${buttonBorder}`}
          >
            <ArrowLeft size={16} />
            {t.back}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-teal-500">
            <Stethoscope size={20} />
            <span className="text-sm font-semibold">{t.finder}</span>
          </div>

          <h2 className={`text-3xl font-bold ${heading}`}>{t.title}</h2>
          <p className={`mt-2 max-w-2xl ${bodyText}`}>{t.description}</p>
        </section>

        <section className={`mb-8 ${panel}`}>
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-teal-500" />
            <h3 className={`font-semibold ${heading}`}>{t.filters}</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="doctor-search" className={`mb-2 block text-sm font-medium ${bodyText}`}>
                {t.searchLabel}
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className={`absolute top-1/2 -translate-y-1/2 ${mutedText} ${isUrdu ? "right-3" : "left-3"}`}
                />
                <input
                  id="doctor-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`${inputClass} ${isUrdu ? "pr-10 pl-4" : "pl-10 pr-4"}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="doctor-specialty" className={`mb-2 block text-sm font-medium ${bodyText}`}>
                {t.specialty}
              </label>
              <select
                id="doctor-specialty"
                value={selectedSpecialty}
                onChange={(event) => setSelectedSpecialty(event.target.value)}
                className={inputClass}
              >
                {specialties.map((item) => (
                  <option key={item} value={item} className={dark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                    {item === "All Specialties" ? t.allSpecialties : item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doctor-location" className={`mb-2 block text-sm font-medium ${bodyText}`}>
                <MapPin size={15} className="mr-1 inline" />
                {t.location}
              </label>
              <select
                id="doctor-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className={inputClass}
              >
                {areas.map((area) => (
                  <option key={area} value={area} className={dark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                    {area === "All Lahore" ? t.allLahore : area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("All Specialties");
              setLocation("All Lahore");
            }}
            className="mt-4 text-sm font-medium text-teal-500 hover:underline"
          >
            {t.clear}
          </button>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`text-lg font-semibold ${heading}`}>{t.profiles}</h3>
            <p className={`text-sm ${mutedText}`}>
              {loading ? t.loading : `${filteredDoctors.length} ${t.results}`}
            </p>
          </div>

          <button
            type="button"
            onClick={loadDoctors}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:opacity-50 ${buttonBorder}`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {t.refresh}
          </button>
        </div>

        {loading && (
          <div className={`rounded-2xl border p-10 text-center ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
            {t.loadingMessage}
          </div>
        )}

        {!loading && error && (
          <div className={`rounded-2xl border p-6 ${dark ? "border-red-900 bg-red-950 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
            <p>{error}</p>
            <button
              type="button"
              onClick={loadDoctors}
              className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-white"
            >
              {t.retry}
            </button>
            <a
              href={DIRECTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-fit items-center gap-2 underline"
            >
              {t.explore}<ExternalLink size={15} />
            </a>
          </div>
        )}

        {!loading && !error && (
          <>
            {(noDatabaseRecords || filteredDoctors.length === 0) && (
              <div className={`mb-6 rounded-2xl border border-dashed px-6 py-10 text-center ${dark ? "border-slate-600 bg-slate-900" : "border-slate-300 bg-white"}`}>
                <Search className={`mx-auto mb-3 ${mutedText}`} size={32} />
                <h4 className={`font-semibold ${heading}`}>
                  {noDatabaseRecords ? t.databaseEmpty : t.none}
                </h4>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  {noDatabaseRecords ? t.explore : t.noResults}
                </p>
                <a
                  href={directoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-medium text-white hover:bg-teal-800"
                >
                  {location === "All Lahore" ? t.allAreas : t.online}
                  <ExternalLink size={15} />
                </a>
              </div>
            )}

            {filteredDoctors.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.map((doctor) => {
                  const profileUrl = getDoctorProfileUrl(doctor);
                  const phone = doctor.phone;

                  return (
                    <article
                      key={doctor.id || `${doctor.name}-${doctor.clinic_name}`}
                      className={cardClass}
                    >
                      <div className="mb-4 flex items-center gap-4">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${dark ? "bg-teal-950 text-teal-300" : "bg-teal-50 text-teal-700"}`}>
                          <UserRound size={28} />
                        </div>
                        <div className="min-w-0">
                          <h4 className={`break-words font-semibold ${heading}`}>{doctor.name}</h4>
                          <p className="text-sm text-teal-500">{getSpecialties(doctor).join(", ")}</p>
                        </div>
                      </div>

                      <div className={`flex-1 space-y-3 text-sm ${bodyText}`}>
                        <p className={`font-medium ${heading}`}>
                          {doctor.clinic_name || t.clinicUnavailable}
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin size={16} className={`mt-0.5 shrink-0 ${mutedText}`} />
                          <span>
                            {doctor.address || t.addressUnavailable}
                            {doctor.area ? `, ${doctor.area}` : ""}
                          </span>
                        </p>

                        {phone ? (
                          <p className="flex items-center gap-2">
                            <Phone size={16} className="shrink-0" />
                            <a
                              href={`tel:${String(phone).replace(/[^\d+]/g, "")}`}
                              className="text-teal-500 hover:underline"
                            >
                              {phone}
                            </a>
                          </p>
                        ) : (
                          <p className={`flex items-center gap-2 ${mutedText}`}>
                            <Phone size={16} />
                            {t.noPhone}
                          </p>
                        )}

                        {doctor.rating != null && (
                          <p>
                            {t.rating}: {doctor.rating}
                            {doctor.review_count != null ? ` (${doctor.review_count} ${t.reviews})` : ""}
                          </p>
                        )}

                        {doctor.verified !== true && (
                          <p className={dark ? "text-xs text-amber-300" : "text-xs text-amber-700"}>
                            {t.notVerified}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {phone && (
                          <a
                            href={`tel:${String(phone).replace(/[^\d+]/g, "")}`}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${dark ? "border-teal-600 text-teal-300 hover:bg-teal-950" : "border-teal-700 text-teal-800 hover:bg-teal-50"}`}
                          >
                            <Phone size={15} />
                            {t.call}
                          </a>
                        )}
                        <a
                          href={profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm text-white hover:bg-teal-800"
                        >
                          {doctor.profile_url || doctor.booking_url ? t.book : t.find}
                          <ExternalLink size={15} />
                        </a>
                      </div>

                      {doctor.source_url && (
                        <a
                          href={doctor.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-3 text-xs underline ${mutedText}`}
                        >
                          {t.source}
                        </a>
                      )}

                      <p className={`mt-3 text-xs leading-relaxed ${mutedText}`}>
                        {t.notice}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}

            <section className={`mt-8 rounded-2xl p-6 text-center ${dark ? "bg-teal-950" : "bg-teal-50"}`}>
              <h3 className={`text-lg font-semibold ${heading}`}>{t.allAreas}</h3>
              <p className={`mt-2 text-sm ${bodyText}`}>{t.description}</p>
              <a
                href={directoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white hover:bg-teal-800"
              >
                {t.explore}<ExternalLink size={16} />
              </a>
            </section>
          </>
        )}

        <p className={`mt-8 text-center text-xs leading-relaxed ${mutedText}`}>
          {t.notice}
        </p>
      </main>
    </div>
  );
}
