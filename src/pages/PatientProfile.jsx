import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Moon,
  Save,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import FormField from "../components/FormField";
import {
  getCurrentUser,
  logoutUser,
  updateUser,
} from "../utils/storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const LAHORE_AREAS = [
  "Bahria Town",
  "DHA",
  "Faisal Town",
  "Garden Town",
  "Gulberg",
  "Johar Town",
  "Model Town",
  "Thokar Niaz Baig",
  "Township",
  "Wapda Town",
  "Other Lahore Area",
];

const NO_MEDICINE_ALLERGY = "No known medicine allergies";
const NO_FOOD_ALLERGY = "No known food allergies";

const MEDICINE_ALLERGIES = [
  "Amikacin",
  "Amoxicillin",
  "Ampicillin",
  "Aspirin",
  "Azithromycin",
  "Cefaclor",
  "Cefixime",
  "Cefotaxime",
  "Cefpodoxime",
  "Cefprozil",
  "Ceftriaxone",
  "Cephalexin",
  "Chloramphenicol",
  "Ciprofloxacin",
  "Clarithromycin",
  "Clindamycin",
  "Codeine",
  "Doxycycline",
  "Erythromycin",
  "Flucloxacillin",
  "Gentamicin",
  "Ibuprofen",
  "Insulin",
  "Isoniazid",
  "Ketoconazole",
  "Levofloxacin",
  "Lidocaine",
  "Metformin",
  "Metronidazole",
  "Morphine",
  "Naproxen",
  "Neomycin",
  "Nitrofurantoin",
  "Omeprazole",
  "Penicillin",
  "Phenobarbital",
  "Phenytoin",
  "Prednisolone",
  "Procaine",
  "Rifampicin",
  "Streptomycin",
  "Sulfamethoxazole",
  "Sulfasalazine",
  "Tetracycline",
  "Trimethoprim",
  "Vancomycin",
];

const FOOD_ALLERGIES = [
  "Almonds",
  "Brazil Nuts",
  "Cashews",
  "Celery",
  "Coconut",
  "Eggs",
  "Fish",
  "Hazelnuts",
  "Lupin",
  "Milk",
  "Mustard",
  "Peanuts",
  "Pistachios",
  "Sesame",
  "Shellfish",
  "Soy",
  "Walnuts",
  "Wheat",
];

function getSavedArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function PatientProfile() {
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();
  const { t, isUrdu } = useLanguage();

  const medicineDropdownRef = useRef(null);
  const foodDropdownRef = useRef(null);

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    conditions: "",
    allergies: "",
    medicineAllergies: [],
    foodAllergies: [],
    lahoreArea: "",
  });

  const [medicineSearch, setMedicineSearch] = useState("");
  const [foodSearch, setFoodSearch] = useState("");

  const [showMedicineOptions, setShowMedicineOptions] =
    useState(false);

  const [showFoodOptions, setShowFoodOptions] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const savedProfile = currentUser.profile || {};

    setForm({
      fullName:
        currentUser.fullName || savedProfile.fullName || "",
      email: currentUser.email || savedProfile.email || "",
      age: savedProfile.age || "",
      gender: savedProfile.gender || "",
      conditions: savedProfile.conditions || "",
      allergies: savedProfile.allergies || "",
      medicineAllergies: getSavedArray(
        savedProfile.medicineAllergies
      ),
      foodAllergies: getSavedArray(
        savedProfile.foodAllergies
      ),
      lahoreArea: savedProfile.lahoreArea || "",
    });
  }, [navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        medicineDropdownRef.current &&
        !medicineDropdownRef.current.contains(event.target)
      ) {
        setShowMedicineOptions(false);
      }

      if (
        foodDropdownRef.current &&
        !foodDropdownRef.current.contains(event.target)
      ) {
        setShowFoodOptions(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleMedicineAllergy(item) {
    setForm((previous) => {
      if (item === NO_MEDICINE_ALLERGY) {
        return {
          ...previous,
          medicineAllergies: [NO_MEDICINE_ALLERGY],
        };
      }

      const withoutNone = previous.medicineAllergies.filter(
        (allergy) => allergy !== NO_MEDICINE_ALLERGY
      );

      const alreadySelected = withoutNone.includes(item);

      return {
        ...previous,
        medicineAllergies: alreadySelected
          ? withoutNone.filter((allergy) => allergy !== item)
          : [...withoutNone, item],
      };
    });

    setMedicineSearch("");
    setShowMedicineOptions(false);
  }

  function toggleFoodAllergy(item) {
    setForm((previous) => {
      if (item === NO_FOOD_ALLERGY) {
        return {
          ...previous,
          foodAllergies: [NO_FOOD_ALLERGY],
        };
      }

      const withoutNone = previous.foodAllergies.filter(
        (allergy) => allergy !== NO_FOOD_ALLERGY
      );

      const alreadySelected = withoutNone.includes(item);

      return {
        ...previous,
        foodAllergies: alreadySelected
          ? withoutNone.filter((allergy) => allergy !== item)
          : [...withoutNone, item],
      };
    });

    setFoodSearch("");
    setShowFoodOptions(false);
  }

  function removeMedicineAllergy(item) {
    setForm((previous) => ({
      ...previous,
      medicineAllergies: previous.medicineAllergies.filter(
        (allergy) => allergy !== item
      ),
    }));
  }

  function removeFoodAllergy(item) {
    setForm((previous) => ({
      ...previous,
      foodAllergies: previous.foodAllergies.filter(
        (allergy) => allergy !== item
      ),
    }));
  }

  function validateForm() {
    if (!form.fullName.trim()) {
      setMessage(t("pleaseEnterFullName"));
      setMessageType("error");
      return false;
    }

    if (!form.age) {
      setMessage(t("pleaseEnterAge"));
      setMessageType("error");
      return false;
    }

    if (!form.gender) {
      setMessage(t("pleaseSelectGender"));
      setMessageType("error");
      return false;
    }

    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const allSelectedAllergies = [
      ...form.medicineAllergies.filter(
        (item) => item !== NO_MEDICINE_ALLERGY
      ),
      ...form.foodAllergies.filter(
        (item) => item !== NO_FOOD_ALLERGY
      ),
    ];

    const allergies =
      allSelectedAllergies.length > 0
        ? allSelectedAllergies.join(", ")
        : "None known";

    const existingProfile = user?.profile || {};
    const isFirstSave = !existingProfile.profileCompleted;

    const updatedProfile = {
      ...existingProfile,

      fullName: form.fullName.trim(),
      email: form.email.trim(),

      age: form.age,
      gender: form.gender,
      conditions: form.conditions.trim(),

      medicineAllergies: form.medicineAllergies,
      foodAllergies: form.foodAllergies,

      allergies,
      lahoreArea: form.lahoreArea,

      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    const activityTitle = isFirstSave
      ? "Patient profile completed"
      : "Patient profile updated";

    const existingActivity = Array.isArray(user?.recentActivity)
      ? user.recentActivity
      : [];

    const updatedActivity = [
      {
        title: activityTitle,
        date: new Date().toISOString(),
      },
      ...existingActivity,
    ];

    const updatedUser = updateUser({
      ...user,
      fullName: form.fullName.trim(),
      profile: updatedProfile,
      recentActivity: updatedActivity,
    });

    setUser(updatedUser);

    setMessage(
      isFirstSave
        ? t("profileSaved")
        : t("profileUpdated")
    );

    setMessageType("success");

    setShowMedicineOptions(false);
    setShowFoodOptions(false);

    setMedicineSearch("");
    setFoodSearch("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  const medicineAllergyOptions = [
    NO_MEDICINE_ALLERGY,
    ...MEDICINE_ALLERGIES,
  ];

  const foodAllergyOptions = [
    NO_FOOD_ALLERGY,
    ...FOOD_ALLERGIES,
  ];

  const filteredMedicineAllergies =
    medicineAllergyOptions.filter((item) =>
      item.toLowerCase().includes(medicineSearch.toLowerCase())
    );

  const filteredFoodAllergies =
    foodAllergyOptions.filter((item) =>
      item.toLowerCase().includes(foodSearch.toLowerCase())
    );

  if (!user) {
    return null;
  }

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
          >
            <ArrowLeft size={17} />
            <span>{t("dashboard")}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("toggleTheme")}
              title={
                darkMode
                  ? t("switchToLight")
                  : t("switchToDark")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <UserRound size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                {form.fullName || t("patient")}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("patientProfile")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
            {t("myHealth")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("patientProfile")}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t("profileSubtitle")}
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            }`}
          >
            <CheckCircle2 size={16} />
            <p className="text-xs font-medium">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                {t("personalInformation")}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("personalDetails")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label={t("fullName")}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder={t("enterFullName")}
              />

              <FormField
                label={t("email")}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                disabled
              />

              <FormField
                label={t("age")}
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder={t("enterAge")}
                min="1"
                max="120"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("gender")}
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-900/40"
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="Female">{t("female")}</option>
                  <option value="Male">{t("male")}</option>
                  <option value="Other">{t("other")}</option>
                </select>
              </div>
            </div>
          </section>

          {/* Health Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                {t("healthInfo")}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("healthInfoSubtitle")}
              </p>
            </div>

            <div className="space-y-6">
              {/* Existing Conditions */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("existingHealthConditions")}
                </label>

                <textarea
                  name="conditions"
                  value={form.conditions}
                  onChange={handleChange}
                  rows="4"
                  placeholder={t("conditionsPlaceholder")}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-900/40"
                />
              </div>

              {/* Medicine Allergies */}
              <div
                ref={medicineDropdownRef}
                className="relative"
              >
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("medicineAllergies")}
                </label>

                <input
                  type="text"
                  value={medicineSearch}
                  onChange={(event) => {
                    setMedicineSearch(event.target.value);
                    setShowMedicineOptions(true);
                  }}
                  onFocus={() => {
                    setShowMedicineOptions(true);
                  }}
                  placeholder={t("searchMedicine")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-900/40"
                />

                {showMedicineOptions && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    {filteredMedicineAllergies.length > 0 ? (
                      filteredMedicineAllergies.map((item) => {
                        const selected =
                          form.medicineAllergies.includes(item);

                        const displayItem =
                          item === NO_MEDICINE_ALLERGY
                            ? t("noKnownMedicineAllergies")
                            : item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              toggleMedicineAllergy(item)
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              selected
                                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{displayItem}</span>

                            {selected && (
                              <CheckCircle2
                                size={17}
                                className="text-teal-600 dark:text-teal-400"
                              />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {t("noMedicineFound")}
                      </p>
                    )}
                  </div>
                )}

                {/* Selected Medicine Allergies */}
                {form.medicineAllergies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.medicineAllergies.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                      >
                        {item === NO_MEDICINE_ALLERGY
                          ? t("noKnownMedicineAllergies")
                          : item}

                        <button
                          type="button"
                          onClick={() =>
                            removeMedicineAllergy(item)
                          }
                          className="rounded-full p-0.5 transition hover:bg-teal-100 dark:hover:bg-teal-900"
                          aria-label={`${t("remove")} ${item}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Food Allergies */}
              <div ref={foodDropdownRef} className="relative">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("foodAllergies")}
                </label>

                <input
                  type="text"
                  value={foodSearch}
                  onChange={(event) => {
                    setFoodSearch(event.target.value);
                    setShowFoodOptions(true);
                  }}
                  onFocus={() => {
                    setShowFoodOptions(true);
                  }}
                  placeholder={t("searchFood")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-900/40"
                />

                {showFoodOptions && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    {filteredFoodAllergies.length > 0 ? (
                      filteredFoodAllergies.map((item) => {
                        const selected =
                          form.foodAllergies.includes(item);

                        const displayItem =
                          item === NO_FOOD_ALLERGY
                            ? t("noKnownFoodAllergies")
                            : item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              toggleFoodAllergy(item)
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              selected
                                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{displayItem}</span>

                            {selected && (
                              <CheckCircle2
                                size={17}
                                className="text-teal-600 dark:text-teal-400"
                              />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {t("noFoodFound")}
                      </p>
                    )}
                  </div>
                )}

                {/* Selected Food Allergies */}
                {form.foodAllergies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.foodAllergies.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                      >
                        {item === NO_FOOD_ALLERGY
                          ? t("noKnownFoodAllergies")
                          : item}

                        <button
                          type="button"
                          onClick={() => removeFoodAllergy(item)}
                          className="rounded-full p-0.5 transition hover:bg-teal-100 dark:hover:bg-teal-900"
                          aria-label={`${t("remove")} ${item}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {t("location")}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("optionalLocation")}
                </p>
              </div>
            </div>

            <select
              name="lahoreArea"
              value={form.lahoreArea}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-900/40"
            >
              <option value="">{t("selectArea")}</option>

              {LAHORE_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </section>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t("signOut")}
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              <Save size={18} />
              {t("saveProfile")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}