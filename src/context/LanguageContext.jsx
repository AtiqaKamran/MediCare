import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LANGUAGE_STORAGE_KEY = "medicare-language";

const SUPPORTED_LANGUAGES = {
  ENGLISH: "en",
  URDU: "ur",
};

const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.ENGLISH;

const translations = {
  en: {
    // Language Selection
    welcome: "Welcome to MediCare",
    chooseLanguage: "Please select your preferred language",
    english: "English",
    urdu: "اردو",
    continue: "Continue",
    changeLanguage: "Change Language",

    // Navigation
    dashboard: "Dashboard",
    myHealth: "My Health",
    symptoms: "Symptoms",
    doctors: "Doctors",
    logout: "Sign out",

    // Login
    welcomeBack: "Welcome back",
    loginSubtitle: "Login to access your MediCare patient portal.",
    emailAddress: "Email Address",
    password: "Password",
    enterPassword: "Enter your password",
    login: "Login",
    noAccount: "Don't have an account?",
    createAccount: "Create Account",
    noAccountFound: "No account was found with this email.",
    incorrectPassword: "Incorrect password.",

    // Signup
    createYourAccount: "Create your account",
    signupSubtitle: "Create your MediCare account to get started.",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    confirmPassword: "Confirm Password",
    atLeast6Characters: "At least 6 characters",
    reEnterPassword: "Re-enter your password",
    alreadyHaveAccount: "Already have an account?",
    pleaseEnterName: "Please enter your name.",
    pleaseEnterEmail: "Please enter your email.",
    passwordMinLength: "Password must contain at least 6 characters.",
    passwordsDoNotMatch: "Passwords do not match.",
    emailAlreadyExists: "An account with this email already exists.",

    // Dashboard
    patientDashboard: "Patient Dashboard",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    hello: "Hello",
    quickActions: "Quick Actions",
    checkSymptoms: "Check Your Symptoms",
    findDoctor: "Find a Doctor",
    healthInformation: "My Health Information",
    recentActivity: "Recent Activity",
    edit: "Edit Profile",
    settings: "Settings",
    customizeExperience: "Customize your experience",
    appearance: "Appearance",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "Language",
    patientPortal: "PATIENT PORTAL",
    patient: "Patient",
    personalHealthSpace: "Your personal health space",
    dashboardWelcome:
      "Welcome to your MediCare portal. Manage your health information and access your healthcare tools from one convenient place.",
    viewHealthProfile: "View My Health Profile",
    profile: "Profile",
    health: "Health",
    area: "Area",
    notAdded: "Not added",
    notProvided: "Not provided",
    availableNow: "Available Now",
    comingSoon: "Coming Soon",
    symptomDescription:
      "Select your symptoms, duration, and severity to receive general health guidance and self-care information.",
    startSymptomCheck: "Start Symptom Check",
    doctorDescription:
      "Explore doctors by specialty, location, ratings, experience, and profile information.",
    findDoctors: "Find Doctors",
    healthcareTools: "Your healthcare tools, all in one place.",
    savedHealthDetails: "Your saved personal health details.",
    existingConditions: "Existing Health Conditions",
    lahoreArea: "Lahore Area",
    latestUpdates: "Your latest updates",
    profileUpdated: "Profile updated",
    recently: "Recently",
    noRecentActivity: "No recent activity yet.",
    healthNotice: "Health Information Notice",
    healthDisclaimer:
      "MediCare provides general health information and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.",
    footer: "MediCare Patient Portal",

    // Patient Information
    age: "Age",
    gender: "Gender",
    location: "Location",
    allergies: "Allergies",
    noAllergies: "None known",
    noneProvided: "None provided",

    // Patient Profile
    patientProfile: "Patient Profile",
    profileSubtitle:
      "Keep your personal and health information updated so MediCare can provide a more personalized experience.",
    personalInformation: "Personal Information",
    personalDetails: "Your basic personal details.",
    email: "Email",
    enterEmail: "Enter your email",
    enterAge: "Enter your age",
    selectGender: "Select gender",
    female: "Female",
    male: "Male",
    other: "Other",
    healthInfo: "Health Information",
    healthInfoSubtitle: "Add existing conditions and known allergies.",
    medicineAllergies: "Medicine Allergies",
    foodAllergies: "Food Allergies",
    searchMedicine: "Search medicine allergy...",
    searchFood: "Search food allergy...",
    noMedicineFound: "No medicine found.",
    noFoodFound: "No food found.",
    noKnownMedicineAllergies: "No known medicine allergies",
    noKnownFoodAllergies: "No known food allergies",
    existingHealthConditions: "Existing Health Conditions",
    conditionsPlaceholder:
      "Example: Asthma, diabetes, high blood pressure...",
    optionalLocation: "Optional — select your area within Lahore.",
    selectArea: "Select Lahore area (optional)",
    saveProfile: "Save Profile",
    signOut: "Sign out",
    toggleTheme: "Toggle theme",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    pleaseEnterFullName: "Please enter your full name.",
    pleaseEnterAge: "Please enter your age.",
    pleaseSelectGender: "Please select your gender.",
    profileSaved: "Profile saved successfully!",
    profileUpdated: "Profile updated successfully!",
    remove: "Remove",
  },

  ur: {
    // Language Selection
    welcome: "میڈی کیئر میں خوش آمدید",
    chooseLanguage: "براہ کرم اپنی پسندیدہ زبان منتخب کریں",
    english: "English",
    urdu: "اردو",
    continue: "جاری رکھیں",
    changeLanguage: "زبان تبدیل کریں",

    // Navigation
    dashboard: "ڈیش بورڈ",
    myHealth: "میری صحت",
    symptoms: "علامات",
    doctors: "ڈاکٹرز",
    logout: "لاگ آؤٹ",

    // Login
    welcomeBack: "واپس خوش آمدید",
    loginSubtitle:
      "اپنے میڈی کیئر مریض پورٹل تک رسائی کے لیے لاگ اِن کریں۔",
    emailAddress: "ای میل ایڈریس",
    password: "پاس ورڈ",
    enterPassword: "اپنا پاس ورڈ درج کریں",
    login: "لاگ اِن",
    noAccount: "کیا آپ کا اکاؤنٹ نہیں ہے؟",
    createAccount: "اکاؤنٹ بنائیں",
    noAccountFound: "اس ای میل کے ساتھ کوئی اکاؤنٹ نہیں ملا۔",
    incorrectPassword: "پاس ورڈ غلط ہے۔",

    // Signup
    createYourAccount: "اپنا اکاؤنٹ بنائیں",
    signupSubtitle: "شروع کرنے کے لیے اپنا میڈی کیئر اکاؤنٹ بنائیں۔",
    fullName: "پورا نام",
    enterFullName: "اپنا پورا نام درج کریں",
    confirmPassword: "پاس ورڈ کی تصدیق کریں",
    atLeast6Characters: "کم از کم 6 حروف",
    reEnterPassword: "اپنا پاس ورڈ دوبارہ درج کریں",
    alreadyHaveAccount: "کیا آپ کا پہلے سے اکاؤنٹ ہے؟",
    pleaseEnterName: "براہ کرم اپنا نام درج کریں۔",
    pleaseEnterEmail: "براہ کرم اپنی ای میل درج کریں۔",
    passwordMinLength: "پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔",
    passwordsDoNotMatch: "دونوں پاس ورڈ ایک جیسے نہیں ہیں۔",
    emailAlreadyExists: "اس ای میل کے ساتھ اکاؤنٹ پہلے سے موجود ہے۔",

    // Dashboard
    patientDashboard: "مریض کا ڈیش بورڈ",
    goodMorning: "صبح بخیر",
    goodAfternoon: "دوپہر بخیر",
    goodEvening: "شام بخیر",
    hello: "السلام علیکم",
    quickActions: "فوری سہولیات",
    checkSymptoms: "اپنی علامات چیک کریں",
    findDoctor: "ڈاکٹر تلاش کریں",
    healthInformation: "میری صحت کی معلومات",
    recentActivity: "حالیہ سرگرمیاں",
    edit: "پروفائل میں ترمیم کریں",
    settings: "ترتیبات",
    customizeExperience: "اپنی سہولت کے مطابق تبدیلی کریں",
    appearance: "ظاہری انداز",
    lightMode: "لائٹ موڈ",
    darkMode: "ڈارک موڈ",
    language: "زبان",
    patientPortal: "مریضوں کا پورٹل",
    patient: "مریض",
    personalHealthSpace: "آپ کی ذاتی صحت کی جگہ",
    dashboardWelcome:
      "میڈی کیئر پورٹل میں خوش آمدید۔ اپنی صحت کی معلومات کا انتظام کریں اور تمام طبی سہولیات ایک ہی جگہ سے حاصل کریں۔",
    viewHealthProfile: "میری صحت کا پروفائل دیکھیں",
    profile: "پروفائل",
    health: "صحت",
    area: "علاقہ",
    notAdded: "شامل نہیں کیا گیا",
    notProvided: "فراہم نہیں کیا گیا",
    availableNow: "اب دستیاب ہے",
    comingSoon: "جلد دستیاب ہوگا",
    symptomDescription:
      "عمومی صحت سے متعلق رہنمائی اور خود نگہداشت کی معلومات حاصل کرنے کے لیے اپنی علامات، دورانیہ اور شدت منتخب کریں۔",
    startSymptomCheck: "علامات چیک کرنا شروع کریں",
    doctorDescription:
      "ڈاکٹرز کو ان کی تخصص، مقام، ریٹنگ، تجربے اور پروفائل کی معلومات کے مطابق تلاش کریں۔",
    findDoctors: "ڈاکٹرز تلاش کریں",
    healthcareTools: "آپ کی صحت سے متعلق تمام سہولیات ایک ہی جگہ۔",
    savedHealthDetails: "آپ کی محفوظ کردہ ذاتی صحت کی معلومات۔",
    existingConditions: "موجودہ طبی مسائل",
    lahoreArea: "لاہور کا علاقہ",
    latestUpdates: "آپ کی تازہ ترین تبدیلیاں",
    profileUpdated: "پروفائل اپ ڈیٹ کیا گیا",
    recently: "حال ہی میں",
    noRecentActivity: "ابھی کوئی حالیہ سرگرمی موجود نہیں۔",
    healthNotice: "صحت سے متعلق اہم اطلاع",
    healthDisclaimer:
      "میڈی کیئر عمومی صحت کی معلومات فراہم کرتا ہے اور پیشہ ورانہ طبی مشورے، تشخیص یا علاج کا متبادل نہیں ہے۔ طبی مسائل کے لیے ہمیشہ کسی مستند طبی ماہر سے مشورہ کریں۔",
    footer: "میڈی کیئر مریض پورٹل",

    // Patient Information
    age: "عمر",
    gender: "جنس",
    location: "مقام",
    allergies: "الرجی",
    noAllergies: "کوئی معلوم الرجی نہیں",
    noneProvided: "کوئی معلومات فراہم نہیں کی گئیں",

    // Patient Profile
    patientProfile: "مریض کا پروفائل",
    profileSubtitle:
      "اپنی ذاتی اور صحت سے متعلق معلومات کو اپ ڈیٹ رکھیں تاکہ میڈی کیئر آپ کو بہتر سہولیات فراہم کر سکے۔",
    personalInformation: "ذاتی معلومات",
    personalDetails: "آپ کی بنیادی ذاتی معلومات۔",
    email: "ای میل",
    enterEmail: "اپنی ای میل درج کریں",
    enterAge: "اپنی عمر درج کریں",
    selectGender: "جنس منتخب کریں",
    female: "خاتون",
    male: "مرد",
    other: "دیگر",
    healthInfo: "صحت سے متعلق معلومات",
    healthInfoSubtitle: "موجودہ طبی مسائل اور معلوم الرجی شامل کریں۔",
    medicineAllergies: "ادویات سے الرجی",
    foodAllergies: "غذاؤں سے الرجی",
    searchMedicine: "ادویات سے الرجی تلاش کریں...",
    searchFood: "غذاؤں سے الرجی تلاش کریں...",
    noMedicineFound: "کوئی دوا نہیں ملی۔",
    noFoodFound: "کوئی غذا نہیں ملی۔",
    noKnownMedicineAllergies: "ادویات سے کوئی معلوم الرجی نہیں",
    noKnownFoodAllergies: "غذاؤں سے کوئی معلوم الرجی نہیں",
    existingHealthConditions: "موجودہ طبی مسائل",
    conditionsPlaceholder:
      "مثال: دمہ، ذیابیطس، ہائی بلڈ پریشر...",
    optionalLocation: "اختیاری — لاہور میں اپنا علاقہ منتخب کریں۔",
    selectArea: "لاہور کا علاقہ منتخب کریں (اختیاری)",
    saveProfile: "پروفائل محفوظ کریں",
    signOut: "لاگ آؤٹ",
    toggleTheme: "تھیم تبدیل کریں",
    switchToLight: "لائٹ موڈ پر جائیں",
    switchToDark: "ڈارک موڈ پر جائیں",
    pleaseEnterFullName: "براہ کرم اپنا پورا نام درج کریں۔",
    pleaseEnterAge: "براہ کرم اپنی عمر درج کریں۔",
    pleaseSelectGender: "براہ کرم اپنی جنس منتخب کریں۔",
    profileSaved: "پروفائل کامیابی سے محفوظ ہو گیا!",
    profileUpdated: "پروفائل کامیابی سے اپ ڈیٹ ہو گیا!",
    remove: "ہٹائیں",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

      return Object.values(SUPPORTED_LANGUAGES).includes(
        savedLanguage
      )
        ? savedLanguage
        : null;
    } catch (error) {
      console.error("Unable to read saved language:", error);
      return null;
    }
  });

  const setLanguage = useCallback((newLanguage) => {
    if (
      !Object.values(SUPPORTED_LANGUAGES).includes(newLanguage)
    ) {
      console.warn("Unsupported language:", newLanguage);
      return;
    }

    try {
      localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        newLanguage
      );
    } catch (error) {
      console.error("Unable to save language:", error);
    }

    setLanguageState(newLanguage);
  }, []);

  const t = useCallback(
    (key) => {
      const activeLanguage = language || DEFAULT_LANGUAGE;

      return (
        translations[activeLanguage]?.[key] ??
        translations[DEFAULT_LANGUAGE]?.[key] ??
        key
      );
    },
    [language]
  );

  useEffect(() => {
    const activeLanguage = language || DEFAULT_LANGUAGE;

    const direction =
      activeLanguage === SUPPORTED_LANGUAGES.URDU
        ? "rtl"
        : "ltr";

    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [language]);

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isUrdu: language === SUPPORTED_LANGUAGES.URDU,
      isEnglish: language === SUPPORTED_LANGUAGES.ENGLISH,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider. " +
        "Wrap your application with LanguageProvider."
    );
  }

  return context;
}