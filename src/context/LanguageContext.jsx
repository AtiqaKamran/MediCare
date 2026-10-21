import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LANGUAGE_STORAGE_KEY = "medicare-language";
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "ur"];

const translations = {
  en: {
      // Authentication
welcomeBack: "Welcome Back",
loginSubtitle: "Sign in to access your health dashboard",
createYourAccount: "Create Your Account",
signupSubtitle: "Create an account to manage your health",
emailAddress: "Email Address",
password: "Password",
confirmPassword: "Confirm Password",
forgotPassword: "Forgot Password?",
enterPassword: "Enter your password",
atLeast6Characters: "At least 6 characters",
reEnterPassword: "Re-enter your password",
dontHaveAccount: "Don't have an account?",
noAccount: "Don't have an account?",
alreadyHaveAccount: "Already have an account?",
createAccount: "Create Account",
login: "Login",
signingIn: "Signing in...",
pleaseEnterName: "Please enter your full name.",
pleaseEnterEmail: "Please enter your email address.",
passwordMinLength: "Password must be at least 6 characters.",
passwordsDoNotMatch: "Passwords do not match.",
accountCreatedCheckEmail: "Account created! Check your email for a verification link, then log in.",
loginSuccessful: "Login successful",
logoutSuccessful: "Logged out successfully",
invalidEmail: "Please enter a valid email address",
passwordRequired: "Password is required",
requiredField: "This field is required",

    // General
    appName: "MediCare",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    update: "Update",
    delete: "Delete",
    back: "Back",
    next: "Next",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh",
    close: "Close",
    yes: "Yes",
    no: "No",
    none: "None",
    notAdded: "Not added",
    notProvided: "Not provided",
    noData: "No data available",
    error: "Something went wrong",
    success: "Success",
    welcome: "Welcome",
    hello: "Hello",
    patient: "Patient",
    patientPortal: "Patient Portal",
    personalHealthSpace: "Your Personal Health Space",
    findDoctor: "Find a Doctor",
    doctorDescription: "Find doctors and clinics near you.",
    lahoreArea: "Area in Lahore",
    recently: "Recently",
    footer: "MediCare. All rights reserved.",
    noAllergies: "No known allergies",
    noneKnown: "None known",
    noneProvided: "None provided",
    remove: "Remove",
    toggleTheme: "Toggle theme",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    enterFullName: "Enter your full name",
    pleaseEnterFullName: "Please enter your full name.",
    pleaseEnterAge: "Please enter your age.",
    pleaseSelectGender: "Please select your gender.",
    noKnownMedicineAllergies: "No known medicine allergies",
    noKnownFoodAllergies: "No known food allergies",
    searchMedicine: "Search medicines...",
    searchFood: "Search foods...",
    noMedicineFound: "No medicines found.",
    noFoodFound: "No foods found.",
    conditionsPlaceholder: "Describe any existing health conditions...",
    profileSubtitle:
      "Manage your personal information and health details.",
    healthInfo: "Health Information",
    healthInfoSubtitle:
      "Add your existing health conditions and allergies.",
    existingHealthConditions: "Existing Health Conditions",
    medicineAllergies: "Medicine Allergies",
    foodAllergies: "Food Allergies",
    optionalLocation: "Add your area to help find nearby doctors.",
    selectArea: "Select area",
    signOut: "Sign Out",
    myHealthRecords: "My Health Records",
    medicalRecordsDescription:
      "Organize your lab reports, prescriptions, X-rays and other medical documents in one place.",

    // Navigation
    dashboard: "Dashboard",
    home: "Home",
    profile: "Profile",
    patientProfile: "Patient Profile",
    myHealth: "My Health",
    healthProfile: "Health Profile",
    symptomChecker: "Symptom Checker",
    doctorFinder: "Doctor Finder",
    medicalHistory: "Medical History",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    signup: "Sign Up",

    // Dashboard
    patientDashboard: "Patient Dashboard",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    goodNight: "Good night",
    dashboardWelcome: "Welcome to your health dashboard",
    viewHealthProfile: "View Health Profile",
    quickActions: "Quick Actions",
    healthcareTools: "Healthcare Tools",
    checkSymptoms: "Check Symptoms",
    symptomDescription: "Check your symptoms and get guidance.",
    startSymptomCheck: "Start Symptom Check",
    findDoctors: "Find Doctors",
    doctorFinderDescription:
      "Find doctors and clinics near your location.",
    findDoctorsButton: "Search Doctors",
    viewMedicalHistory: "View Medical History",
    medicalHistoryDescription:
      "Review your previous symptom checks and recommendations.",
    openRecords: "Open Records",
    openMedicalRecords: "Open Medical Records",
    myMedicalRecords: "My Medical Records",
    healthInformation: "Health Information",
    savedHealthDetails: "Your saved health details",
    recentActivity: "Recent Activity",
    latestUpdates: "Your latest updates",
    healthNotice: "Health Notice",
    healthDisclaimer:
      "This information is for guidance only and is not a substitute for professional medical advice.",
    patientProfileCompleted: "Patient profile completed",
    profileCompleted: "Profile completed",
    noRecentActivity: "No recent activity yet.",
    healthcareDashboard: "Healthcare Dashboard",

    // Greetings and dates
    today: "Today",
    yesterday: "Yesterday",
    date: "Date",
    time: "Time",
    completed: "Completed",
    pending: "Pending",

    // Patient profile
    personalInformation: "Personal Information",
    personalDetails: "Personal Details",
    fullName: "Full Name",
    name: "Name",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    location: "Location",
    area: "Area",
    city: "City",
    email: "Email",
    phone: "Phone Number",
    dateOfBirth: "Date of Birth",
    patientInformation: "Patient Information",
    healthProfileDetails: "Your health profile details",
    updateProfile: "Update Profile",
    saveProfile: "Save Profile",
    profileUpdated: "Profile updated successfully",
    profileSaved: "Profile saved successfully",
    enterName: "Enter your name",
    enterAge: "Enter your age",
    selectGender: "Select gender",
    enterLocation: "Enter your location",
    enterCity: "Enter your city",
    profileRequired: "Please complete your profile",
    profileNotCompleted: "Your profile is incomplete",

    // Health information
    health: "Health",
    healthDetails: "Health Details",
    healthInformationTitle: "Health Information",
    existingConditions: "Existing Conditions",
    medicalConditions: "Medical Conditions",
    allergies: "Allergies",
    medications: "Medications",
    currentMedications: "Current Medications",
    addCondition: "Add Condition",
    addAllergy: "Add Allergy",
    addMedication: "Add Medication",
    enterCondition: "Enter existing conditions",
    enterAllergy: "Enter allergies",
    enterMedication: "Enter medications",
    healthHistory: "Health History",
    healthInformationSaved:
      "Your health information has been saved.",
    editHealthInformation: "Edit Health Information",
    saveHealthInformation: "Save Health Information",

    // My Health page
    myMedicalHistory: "My Medical History",
    healthRecords: "Health Records",
    previousSymptomChecks: "Previous Symptom Checks",
    previousRecommendations: "Previous Recommendations",
    savedHealthRecords: "Your saved health records",
    noHealthRecords: "No health records found.",
    noMedicalHistory: "No medical history available.",
    symptomCheckHistory: "Symptom Check History",
    recommendations: "Recommendations",
    details: "Details",
    viewDetails: "View Details",
    recordDate: "Record Date",
    healthSummary: "Health Summary",

    // Symptom checker
    symptoms: "Symptoms",
    symptomCheckerTitle: "Symptom Checker",
    describeSymptoms: "Describe Your Symptoms",
    symptomDescriptionLabel: "Symptom Description",
    enterSymptoms: "Enter the symptoms you are experiencing",
    selectSymptoms: "Select your symptoms",
    duration: "Duration",
    symptomDuration: "How long have you had these symptoms?",
    severity: "Severity",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    additionalInformation: "Additional Information",
    additionalNotes: "Additional Notes",
    enterAdditionalNotes: "Enter any additional information",
    analyzeSymptoms: "Analyze Symptoms",
    checkMySymptoms: "Check My Symptoms",
    startAnalysis: "Start Analysis",
    analyzingSymptoms: "Analyzing symptoms...",
    symptomResults: "Symptom Check Results",
    possibleCauses: "Possible Causes",
    suggestedActions: "Suggested Actions",
    selfCareGuidance: "Self-Care Guidance",
    recommendedCare: "Recommended Care",
    medicineInformation: "Medicine Information",
    precautions: "Precautions",
    whenToSeeDoctor: "When to See a Doctor",
    emergencyWarning: "Emergency Warning",
    symptomCheckerDescription:
  "Select the symptoms you are experiencing to explore general health information, self-care suggestions, and medicine safety considerations.",
    symptomCheckerDisclaimer:
      "This tool provides general guidance only and does not provide a medical diagnosis.",
    symptomCheckSaved: "Your symptom check has been saved.",
    noSymptomsEntered: "Please enter your symptoms.",
    selectDuration: "Select symptom duration",
    selectSeverity: "Select severity",
    symptomCheckFailed:
      "Unable to complete symptom check. Please try again.",

    // Doctor Finder
    doctorFinderTitle: "Doctor Finder",
    findDoctorsNearYou: "Find doctors and clinics near you.",
    searchDoctors: "Search Doctors",
    searchByName: "Search by doctor name",
    searchByLocation: "Search by location",
    searchBySpecialty: "Search by specialty",
    allSpecialties: "All Specialties",
    allLocations: "All Locations",
    specialty: "Specialty",
    specialization: "Specialization",
    doctor: "Doctor",
    doctors: "Doctors",
    clinic: "Clinic",
    hospital: "Hospital",
    address: "Address",
    rating: "Rating",
    experience: "Experience",
    yearsExperience: "years of experience",
    contact: "Contact",
    viewDoctor: "View Doctor",
    viewMore: "View More",
    noDoctorsFound: "No doctors found.",
    noDoctorsAvailable: "No doctors available right now.",
    tryDifferentSearch: "Try a different search or filter.",
    doctorDetails: "Doctor Details",
    generalPhysician: "General Physician",
    cardiologist: "Cardiologist",
    dermatologist: "Dermatologist",
    dentist: "Dentist",
    pediatrician: "Pediatrician",
    gynecologist: "Gynecologist",
    neurologist: "Neurologist",
    psychiatrist: "Psychiatrist",
    orthopedic: "Orthopedic Specialist",
    ophthalmologist: "Eye Specialist",
    entSpecialist: "ENT Specialist",
    unavailable: "Unavailable",
    unableToLoadDoctors:
      "Unable to load doctors. Please try again.",
    externalLink: "More Information",

    // Settings
    customizeExperience: "Customize Experience",
    appearance: "Appearance",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    language: "Language",
    selectLanguage: "Select Language",
    English: "English",
    Urdu: "Urdu",
    english: "English",
    urdu: "Urdu",
    preferences: "Preferences",
    accountSettings: "Account Settings",
    settingsSaved: "Settings saved successfully",

    // Authentication
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    enterPassword: "Enter your password",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    loginSuccessful: "Login successful",
    logoutSuccessful: "Logged out successfully",
    invalidEmail: "Please enter a valid email address",
    passwordRequired: "Password is required",
    requiredField: "This field is required",

    // Errors and status
    somethingWentWrong: "Something went wrong. Please try again.",
    networkError: "Network error. Please check your connection.",
    dataLoadError: "Unable to load data.",
    dataSaveError: "Unable to save data.",
    tryAgain: "Try Again",
    noResults: "No results found.",
    comingSoon: "Coming Soon",
  },

  ur: {

    // Authentication
welcomeBack: "واپس خوش آمدید",
loginSubtitle: "اپنے صحت کے ڈیش بورڈ میں داخل ہونے کے لیے لاگ اِن کریں",
createYourAccount: "اپنا اکاؤنٹ بنائیں",
signupSubtitle: "اپنی صحت کا انتظام کرنے کے لیے اکاؤنٹ بنائیں",
emailAddress: "ای میل ایڈریس",
password: "پاس ورڈ",
confirmPassword: "پاس ورڈ کی تصدیق کریں",
forgotPassword: "پاس ورڈ بھول گئے؟",
enterPassword: "اپنا پاس ورڈ درج کریں",
atLeast6Characters: "کم از کم 6 حروف درج کریں",
reEnterPassword: "اپنا پاس ورڈ دوبارہ درج کریں",
dontHaveAccount: "کیا آپ کا اکاؤنٹ نہیں ہے؟",
noAccount: "کیا آپ کا اکاؤنٹ نہیں ہے؟",
alreadyHaveAccount: "کیا آپ کا پہلے سے اکاؤنٹ ہے؟",
createAccount: "اکاؤنٹ بنائیں",
login: "لاگ اِن",
signingIn: "لاگ اِن ہو رہا ہے...",
pleaseEnterName: "براہِ کرم اپنا پورا نام درج کریں۔",
pleaseEnterEmail: "براہِ کرم اپنا ای میل ایڈریس درج کریں۔",
passwordMinLength: "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔",
passwordsDoNotMatch: "دونوں پاس ورڈ ایک جیسے نہیں ہیں۔",
accountCreatedCheckEmail:
  "اکاؤنٹ بن گیا ہے! تصدیقی لنک کے لیے اپنی ای میل چیک کریں، پھر لاگ اِن کریں۔",
loginSuccessful: "لاگ اِن کامیاب ہو گیا",
logoutSuccessful: "آپ کامیابی سے لاگ آؤٹ ہو گئے",
invalidEmail: "براہِ کرم درست ای میل درج کریں",
passwordRequired: "پاس ورڈ درج کرنا ضروری ہے",
requiredField: "یہ خانہ پُر کرنا ضروری ہے",

    // General
    appName: "میڈی کیئر",
    loading: "لوڈ ہو رہا ہے...",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    edit: "ترمیم کریں",
    update: "اپ ڈیٹ کریں",
    delete: "حذف کریں",
    back: "واپس",
    next: "اگلا",
    submit: "جمع کریں",
    search: "تلاش کریں",
    filter: "فلٹر",
    refresh: "دوبارہ لوڈ کریں",
    close: "بند کریں",
    yes: "ہاں",
    no: "نہیں",
    none: "کوئی نہیں",
    notAdded: "شامل نہیں کیا گیا",
    notProvided: "فراہم نہیں کیا گیا",
    noData: "کوئی معلومات دستیاب نہیں",
    error: "کوئی مسئلہ پیش آ گیا",
    success: "کامیاب",
    welcome: "خوش آمدید",
    hello: "السلام علیکم",
    patient: "مریض",
    patientPortal: "مریضوں کا پورٹل",
    personalHealthSpace: "آپ کی ذاتی صحت کی سہولت",
    findDoctor: "ڈاکٹر تلاش کریں",
    doctorDescription: "اپنے قریب ڈاکٹرز اور کلینکس تلاش کریں۔",
    lahoreArea: "لاہور میں علاقہ",
    recently: "حال ہی میں",
    footer: "میڈی کیئر۔ جملہ حقوق محفوظ ہیں۔",
    noAllergies: "کوئی معلوم الرجی نہیں",
    noneKnown: "کوئی معلوم نہیں",
    noneProvided: "کوئی معلومات فراہم نہیں کی گئیں",
    remove: "ہٹائیں",
    toggleTheme: "تھیم تبدیل کریں",
    switchToLight: "لائٹ موڈ پر جائیں",
    switchToDark: "ڈارک موڈ پر جائیں",
    enterFullName: "اپنا پورا نام درج کریں",
    pleaseEnterFullName: "براہِ کرم اپنا پورا نام درج کریں۔",
    pleaseEnterAge: "براہِ کرم اپنی عمر درج کریں۔",
    pleaseSelectGender: "براہِ کرم اپنی جنس منتخب کریں۔",
    noKnownMedicineAllergies: "کسی دوا سے الرجی معلوم نہیں",
    noKnownFoodAllergies: "کسی غذا سے الرجی معلوم نہیں",
    searchMedicine: "ادویات تلاش کریں...",
    searchFood: "غذائیں تلاش کریں...",
    noMedicineFound: "کوئی دوا نہیں ملی۔",
    noFoodFound: "کوئی غذا نہیں ملی۔",
    conditionsPlaceholder:
      "اپنی موجودہ بیماریوں کی تفصیل درج کریں...",
    profileSubtitle:
      "اپنی ذاتی معلومات اور صحت کی تفصیلات کا انتظام کریں۔",
    healthInfo: "صحت کی معلومات",
    healthInfoSubtitle:
      "اپنی موجودہ بیماریوں اور الرجیز کی معلومات درج کریں۔",
    existingHealthConditions: "موجودہ بیماریاں",
    medicineAllergies: "ادویات سے الرجی",
    foodAllergies: "غذاؤں سے الرجی",
    optionalLocation:
      "قریبی ڈاکٹرز تلاش کرنے کے لیے اپنا علاقہ منتخب کریں۔",
    selectArea: "علاقہ منتخب کریں",
    signOut: "لاگ آؤٹ",
    myHealthRecords: "میرے طبی ریکارڈز",
    medicalRecordsDescription:
      "اپنی لیب رپورٹس، نسخے، ایکس رے اور دیگر طبی دستاویزات ایک جگہ منظم کریں۔",

    // Navigation
    dashboard: "ڈیش بورڈ",
    home: "ہوم",
    profile: "پروفائل",
    patientProfile: "مریض کا پروفائل",
    myHealth: "میری صحت",
    healthProfile: "صحت کا پروفائل",
    symptomChecker: "علامات کی جانچ",
    doctorFinder: "ڈاکٹر تلاش کریں",
    medicalHistory: "طبی تاریخ",
    settings: "ترتیبات",
    logout: "لاگ آؤٹ",
    login: "لاگ اِن",
    signup: "اکاؤنٹ بنائیں",

    // Dashboard
    patientDashboard: "مریض کا ڈیش بورڈ",
    goodMorning: "صبح بخیر",
    goodAfternoon: "خوش آمدید",
    goodEvening: "شام بخیر",
    goodNight: "شب بخیر",
    dashboardWelcome: "آپ کے صحت کے ڈیش بورڈ میں خوش آمدید",
    viewHealthProfile: "صحت کا پروفائل دیکھیں",
    quickActions: "فوری سہولیات",
    healthcareTools: "صحت کی سہولیات",
    checkSymptoms: "علامات چیک کریں",
    symptomDescription: "اپنی علامات چیک کریں اور رہنمائی حاصل کریں۔",
    startSymptomCheck: "علامات کی جانچ شروع کریں",
    findDoctors: "ڈاکٹر تلاش کریں",
    doctorFinderDescription:
      "اپنے قریب ڈاکٹرز اور کلینکس تلاش کریں۔",
    findDoctorsButton: "ڈاکٹرز تلاش کریں",
    viewMedicalHistory: "طبی تاریخ دیکھیں",
    medicalHistoryDescription:
      "اپنی سابقہ علامات کی جانچ اور سفارشات دیکھیں۔",
    openRecords: "ریکارڈز کھولیں",
    openMedicalRecords: "طبی ریکارڈز کھولیں",
    myMedicalRecords: "میرے طبی ریکارڈز",
    healthInformation: "صحت کی معلومات",
    savedHealthDetails: "آپ کی محفوظ شدہ صحت کی تفصیلات",
    recentActivity: "حالیہ سرگرمیاں",
    latestUpdates: "آپ کی تازہ ترین اپ ڈیٹس",
    healthNotice: "صحت سے متعلق اہم اطلاع",
    healthDisclaimer:
      "یہ معلومات صرف رہنمائی کے لیے ہیں اور ڈاکٹر کے مشورے کا متبادل نہیں ہیں۔",
    patientProfileCompleted: "مریض کا پروفائل مکمل ہو گیا",
    profileCompleted: "پروفائل مکمل ہو گیا",
    noRecentActivity: "ابھی تک کوئی حالیہ سرگرمی نہیں۔",
    healthcareDashboard: "صحت کا ڈیش بورڈ",

    // Greetings and dates
    today: "آج",
    yesterday: "گزشتہ روز",
    date: "تاریخ",
    time: "وقت",
    completed: "مکمل",
    pending: "زیرِ انتظار",

    // Patient profile
    personalInformation: "ذاتی معلومات",
    personalDetails: "ذاتی تفصیلات",
    fullName: "پورا نام",
    name: "نام",
    age: "عمر",
    gender: "جنس",
    male: "مرد",
    female: "عورت",
    other: "دیگر",
    location: "مقام",
    area: "علاقہ",
    city: "شہر",
    email: "ای میل",
    phone: "فون نمبر",
    dateOfBirth: "تاریخ پیدائش",
    patientInformation: "مریض کی معلومات",
    healthProfileDetails: "آپ کے صحت کے پروفائل کی تفصیلات",
    updateProfile: "پروفائل اپ ڈیٹ کریں",
    saveProfile: "پروفائل محفوظ کریں",
    profileUpdated: "پروفائل کامیابی سے اپ ڈیٹ ہو گیا",
    profileSaved: "پروفائل کامیابی سے محفوظ ہو گیا",
    enterName: "اپنا نام درج کریں",
    enterAge: "اپنی عمر درج کریں",
    selectGender: "جنس منتخب کریں",
    enterLocation: "اپنا مقام درج کریں",
    enterCity: "اپنا شہر درج کریں",
    profileRequired: "براہِ کرم اپنا پروفائل مکمل کریں",
    profileNotCompleted: "آپ کا پروفائل نامکمل ہے",

    // Health information
    health: "صحت",
    healthDetails: "صحت کی تفصیلات",
    healthInformationTitle: "صحت کی معلومات",
    existingConditions: "موجودہ بیماریاں",
    medicalConditions: "طبی مسائل",
    allergies: "الرجیز",
    medications: "ادویات",
    currentMedications: "موجودہ ادویات",
    addCondition: "بیماری شامل کریں",
    addAllergy: "الرجی شامل کریں",
    addMedication: "دوا شامل کریں",
    enterCondition: "موجودہ بیماریوں کی تفصیل درج کریں",
    enterAllergy: "الرجیز کی تفصیل درج کریں",
    enterMedication: "ادویات کی تفصیل درج کریں",
    healthHistory: "صحت کی تاریخ",
    healthInformationSaved: "آپ کی صحت کی معلومات محفوظ ہو گئی ہیں۔",
    editHealthInformation: "صحت کی معلومات میں ترمیم کریں",
    saveHealthInformation: "صحت کی معلومات محفوظ کریں",

    // My Health page
    myMedicalHistory: "میری طبی تاریخ",
    healthRecords: "طبی ریکارڈز",
    previousSymptomChecks: "علامات کی سابقہ جانچ",
    previousRecommendations: "سابقہ سفارشات",
    savedHealthRecords: "آپ کے محفوظ شدہ طبی ریکارڈز",
    noHealthRecords: "کوئی طبی ریکارڈ نہیں ملا۔",
    noMedicalHistory: "طبی تاریخ دستیاب نہیں۔",
    symptomCheckHistory: "علامات کی جانچ کی تاریخ",
    recommendations: "سفارشات",
    details: "تفصیلات",
    viewDetails: "تفصیلات دیکھیں",
    recordDate: "ریکارڈ کی تاریخ",
    healthSummary: "صحت کا خلاصہ",

    // Symptom checker
    symptoms: "علامات",
    symptomCheckerTitle: "علامات کی جانچ",
    describeSymptoms: "اپنی علامات بیان کریں",
    symptomDescriptionLabel: "علامات کی تفصیل",
    enterSymptoms: "اپنی موجودہ علامات درج کریں",
    selectSymptoms: "اپنی علامات منتخب کریں",
    duration: "دورانیہ",
    symptomDuration: "یہ علامات کتنے عرصے سے ہیں؟",
    severity: "شدت",
    mild: "ہلکی",
    moderate: "درمیانی",
    severe: "شدید",
    additionalInformation: "اضافی معلومات",
    additionalNotes: "اضافی نوٹس",
    enterAdditionalNotes: "مزید معلومات درج کریں",
    analyzeSymptoms: "علامات کا تجزیہ کریں",
    checkMySymptoms: "میری علامات چیک کریں",
    startAnalysis: "تجزیہ شروع کریں",
    analyzingSymptoms: "علامات کا تجزیہ ہو رہا ہے...",
    symptomResults: "علامات کی جانچ کے نتائج",
    possibleCauses: "ممکنہ وجوہات",
    suggestedActions: "تجویز کردہ اقدامات",
    selfCareGuidance: "اپنی دیکھ بھال کے لیے رہنمائی",
    recommendedCare: "تجویز کردہ دیکھ بھال",
    medicineInformation: "ادویات کی معلومات",
    precautions: "احتیاطی تدابیر",
    whenToSeeDoctor: "ڈاکٹر سے کب رجوع کریں",
    emergencyWarning: "ہنگامی صورتحال سے متعلق تنبیہ",
    symptomCheckerDescription:
  "عمومی صحت کی معلومات، اپنی دیکھ بھال کے مشورے اور ادویات سے متعلق احتیاطی تدابیر جاننے کے لیے اپنی علامات منتخب کریں۔",
    symptomCheckerDisclaimer:
      "یہ سہولت صرف عمومی رہنمائی فراہم کرتی ہے، طبی تشخیص نہیں۔",
    symptomCheckSaved: "آپ کی علامات کی جانچ محفوظ ہو گئی ہے۔",
    noSymptomsEntered: "براہِ کرم اپنی علامات درج کریں۔",
    selectDuration: "علامات کا دورانیہ منتخب کریں",
    selectSeverity: "شدت منتخب کریں",
    symptomCheckFailed:
      "علامات کی جانچ مکمل نہیں ہو سکی۔ دوبارہ کوشش کریں۔",

    // Doctor Finder
    doctorFinderTitle: "ڈاکٹر تلاش کریں",
    findDoctorsNearYou: "اپنے قریب ڈاکٹرز اور کلینکس تلاش کریں۔",
    searchDoctors: "ڈاکٹرز تلاش کریں",
    searchByName: "ڈاکٹر کا نام لکھیں",
    searchByLocation: "مقام کے مطابق تلاش کریں",
    searchBySpecialty: "شعبے کے مطابق تلاش کریں",
    allSpecialties: "تمام شعبے",
    allLocations: "تمام مقامات",
    specialty: "شعبہ",
    specialization: "تخصص",
    doctor: "ڈاکٹر",
    doctors: "ڈاکٹرز",
    clinic: "کلینک",
    hospital: "ہسپتال",
    address: "پتہ",
    rating: "درجہ بندی",
    experience: "تجربہ",
    yearsExperience: "سال کا تجربہ",
    contact: "رابطہ",
    viewDoctor: "ڈاکٹر کی تفصیلات دیکھیں",
    viewMore: "مزید دیکھیں",
    noDoctorsFound: "کوئی ڈاکٹر نہیں ملا۔",
    noDoctorsAvailable: "فی الحال کوئی ڈاکٹر دستیاب نہیں۔",
    tryDifferentSearch: "دوسری تلاش یا فلٹر استعمال کریں۔",
    doctorDetails: "ڈاکٹر کی تفصیلات",
    generalPhysician: "جنرل فزیشن",
    cardiologist: "ماہرِ امراضِ قلب",
    dermatologist: "ماہرِ امراضِ جلد",
    dentist: "دانتوں کا ڈاکٹر",
    pediatrician: "بچوں کا ڈاکٹر",
    gynecologist: "ماہرِ امراضِ نسواں",
    neurologist: "ماہرِ اعصاب",
    psychiatrist: "ماہرِ نفسیات",
    orthopedic: "ماہرِ ہڈی و جوڑ",
    ophthalmologist: "ماہرِ امراضِ چشم",
    entSpecialist: "کان، ناک اور گلے کا ماہر",
    unavailable: "دستیاب نہیں",
    unableToLoadDoctors:
      "ڈاکٹرز کی معلومات لوڈ نہیں ہو سکیں۔ دوبارہ کوشش کریں۔",
    externalLink: "مزید معلومات",

    // Settings
    customizeExperience: "اپنی پسند کے مطابق ترتیب دیں",
    appearance: "ظاہری انداز",
    lightMode: "لائٹ موڈ",
    darkMode: "ڈارک موڈ",
    language: "زبان",
    selectLanguage: "زبان منتخب کریں",
    English: "انگریزی",
    Urdu: "اردو",
    english: "انگریزی",
    urdu: "اردو",
    preferences: "ترجیحات",
    accountSettings: "اکاؤنٹ کی ترتیبات",
    settingsSaved: "ترتیبات کامیابی سے محفوظ ہو گئیں",

    // Authentication
    welcomeBack: "واپس خوش آمدید",
    createAccount: "اکاؤنٹ بنائیں",
    password: "پاس ورڈ",
    confirmPassword: "پاس ورڈ کی تصدیق کریں",
    forgotPassword: "پاس ورڈ بھول گئے؟",
    enterPassword: "اپنا پاس ورڈ درج کریں",
    dontHaveAccount: "کیا آپ کا اکاؤنٹ نہیں ہے؟",
    alreadyHaveAccount: "کیا آپ کا پہلے سے اکاؤنٹ ہے؟",
    loginSuccessful: "لاگ اِن کامیاب ہو گیا",
    logoutSuccessful: "آپ کامیابی سے لاگ آؤٹ ہو گئے",
    invalidEmail: "براہِ کرم درست ای میل درج کریں",
    passwordRequired: "پاس ورڈ درج کرنا ضروری ہے",
    requiredField: "یہ خانہ پُر کرنا ضروری ہے",

    // Errors and status
    somethingWentWrong: "کوئی مسئلہ پیش آ گیا۔ دوبارہ کوشش کریں۔",
    networkError: "نیٹ ورک کا مسئلہ ہے۔ اپنا انٹرنیٹ چیک کریں۔",
    dataLoadError: "معلومات لوڈ نہیں ہو سکیں۔",
    dataSaveError: "معلومات محفوظ نہیں ہو سکیں۔",
    tryAgain: "دوبارہ کوشش کریں",
    noResults: "کوئی نتیجہ نہیں ملا۔",
    comingSoon: "جلد دستیاب ہوگا",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }

    try {
      const savedLanguage = window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

      return SUPPORTED_LANGUAGES.includes(savedLanguage)
        ? savedLanguage
        : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const setLanguage = useCallback((newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
      return;
    }

    try {
      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        newLanguage
      );
    } catch {
    }

    setLanguageState(newLanguage);
  }, []);

  const t = useCallback(
    (key) => {
      const activeTranslations =
        translations[language] || translations.en;

      return (
        activeTranslations[key] ??
        translations.en[key] ??
        key
      );
    },
    [language]
  );

  const isUrdu = language === "ur";
  const isEnglish = language === "en";

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const direction = isUrdu ? "rtl" : "ltr";

    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    if (document.body) {
      document.body.dir = direction;
    }
  }, [language, isUrdu]);

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isUrdu,
      isEnglish,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language, setLanguage, t, isUrdu, isEnglish]
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

export default LanguageContext;
