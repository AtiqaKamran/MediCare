import { getCurrentUser, savePatientHistory } from "../utils/storage";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Baby,
  Bandage,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Heart,
  Info,
  LoaderCircle,
  MapPin,
  Moon,
  RotateCcw,
  Search,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  User,
  Wind,
  X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

// --------------------------------------------------
// SYMPTOM CATEGORIES
// --------------------------------------------------

const symptomCategories = [
  {
    name: "General",
    symptoms: [
      "Fever",
      "Chills",
      "Fatigue",
      "Weakness",
      "Body aches",
      "Loss of appetite",
      "Unexplained weight loss",
      "Night sweats",
      "Dizziness",
      "Dehydration",
    ],
  },
  {
    name: "Head",
    symptoms: [
      "Headache",
      "Migraine",
      "Pressure in head",
      "Lightheadedness",
      "Fainting",
      "Confusion",
      "Memory problems",
    ],
  },
  {
    name: "Eyes",
    symptoms: [
      "Eye pain",
      "Red eyes",
      "Blurred vision",
      "Dry eyes",
      "Watery eyes",
      "Itchy eyes",
      "Sensitivity to light",
      "Eye swelling",
    ],
  },
  {
    name: "Ears",
    symptoms: [
      "Earache",
      "Ringing in ears",
      "Reduced hearing",
      "Ear discharge",
      "Ear pressure",
      "Dizziness with ear symptoms",
    ],
  },
  {
    name: "Nose",
    symptoms: [
      "Runny nose",
      "Blocked nose",
      "Sneezing",
      "Nosebleed",
      "Loss of smell",
      "Sinus pressure",
      "Nasal congestion",
    ],
  },
  {
    name: "Mouth & Throat",
    symptoms: [
      "Sore throat",
      "Difficulty swallowing",
      "Dry mouth",
      "Mouth ulcers",
      "Toothache",
      "Bad breath",
      "Hoarse voice",
      "Swollen tonsils",
    ],
  },
  {
    name: "Neck",
    symptoms: [
      "Neck pain",
      "Neck stiffness",
      "Swollen glands",
      "Limited neck movement",
    ],
  },
  {
    name: "Chest & Breathing",
    symptoms: [
      "Chest pain",
      "Shortness of breath",
      "Cough",
      "Dry cough",
      "Cough with mucus",
      "Wheezing",
      "Fast heartbeat",
      "Palpitations",
      "Chest tightness",
    ],
  },
  {
    name: "Back",
    symptoms: [
      "Lower back pain",
      "Upper back pain",
      "Middle back pain",
      "Back stiffness",
      "Pain radiating to legs",
    ],
  },
  {
    name: "Arms",
    symptoms: [
      "Arm pain",
      "Shoulder pain",
      "Elbow pain",
      "Arm weakness",
      "Arm numbness",
      "Tingling in arms",
    ],
  },
  {
    name: "Hands",
    symptoms: [
      "Hand pain",
      "Wrist pain",
      "Finger pain",
      "Hand swelling",
      "Hand numbness",
      "Tingling in fingers",
      "Reduced grip strength",
    ],
  },
  {
    name: "Abdomen",
    symptoms: [
      "Abdominal pain",
      "Stomach cramps",
      "Bloating",
      "Gas",
      "Heartburn",
      "Acid reflux",
      "Abdominal swelling",
      "Pain after eating",
    ],
  },
  {
    name: "Digestive System",
    symptoms: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Indigestion",
      "Loss of appetite",
      "Blood in stool",
      "Black stool",
      "Difficulty passing stool",
    ],
  },
  {
    name: "Urinary",
    symptoms: [
      "Painful urination",
      "Frequent urination",
      "Blood in urine",
      "Cloudy urine",
      "Difficulty urinating",
      "Urgent need to urinate",
      "Lower abdominal discomfort",
    ],
  },
  {
    name: "Pelvic & Reproductive",
    symptoms: [
      "Pelvic pain",
      "Menstrual cramps",
      "Irregular periods",
      "Heavy menstrual bleeding",
      "Unusual discharge",
      "Pain during menstruation",
    ],
  },
  {
    name: "Legs",
    symptoms: [
      "Leg pain",
      "Knee pain",
      "Ankle pain",
      "Leg swelling",
      "Muscle cramps",
      "Leg weakness",
      "Numbness in legs",
      "Tingling in legs",
    ],
  },
  {
    name: "Feet",
    symptoms: [
      "Foot pain",
      "Heel pain",
      "Sole pain",
      "Toe pain",
      "Foot swelling",
      "Burning feet",
      "Numbness in feet",
    ],
  },
  {
    name: "Skin",
    symptoms: [
      "Rash",
      "Itching",
      "Dry skin",
      "Redness",
      "Hives",
      "Skin swelling",
      "Acne",
      "Blisters",
      "Skin discoloration",
      "Unusual bruising",
    ],
  },
  {
    name: "Mental Health & Sleep",
    symptoms: [
      "Anxiety",
      "Stress",
      "Low mood",
      "Difficulty sleeping",
      "Excessive sleepiness",
      "Irritability",
      "Difficulty concentrating",
      "Restlessness",
    ],
  },
  {
    name: "Other",
    symptoms: [
      "Unusual symptoms",
      "General discomfort",
      "Other",
    ],
  },
];

// --------------------------------------------------
// SYMPTOM DURATION OPTIONS
// --------------------------------------------------

const durationOptions = [
  {
    value: "less than 24 hours",
    label: "Less than 24 hours",
  },
  {
    value: "1–3 days",
    label: "1–3 days",
  },
  {
    value: "4–7 days",
    label: "4–7 days",
  },
  {
    value: "1–2 weeks",
    label: "1–2 weeks",
  },
  {
    value: "more than 2 weeks",
    label: "More than 2 weeks",
  },
];

// --------------------------------------------------
// SYMPTOM SEVERITY OPTIONS
// --------------------------------------------------

const severityOptions = [
  {
    value: "mild",
    label: "Mild",
    description: "Noticeable but does not significantly affect daily activities.",
    color: "green",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Causes discomfort and affects some daily activities.",
    color: "yellow",
  },
  {
    value: "severe",
    label: "Severe",
    description: "Significantly affects daily activities or causes intense discomfort.",
    color: "red",
  },
];
// --------------------------------------------------
// SYMPTOM GUIDANCE
// --------------------------------------------------

const getGuidance = (symptoms, severity, duration) => {
  const symptomList = symptoms.map((item) => item.toLowerCase());

  const hasSymptom = (...terms) =>
    terms.some((term) =>
      symptomList.some((symptom) => symptom.includes(term.toLowerCase()))
    );

  const emergencySymptoms = [
    "chest pain",
    "shortness of breath",
    "difficulty breathing",
    "fainting",
    "confusion",
    "blood in stool",
    "blood in urine",
    "severe abdominal pain",
    "difficulty swallowing",
  ];

  const hasEmergencySymptom = emergencySymptoms.some((term) =>
    hasSymptom(term)
  );

  if (hasEmergencySymptom || severity === "severe") {
    return {
      level: "urgent",
      title: "Prompt Medical Assessment Recommended",
      message:
        "Your selected symptoms or their severity may require urgent medical attention. Please contact a healthcare professional promptly. If symptoms are sudden, rapidly worsening, or life-threatening, seek emergency care immediately.",
      recommendation:
        "Do not rely on this checker to rule out a serious condition. Avoid delaying professional care while trying home remedies or medicines.",
      color: "red",
    };
  }

  if (
    hasSymptom("fever") &&
    (duration === "4–7 days" ||
      duration === "1–2 weeks" ||
      duration === "more than 2 weeks")
  ) {
    return {
      level: "caution",
      title: "Medical Review Recommended",
      message:
        "A fever that continues for several days should be assessed by a healthcare professional to identify its cause.",
      recommendation:
        "Monitor your temperature, stay hydrated, and arrange a medical consultation. Seek urgent care if your condition worsens.",
      color: "yellow",
    };
  }

  if (
    duration === "more than 2 weeks" ||
    duration === "1–2 weeks"
  ) {
    return {
      level: "caution",
      title: "Persistent Symptoms Need Attention",
      message:
        "Symptoms lasting this long should not be ignored, even if they seem mild.",
      recommendation:
        "Consider scheduling a medical appointment to discuss your symptoms and determine whether further evaluation is needed.",
      color: "yellow",
    };
  }

  if (severity === "moderate") {
    return {
      level: "moderate",
      title: "Monitor Your Symptoms",
      message:
        "Your symptoms are causing noticeable discomfort. Monitor changes in their intensity and frequency.",
      recommendation:
        "Rest, maintain adequate hydration, and consider consulting a healthcare professional if symptoms persist or worsen.",
      color: "blue",
    };
  }

  return {
    level: "mild",
    title: "General Self-Care May Help",
    message:
      "Your selected symptoms appear to be mild based on the information provided. General self-care may help you feel more comfortable.",
    recommendation:
      "Get adequate rest, drink fluids, and monitor your symptoms. Seek professional advice if they do not improve or become worse.",
    color: "green",
  };
};

// --------------------------------------------------
// CONDITION-SPECIFIC INFORMATION
// --------------------------------------------------

const getConditionDetails = (symptoms) => {
  const symptomList = symptoms.map((item) => item.toLowerCase());

  const hasSymptom = (...terms) =>
    terms.some((term) =>
      symptomList.some((symptom) => symptom.includes(term.toLowerCase()))
    );

  const details = [];

  // ----------------------------------------------
  // COLD & FLU-LIKE SYMPTOMS
  // ----------------------------------------------

  if (
    hasSymptom(
      "runny nose",
      "blocked nose",
      "nasal congestion",
      "sneezing",
      "cough",
      "fever",
      "chills",
      "body aches"
    )
  ) {
    details.push({
      title: "Cold & Flu-Like Symptoms",
      description:
        "Respiratory infections can cause congestion, coughing, fever, fatigue, and body aches. Similar symptoms may have different causes, so a diagnosis cannot be made from symptoms alone.",
      possibleCauses: [
        "Common viral respiratory infections",
        "Influenza (flu)",
        "Seasonal allergies",
        "Other respiratory conditions",
      ],
      homeCare: [
        "Get sufficient rest.",
        "Drink water and other suitable fluids.",
        "Use saline nasal spray for nasal congestion.",
        "Consider warm fluids for throat comfort.",
        "Avoid close contact with others while feeling unwell.",
      ],
      medicines: [
        {
          name: "Paracetamol (Acetaminophen)",
          purpose: "May help relieve fever and mild aches.",
          forms: "Tablets, capsules, or liquid formulations.",
          sideEffects:
            "Usually well tolerated when used correctly. Excessive intake can cause serious liver damage.",
          caution:
            "Check all medicines for duplicate paracetamol ingredients. Follow the product label and ask a pharmacist or clinician if you have liver disease or other concerns.",
          category: "Pain and fever relief",
        },
        {
          name: "Combination Cold & Flu Products",
          purpose:
            "Some products combine ingredients intended to relieve several cold symptoms.",
          forms: "Tablets, capsules, or sachets.",
          sideEffects:
            "Depending on the ingredients, possible effects include drowsiness, restlessness, palpitations, or difficulty sleeping.",
          caution:
            "Read the active ingredients carefully. Avoid combining products with overlapping ingredients, especially paracetamol. Ask a pharmacist before use if you take other medicines.",
          category: "Symptom relief",
        },
        {
          name: "Saline Nasal Spray",
          purpose: "May help moisturize nasal passages and ease congestion.",
          forms: "Nasal spray or drops.",
          sideEffects: "Usually mild; temporary irritation may occur.",
          caution:
            "Use according to the product instructions and keep the applicator clean.",
          category: "Nasal care",
        },
      ],
      seekCare:
        "Seek medical advice for persistent fever, worsening breathing symptoms, dehydration, or symptoms that are not improving.",
    });
  }

  // ----------------------------------------------
  // SORE THROAT
  // ----------------------------------------------

  if (
    hasSymptom(
      "sore throat",
      "difficulty swallowing",
      "hoarse voice",
      "swollen tonsils"
    )
  ) {
    details.push({
      title: "Throat Discomfort",
      description:
        "Throat irritation may occur with viral infections, allergies, dryness, or other conditions. Severe or persistent symptoms need professional assessment.",
      possibleCauses: [
        "Viral throat infection",
        "Throat irritation or dryness",
        "Allergies",
        "Acid reflux",
        "Bacterial infection",
      ],
      homeCare: [
        "Drink warm or cool fluids, whichever feels more comfortable.",
        "Rest your voice.",
        "Avoid smoke and other throat irritants.",
        "Try a warm salt-water gargle if appropriate.",
      ],
      medicines: [
        {
          name: "Throat Lozenges",
          purpose: "May temporarily soothe throat irritation.",
          forms: "Lozenges or medicated sweets.",
          sideEffects:
            "Some products may cause mild mouth irritation or an unpleasant taste.",
          caution:
            "Follow the package instructions. Check age restrictions and ingredients, particularly if you have allergies.",
          category: "Throat relief",
        },
        {
          name: "Paracetamol (Acetaminophen)",
          purpose: "May help with throat pain or fever.",
          forms: "Tablets, capsules, or liquid formulations.",
          sideEffects:
            "Excessive intake can cause serious liver damage.",
          caution:
            "Check for duplicate ingredients in other medicines and follow the product label.",
          category: "Pain relief",
        },
      ],
      seekCare:
        "Seek urgent care if you cannot swallow saliva, have difficulty breathing, or experience rapidly increasing throat swelling.",
    });
  }

  // ----------------------------------------------
  // HEARTBURN, REFLUX & INDIGESTION
  // ----------------------------------------------

  if (
    hasSymptom(
      "heartburn",
      "acid reflux",
      "indigestion",
      "pain after eating",
      "stomach cramps",
      "bloating",
      "gas"
    )
  ) {
    details.push({
      title: "Digestive Discomfort",
      description:
        "Digestive discomfort can be associated with eating habits, reflux, food intolerance, or other gastrointestinal conditions.",
      possibleCauses: [
        "Acid reflux",
        "Indigestion",
        "Gas accumulation",
        "Food intolerance",
        "Gastrointestinal irritation",
      ],
      homeCare: [
        "Eat smaller meals if large meals worsen symptoms.",
        "Avoid lying down immediately after eating.",
        "Notice whether particular foods trigger discomfort.",
        "Drink water regularly.",
        "Avoid foods that consistently worsen your symptoms.",
      ],
      medicines: [
        {
          name: "Antacids",
          purpose:
            "May provide short-term relief from occasional heartburn or acid indigestion.",
          forms: "Chewable tablets or liquid formulations.",
          sideEffects:
            "Some products may cause constipation, diarrhea, or changes in bowel habits.",
          caution:
            "Antacids can affect the absorption of other medicines. Ask a pharmacist about spacing doses and suitability, especially if you have kidney disease.",
          category: "Acid relief",
        },
        {
          name: "Famotidine",
          purpose:
            "Reduces stomach acid and may help with certain acid-related symptoms.",
          forms: "Tablets or liquid formulations.",
          sideEffects:
            "Possible effects include headache, dizziness, or constipation.",
          caution:
            "Ask a healthcare professional whether it is suitable for you, particularly if you have kidney problems or take other medicines.",
          category: "Acid-reducing medicine",
        },
        {
          name: "Omeprazole",
          purpose:
            "Reduces stomach acid and is used for certain reflux-related conditions.",
          forms: "Capsules or tablets.",
          sideEffects:
            "Possible effects include headache, abdominal discomfort, nausea, or diarrhea.",
          caution:
            "Not intended to be started or continued indefinitely without review. Persistent symptoms need medical assessment.",
          category: "Acid-reducing medicine",
        },
        {
          name: "Simethicone",
          purpose: "May help relieve discomfort associated with gas.",
          forms: "Chewable tablets, capsules, or liquid.",
          sideEffects: "Side effects are generally uncommon.",
          caution:
            "Follow the product label. Persistent or severe abdominal pain should be assessed rather than treated as simple gas.",
          category: "Gas relief",
        },
      ],
      seekCare:
        "Seek medical attention for severe abdominal pain, repeated vomiting, black stools, blood in vomit, or unexplained weight loss.",
    });
  }

  // ----------------------------------------------
  // NAUSEA, VOMITING & DIARRHEA
  // ----------------------------------------------

  if (
    hasSymptom(
      "nausea",
      "vomiting",
      "diarrhea",
      "dehydration",
      "loss of appetite"
    )
  ) {
    details.push({
      title: "Nausea & Bowel Symptoms",
      description:
        "Nausea, vomiting, and diarrhea may result from infections, food-related illness, medication effects, or other digestive conditions. Dehydration is an important concern.",
      possibleCauses: [
        "Gastrointestinal infection",
        "Food-related illness",
        "Medication side effects",
        "Food intolerance",
        "Other digestive conditions",
      ],
      homeCare: [
        "Take small, frequent sips of fluid if you feel nauseated.",
        "Consider oral rehydration solution when losing fluids.",
        "Eat light foods as tolerated.",
        "Rest and monitor for signs of dehydration.",
      ],
      medicines: [
        {
          name: "Oral Rehydration Solution (ORS)",
          purpose:
            "Replaces fluids and electrolytes lost through diarrhea or vomiting.",
          forms: "Oral rehydration sachets or prepared solution.",
          sideEffects:
            "Usually well tolerated when prepared and used correctly.",
          caution:
            "Mix sachets exactly as directed. Do not make the solution more concentrated than instructed.",
          category: "Rehydration",
        },
        {
          name: "Loperamide",
          purpose:
            "May reduce the frequency of uncomplicated diarrhea in some adults.",
          forms: "Capsules or tablets.",
          sideEffects:
            "Possible effects include constipation, abdominal discomfort, or dizziness.",
          caution:
            "Avoid self-treatment if you have fever, bloody stools, severe abdominal pain, or suspected serious infection. Follow the label and seek professional advice if symptoms persist.",
          category: "Anti-diarrheal",
        },
        {
          name: "Probiotics",
          purpose:
            "Certain probiotic products may support gut health, although benefits vary by product and condition.",
          forms: "Capsules, sachets, or foods containing live cultures.",
          sideEffects:
            "Some people experience temporary gas or bloating.",
          caution:
            "Ask a clinician before use if you have a weakened immune system or a serious underlying illness.",
          category: "Gut health",
        },
      ],
      seekCare:
        "Seek prompt medical care for signs of dehydration, persistent vomiting, blood in stool, severe pain, or inability to keep fluids down.",
    });
  }

  // ----------------------------------------------
  // HEADACHE & MIGRAINE
  // ----------------------------------------------

  if (
    hasSymptom(
      "headache",
      "migraine",
      "pressure in head",
      "sensitivity to light"
    )
  ) {
    details.push({
      title: "Headache",
      description:
        "Headaches can be related to stress, dehydration, sleep changes, eye strain, migraine, or other conditions. A sudden severe headache requires urgent assessment.",
      possibleCauses: [
        "Tension-type headache",
        "Migraine",
        "Dehydration",
        "Sleep disruption",
        "Eye strain",
        "Other medical conditions",
      ],
      homeCare: [
        "Rest in a quiet, comfortable environment.",
        "Drink water regularly.",
        "Take breaks from screens.",
        "Maintain a consistent sleep routine.",
        "Notice possible triggers such as stress or missed meals.",
      ],
      medicines: [
        {
          name: "Paracetamol (Acetaminophen)",
          purpose: "May help relieve mild to moderate headache pain.",
          forms: "Tablets, capsules, or liquid formulations.",
          sideEffects:
            "Excessive intake can cause serious liver damage.",
          caution:
            "Avoid duplicate ingredients in combination medicines and follow the product label.",
          category: "Pain relief",
        },
        {
          name: "Ibuprofen or Naproxen",
          purpose:
            "These anti-inflammatory medicines may help with certain types of headache.",
          forms: "Tablets or capsules.",
          sideEffects:
            "Possible effects include stomach irritation, ulcers, bleeding, kidney problems, or increased blood pressure.",
          caution:
            "Not suitable for everyone. Ask a clinician or pharmacist first if you have a history of stomach ulcers, kidney disease, heart disease, take blood thinners, or are pregnant.",
          category: "Anti-inflammatory pain relief",
        },
      ],
      seekCare:
        "Seek emergency care for a sudden, extremely severe headache, headache with confusion, fainting, weakness, vision loss, or headache following a head injury.",
    });
  }

  // ----------------------------------------------
  // ALLERGY & ITCHY SKIN
  // ----------------------------------------------

  if (
    hasSymptom(
      "itching",
      "hives",
      "rash",
      "sneezing",
      "watery eyes",
      "itchy eyes",
      "skin swelling",
      "red eyes"
    )
  ) {
    details.push({
      title: "Allergy & Skin Irritation",
      description:
        "Allergic reactions and skin irritation can have several triggers, including environmental allergens, foods, medicines, and contact with irritating substances.",
      possibleCauses: [
        "Seasonal or environmental allergies",
        "Contact dermatitis",
        "Food or medication reactions",
        "Insect bites",
        "Other skin conditions",
      ],
      homeCare: [
        "Avoid suspected triggers when possible.",
        "Use a cool compress for temporary comfort.",
        "Avoid scratching irritated skin.",
        "Use gentle, fragrance-free skin products.",
        "Keep track of new products or foods associated with symptoms.",
      ],
      medicines: [
        {
          name: "Cetirizine",
          purpose:
            "An antihistamine that may help relieve certain allergy symptoms and itching.",
          forms: "Tablets or liquid formulations.",
          sideEffects:
            "May cause drowsiness, dry mouth, or fatigue.",
          caution:
            "Avoid driving if you feel sleepy. Ask a healthcare professional about suitability, especially if you have kidney problems or take sedating medicines.",
          category: "Antihistamine",
        },
        {
          name: "Loratadine",
          purpose:
            "An antihistamine used for certain allergy symptoms.",
          forms: "Tablets or liquid formulations.",
          sideEffects:
            "Possible effects include headache, dry mouth, or tiredness.",
          caution:
            "Follow the label and ask a pharmacist if you take other medicines or have underlying health conditions.",
          category: "Antihistamine",
        },
        {
          name: "Fexofenadine",
          purpose:
            "An antihistamine used to relieve certain allergy symptoms.",
          forms: "Tablets or liquid formulations.",
          sideEffects:
            "Possible effects include headache, nausea, or dizziness.",
          caution:
            "Follow product instructions. Some fruit juices and antacids can affect absorption; check the label or ask a pharmacist.",
          category: "Antihistamine",
        },
        {
          name: "Calamine Lotion",
          purpose:
            "May provide temporary relief for minor itching and skin irritation.",
          forms: "Topical lotion.",
          sideEffects:
            "May cause dryness or irritation in some people.",
          caution:
            "For external use only. Avoid eyes, mouth, and open wounds.",
          category: "Topical skin care",
        },
        {
          name: "Hydrocortisone Cream",
          purpose:
            "A mild topical steroid that may help certain localized inflammatory skin conditions.",
          forms: "Topical cream or ointment.",
          sideEffects:
            "Prolonged or inappropriate use can cause skin thinning or other skin changes.",
          caution:
            "Use only as directed by a healthcare professional or product label. Avoid prolonged use and do not apply to the face, broken skin, or suspected infections without medical advice.",
          category: "Topical anti-inflammatory",
        },
      ],
      seekCare:
        "Seek emergency help immediately if an allergic reaction causes difficulty breathing, throat or tongue swelling, faintness, or rapidly worsening symptoms.",
    });
  }

  // ----------------------------------------------
  // MUSCLE & JOINT PAIN
  // ----------------------------------------------

  if (
    hasSymptom(
      "muscle cramps",
      "body aches",
      "muscle pain",
      "joint pain",
      "back pain",
      "knee pain",
      "shoulder pain",
      "neck pain",
      "arm pain",
      "leg pain",
      "ankle pain",
      "wrist pain"
    )
  ) {
    details.push({
      title: "Muscle & Joint Discomfort",
      description:
        "Muscle and joint pain may be associated with strain, overuse, injury, inflammation, or other conditions. Persistent or unexplained pain should be assessed.",
      possibleCauses: [
        "Muscle strain",
        "Overuse or repetitive movement",
        "Minor injury",
        "Joint inflammation",
        "Posture-related discomfort",
      ],
      homeCare: [
        "Rest the affected area without prolonged complete inactivity.",
        "Avoid activities that worsen the pain.",
        "Use a cold pack for a recent injury or swelling, wrapped in a cloth.",
        "Gentle movement may help when comfortable.",
        "Seek assessment if movement is limited or pain persists.",
      ],
      medicines: [
        {
          name: "Paracetamol (Acetaminophen)",
          purpose: "May help relieve mild pain.",
          forms: "Tablets, capsules, or liquid formulations.",
          sideEffects:
            "Excessive intake can cause serious liver damage.",
          caution:
            "Check for duplicate ingredients and follow the product label.",
          category: "Pain relief",
        },
        {
          name: "Ibuprofen, Naproxen, or Diclofenac",
          purpose:
            "Anti-inflammatory medicines may help certain types of muscle or joint pain.",
          forms: "Oral tablets or capsules; some products are available as topical preparations.",
          sideEffects:
            "Possible risks include stomach irritation, ulcers, bleeding, kidney problems, and increased blood pressure.",
          caution:
            "These medicines are not suitable for everyone. Consult a pharmacist or clinician, especially if you have kidney, stomach, or heart problems, take blood thinners, or are pregnant. Do not combine different NSAIDs unless directed by a clinician.",
          category: "Anti-inflammatory pain relief",
        },
        {
          name: "Topical Diclofenac",
          purpose:
            "A topical anti-inflammatory that may help certain localized muscle or joint pain.",
          forms: "Gel or other topical formulations.",
          sideEffects:
            "May cause local redness, irritation, or dryness.",
          caution:
            "Use only as directed. Avoid broken skin and check with a clinician before use if you have NSAID-related risks or take other anti-inflammatory medicines.",
          category: "Topical pain relief",
        },
        {
          name: "Prescription Muscle Relaxants",
          purpose:
            "Some prescription medicines may be considered by a clinician for specific muscle-spasm conditions.",
          forms: "Varies by prescribed medicine.",
          sideEffects:
            "May cause drowsiness, dizziness, weakness, or impaired coordination.",
          caution:
            "These medicines require professional assessment. Do not use someone else's prescription, drive while impaired, or combine with alcohol or sedatives.",
          category: "Prescription-only treatment",
        },
      ],
      seekCare:
        "Seek urgent assessment for severe pain after an injury, inability to bear weight, a hot or markedly swollen joint, new weakness, or numbness with loss of bladder or bowel control.",
    });
  }

  // ----------------------------------------------
  // CONSTIPATION
  // ----------------------------------------------

  if (
    hasSymptom(
      "constipation",
      "difficulty passing stool"
    )
  ) {
    details.push({
      title: "Constipation",
      description:
        "Constipation can be associated with low fiber intake, inadequate fluids, reduced activity, medication effects, or other digestive conditions.",
      possibleCauses: [
        "Low dietary fiber",
        "Insufficient fluid intake",
        "Reduced physical activity",
        "Medication side effects",
        "Changes in routine",
      ],
      homeCare: [
        "Gradually increase fiber-rich foods.",
        "Drink adequate fluids unless your clinician has advised fluid restriction.",
        "Include gentle physical activity.",
        "Respond to the urge to use the bathroom.",
        "Maintain a regular bathroom routine.",
      ],
      medicines: [
        {
          name: "Psyllium Husk (Isabgol)",
          purpose:
            "A fiber supplement that can help improve stool consistency and regularity.",
          forms: "Powder, granules, or capsules.",
          sideEffects:
            "May cause gas or bloating, especially when introduced quickly.",
          caution:
            "Take with sufficient water and follow the package instructions. Avoid use if you have difficulty swallowing or suspected bowel obstruction without medical advice.",
          category: "Fiber supplement",
        },
        {
          name: "Laxatives",
          purpose:
            "Different types of laxatives may be used for short-term constipation relief.",
          forms: "Varies by product, including oral liquids, tablets, or powders.",
          sideEffects:
            "Depending on the type, possible effects include cramps, diarrhea, bloating, or dehydration.",
          caution:
            "Ask a pharmacist or clinician which type is appropriate. Avoid prolonged or repeated use without medical review.",
          category: "Constipation relief",
        },
      ],
      seekCare:
        "Seek medical attention for severe abdominal pain, vomiting, blood in stool, unexplained weight loss, or constipation that is persistent or unusual for you.",
    });
  }

  // ----------------------------------------------
  // STRESS & SLEEP DIFFICULTIES
  // ----------------------------------------------

  if (
    hasSymptom(
      "stress",
      "anxiety",
      "difficulty sleeping",
      "excessive sleepiness",
      "restlessness",
      "low mood",
      "difficulty concentrating"
    )
  ) {
    details.push({
      title: "Stress, Mood & Sleep",
      description:
        "Stress, anxiety, mood changes, and sleep difficulties can affect concentration, energy, and overall well-being. Persistent symptoms deserve compassionate professional support.",
      possibleCauses: [
        "Academic or work-related stress",
        "Irregular sleep schedule",
        "Lifestyle changes",
        "Emotional distress",
        "Underlying health conditions",
      ],
      homeCare: [
        "Try to maintain a consistent sleep and wake time.",
        "Reduce screen exposure before bedtime.",
        "Use calming activities such as gentle breathing or reading.",
        "Limit caffeine later in the day.",
        "Talk to someone you trust about how you are feeling.",
      ],
      medicines: [
        {
          name: "Melatonin",
          purpose:
            "A hormone-based supplement sometimes used for certain sleep-timing difficulties.",
          forms: "Tablets, capsules, or other formulations.",
          sideEffects:
            "May cause drowsiness, headache, dizziness, or vivid dreams.",
          caution:
            "It can interact with medicines and is not suitable for everyone. Ask a healthcare professional before use, especially if you have a medical condition or take other medicines.",
          category: "Sleep supplement",
        },
        {
          name: "Herbal Sleep Supplements",
          purpose:
            "Some herbal products are marketed for relaxation or sleep support, but evidence and product quality vary.",
          forms: "Teas, capsules, or extracts.",
          sideEffects:
            "May cause drowsiness, stomach upset, or allergic reactions.",
          caution:
            "Natural products can still interact with medicines. Check with a pharmacist or clinician before use, and avoid combining sedating products.",
          category: "Herbal supplement",
        },
        {
          name: "Prescription Sleep or Anxiety Medicines",
          purpose:
            "A clinician may consider prescription treatment after evaluating symptoms and possible causes.",
          forms: "Varies by medicine.",
          sideEffects:
            "Depend on the medicine and may include drowsiness, dizziness, or other significant effects.",
          caution:
            "Do not self-medicate or use another person's prescription. Professional assessment is important, particularly for persistent symptoms.",
          category: "Clinician-guided treatment",
        },
      ],
      seekCare:
        "Seek professional support if symptoms persist, interfere with daily life, or become difficult to manage. If you feel at risk of harming yourself, contact emergency services or a trusted person immediately.",
    });
  }

  // ----------------------------------------------
  // URINARY SYMPTOMS
  // ----------------------------------------------

  if (
    hasSymptom(
      "painful urination",
      "frequent urination",
      "blood in urine",
      "cloudy urine",
      "difficulty urinating",
      "urgent need to urinate"
    )
  ) {
    details.push({
      title: "Urinary Symptoms",
      description:
        "Urinary symptoms can have several causes, including infection, irritation, or other urinary tract conditions. Testing may be needed to determine the cause.",
      possibleCauses: [
        "Urinary tract infection",
        "Dehydration",
        "Urinary irritation",
        "Other urinary tract conditions",
      ],
      homeCare: [
        "Drink fluids regularly unless you have been advised to restrict them.",
        "Do not ignore persistent urinary symptoms.",
        "Arrange a medical assessment to determine whether testing is needed.",
        "Avoid taking leftover antibiotics.",
      ],
      medicines: [
        {
          name: "Clinician-Directed Treatment",
          purpose:
            "Treatment depends on the underlying cause and may require testing.",
          forms: "Determined by a healthcare professional.",
          sideEffects:
            "Depend on the specific treatment prescribed.",
          caution:
            "Do not start antibiotics without professional assessment. The wrong medicine can delay appropriate treatment and contribute to antibiotic resistance.",
          category: "Professional assessment required",
        },
      ],
      seekCare:
        "Seek prompt medical attention for fever with urinary symptoms, pain in the side or back, vomiting, blood in urine, or difficulty passing urine.",
    });
  }

  // ----------------------------------------------
  // GENERAL FALLBACK
  // ----------------------------------------------

  if (details.length === 0) {
    details.push({
      title: "General Symptom Information",
      description:
        "Your selected symptoms may have different causes. This checker can provide general information but cannot identify a specific condition or replace a medical examination.",
      possibleCauses: [
        "Temporary irritation or discomfort",
        "Lifestyle-related factors",
        "Minor illness",
        "Other underlying conditions",
      ],
      homeCare: [
        "Rest and monitor your symptoms.",
        "Maintain adequate hydration.",
        "Avoid activities that worsen your discomfort.",
        "Record when symptoms occur and what makes them better or worse.",
      ],
      medicines: [
        {
          name: "No Specific Medicine Recommended",
          purpose:
            "The appropriate treatment depends on the cause of your symptoms.",
          forms: "Not applicable.",
          sideEffects: "Not applicable.",
          caution:
            "Ask a healthcare professional or pharmacist before taking medicine for unexplained symptoms.",
          category: "Professional guidance",
        },
      ],
      seekCare:
        "Consult a healthcare professional if symptoms persist, worsen, or interfere with daily activities.",
    });
  }

  return details;
};

// --------------------------------------------------
// PATIENT SAFETY NOTES
// --------------------------------------------------

const getPatientSafetyNotes = (user) => {
  const notes = [];

  if (!user) {
    return [
      {
        type: "info",
        title: "Patient Profile Not Available",
        message:
          "Complete your health profile to help the checker display more relevant safety information.",
      },
    ];
  }

  // ----------------------------------------------
  // HELPER: SAFELY READ PROFILE INFORMATION
  // ----------------------------------------------

  const getValue = (...values) =>
    values.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

  const age = Number(
    getValue(user.age, user.patientAge, user.profile?.age)
  );

  const allergies = getValue(
    user.allergies,
    user.medicineAllergies,
    user.medicalInfo?.allergies,
    user.profile?.allergies
  );

  const conditions = getValue(
    user.conditions,
    user.existingConditions,
    user.medicalConditions,
    user.medicalInfo?.conditions,
    user.profile?.conditions
  );

  const medications = getValue(
    user.currentMedications,
    user.medications,
    user.medicalInfo?.medications,
    user.profile?.medications
  );

  const toText = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) =>
          typeof item === "object"
            ? item.name || item.label || ""
            : String(item)
        )
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return Object.values(value).filter(Boolean).join(", ");
    }

    return String(value || "").trim();
  };

  const allergyText = toText(allergies);
  const conditionText = toText(conditions);
  const medicationText = toText(medications);

  const normalizedAllergies = allergyText.toLowerCase();
  const normalizedConditions = conditionText.toLowerCase();

  // ----------------------------------------------
  // AGE-RELATED PRECAUTIONS
  // ----------------------------------------------

  if (Number.isFinite(age) && age > 0) {
    if (age < 18) {
      notes.push({
        type: "warning",
        title: "Age-Related Medicine Precaution",
        message:
          "Medicine selection and suitability can differ for children and teenagers. A parent, guardian, pharmacist, or clinician should review any medicine before use.",
      });
    } else if (age >= 65) {
      notes.push({
        type: "warning",
        title: "Additional Medicine Review Recommended",
        message:
          "Older adults may be more sensitive to certain medicines and their side effects. A healthcare professional should review medicine suitability, especially when multiple medicines are used.",
      });
    }
  }

  // ----------------------------------------------
  // ALLERGY PRECAUTIONS
  // ----------------------------------------------

  if (
    normalizedAllergies &&
    !["none", "no", "n/a", "not applicable"].includes(
      normalizedAllergies
    )
  ) {
    notes.push({
      type: "danger",
      title: "Recorded Allergies",
      message: `Your profile lists the following allergies: ${allergyText}. Always check the active ingredients of medicines and tell your pharmacist or clinician about these allergies before taking any new medicine.`,
    });
  } else {
    notes.push({
      type: "info",
      title: "Allergy Reminder",
      message:
        "Even if no allergies are recorded in your profile, check medicine ingredients and stop using a product if you experience a suspected allergic reaction. Seek emergency help for breathing difficulty or swelling of the throat or tongue.",
    });
  }

  // ----------------------------------------------
  // EXISTING MEDICAL CONDITIONS
  // ----------------------------------------------

  if (normalizedConditions) {
    const conditionWarnings = [];

    if (
      normalizedConditions.includes("kidney") ||
      normalizedConditions.includes("renal")
    ) {
      conditionWarnings.push(
        "Kidney conditions can affect how some medicines are processed. Anti-inflammatory painkillers and certain other medicines may require special caution."
      );
    }

    if (
      normalizedConditions.includes("liver") ||
      normalizedConditions.includes("hepatic")
    ) {
      conditionWarnings.push(
        "Liver conditions may affect the safety of certain medicines, including products containing paracetamol."
      );
    }

    if (
      normalizedConditions.includes("heart") ||
      normalizedConditions.includes("cardiac") ||
      normalizedConditions.includes("cardiovascular")
    ) {
      conditionWarnings.push(
        "Some medicines may affect blood pressure, fluid balance, or cardiovascular health. Check with a healthcare professional before using them."
      );
    }

    if (
      normalizedConditions.includes("blood pressure") ||
      normalizedConditions.includes("hypertension")
    ) {
      conditionWarnings.push(
        "Some painkillers and cold remedies may affect blood pressure. Ask a pharmacist or clinician before use."
      );
    }

    if (
      normalizedConditions.includes("asthma")
    ) {
      conditionWarnings.push(
        "Some people with asthma may react to particular anti-inflammatory medicines. Check with a healthcare professional before using them."
      );
    }

    if (
      normalizedConditions.includes("diabetes")
    ) {
      conditionWarnings.push(
        "Some medicines and illness-related changes can affect blood glucose. Check product ingredients and monitor your condition as advised by your clinician."
      );
    }

    if (
      normalizedConditions.includes("ulcer") ||
      normalizedConditions.includes("gastritis") ||
      normalizedConditions.includes("stomach bleeding")
    ) {
      conditionWarnings.push(
        "Some anti-inflammatory painkillers can irritate the stomach or increase the risk of bleeding. Ask a clinician before using them."
      );
    }

    if (
      normalizedConditions.includes("pregnan")
    ) {
      conditionWarnings.push(
        "Medicine safety can change during pregnancy. Consult your healthcare professional before taking any medicine or supplement."
      );
    }

    notes.push({
      type: "warning",
      title: "Existing Health Conditions",
      message: `Your profile lists: ${conditionText}. ${
        conditionWarnings.length > 0
          ? conditionWarnings.join(" ")
          : "Some medicines may need special consideration depending on your condition. Review medicine choices with a healthcare professional."
      }`,
    });
  }

  // ----------------------------------------------
  // CURRENT MEDICATIONS
  // ----------------------------------------------

  if (
    medicationText &&
    !["none", "no", "n/a", "not applicable"].includes(
      medicationText.toLowerCase()
    )
  ) {
    notes.push({
      type: "warning",
      title: "Current Medicines",
      message: `Your profile lists: ${medicationText}. Some medicines can interact with each other. Ask a pharmacist or clinician to check for interactions before starting a new medicine or supplement.`,
    });
  }

  // ----------------------------------------------
  // GENERAL SAFETY REMINDER
  // ----------------------------------------------

  notes.push({
    type: "info",
    title: "Important Safety Reminder",
    message:
      "This tool provides general educational information only. It does not diagnose conditions, prescribe treatment, or confirm that a medicine is safe for you. Always follow the product label and seek professional advice when uncertain.",
  });

  return notes;
};

// --------------------------------------------------
// MAIN SYMPTOMS CHECKER COMPONENT
// --------------------------------------------------

const Symptoms = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // ----------------------------------------------
  // COMPONENT STATE
  // ----------------------------------------------

  const [user, setUser] = useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("General");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [duration, setDuration] = useState("");

  const [severity, setSeverity] = useState("");

  const [showResults, setShowResults] = useState(false);

  const [formError, setFormError] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [showAllSymptoms, setShowAllSymptoms] =
    useState(false);

  // ----------------------------------------------
  // LOAD CURRENT USER
  // ----------------------------------------------

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }


    
    setUser(currentUser);
  }, [navigate]);

  // ----------------------------------------------
  // THEME CLASSES
  // ----------------------------------------------

  const pageBg = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-800";

  const cardBg = isDark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";

  const mutedText = isDark
    ? "text-slate-400"
    : "text-slate-500";

  const headingText = isDark
  ? "text-slate-100"
  : "text-slate-900";

  const patientName =
  getCurrentUser()?.fullName ||
  getCurrentUser()?.profile?.fullName ||
  "Patient";

  const inputBg = isDark
    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
    : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400";

  // ----------------------------------------------
  // FILTER SYMPTOMS
  // ----------------------------------------------

  const filteredSymptoms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      return symptomCategories.flatMap((category) =>
        category.symptoms
          .filter((symptom) =>
            symptom.toLowerCase().includes(query)
          )
          .map((symptom) => ({
            name: symptom,
            category: category.name,
          }))
      );
    }

    const category = symptomCategories.find(
      (item) => item.name === selectedCategory
    );

    return (category?.symptoms || []).map((symptom) => ({
      name: symptom,
      category: selectedCategory,
    }));
  }, [searchQuery, selectedCategory]);

  // ----------------------------------------------
  // SELECT / REMOVE SYMPTOMS
  // ----------------------------------------------

  const toggleSymptom = (symptom) => {
    setFormError("");

    setSelectedSymptoms((previous) => {
      if (previous.includes(symptom)) {
        return previous.filter((item) => item !== symptom);
      }

      if (previous.length >= 10) {
        setFormError(
          "You can select a maximum of 10 symptoms."
        );
        return previous;
      }

      return [...previous, symptom];
    });
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms((previous) =>
      previous.filter((item) => item !== symptom)
    );
  };

  // ----------------------------------------------
  // RESET FORM
  // ----------------------------------------------

  const resetChecker = () => {
    setSelectedCategory("General");
    setSelectedSymptoms([]);
    setSearchQuery("");
    setDuration("");
    setSeverity("");
    setShowResults(false);
    setFormError("");
    setShowAllSymptoms(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------------------------
  // GENERATE RESULTS
  // ----------------------------------------------

  const handleGenerateResults = () => {
    if (selectedSymptoms.length === 0) {
      setFormError(
        "Please select at least one symptom to continue."
      );
      return;
    }

    if (!duration) {
      setFormError(
        "Please select how long you have been experiencing these symptoms."
      );
      return;
    }

    if (!severity) {
      setFormError(
        "Please select the severity of your symptoms."
      );
      return;
    }

    setFormError("");
    setIsGenerating(true);

    // Brief loading state for a smoother user experience.
    window.setTimeout(() => {
      setShowResults(true);
      setIsGenerating(false);

      window.setTimeout(() => {
        document
          .getElementById("symptom-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    }, 500);
  };

  // ----------------------------------------------
  // RESULTS DATA
  // ----------------------------------------------

  const guidance = showResults
    ? getGuidance(selectedSymptoms, severity, duration)
    : null;

  const conditionDetails = showResults
    ? getConditionDetails(selectedSymptoms)
    : [];

  const safetyNotes = showResults
    ? getPatientSafetyNotes(user)
    : [];

    const handleSaveInformation = () => {
  if (!user) {
    alert("Please log in to save your health information.");
    return;
  }

  try {
    savePatientHistory({
      userId: user.id || user.email,
      symptoms: selectedSymptoms,
      duration,
      severity,
      guidance,
      recommendations: guidance.recommendation,
      conditionDetails,
      selfCare: conditionDetails.flatMap(
        (condition) => condition.homeCare || []
      ),
      safetyNotes,
    });

    alert("Your health information has been saved successfully!");
  } catch (error) {
    console.error(error);
    alert("Unable to save your information. Please try again.");
  }
};

  // ----------------------------------------------
  // GUIDANCE COLORS
  // ----------------------------------------------

  const getGuidanceStyle = (level) => {
    const styles = {
      urgent: {
        container: isDark
          ? "border-red-900 bg-red-950/40"
          : "border-red-200 bg-red-50",
        title: isDark
          ? "text-red-300"
          : "text-red-700",
        text: isDark
          ? "text-red-200"
          : "text-red-800",
        icon: "text-red-500",
      },
      caution: {
        container: isDark
          ? "border-amber-900 bg-amber-950/30"
          : "border-amber-200 bg-amber-50",
        title: isDark
          ? "text-amber-300"
          : "text-amber-700",
        text: isDark
          ? "text-amber-100"
          : "text-amber-800",
        icon: "text-amber-500",
      },
      moderate: {
        container: isDark
          ? "border-blue-900 bg-blue-950/30"
          : "border-blue-200 bg-blue-50",
        title: isDark
          ? "text-blue-300"
          : "text-blue-700",
        text: isDark
          ? "text-blue-100"
          : "text-blue-800",
        icon: "text-blue-500",
      },
      mild: {
        container: isDark
          ? "border-emerald-900 bg-emerald-950/30"
          : "border-emerald-200 bg-emerald-50",
        title: isDark
          ? "text-emerald-300"
          : "text-emerald-700",
        text: isDark
          ? "text-emerald-100"
          : "text-emerald-800",
        icon: "text-emerald-500",
      },
    };

    return styles[level] || styles.mild;
  };

  // ----------------------------------------------
  // SAFETY NOTE COLORS
  // ----------------------------------------------

  const getSafetyStyle = (type) => {
    if (type === "danger") {
      return {
        container: isDark
          ? "border-red-900 bg-red-950/30"
          : "border-red-200 bg-red-50",
        icon: "text-red-500",
        title: isDark
          ? "text-red-300"
          : "text-red-700",
        text: isDark
          ? "text-red-200"
          : "text-red-800",
      };
    }

    if (type === "warning") {
      return {
        container: isDark
          ? "border-amber-900 bg-amber-950/30"
          : "border-amber-200 bg-amber-50",
        icon: "text-amber-500",
        title: isDark
          ? "text-amber-300"
          : "text-amber-700",
        text: isDark
          ? "text-amber-200"
          : "text-amber-800",
      };
    }

    return {
      container: isDark
        ? "border-blue-900 bg-blue-950/30"
        : "border-blue-200 bg-blue-50",
      icon: "text-blue-500",
      title: isDark
        ? "text-blue-300"
        : "text-blue-700",
      text: isDark
        ? "text-blue-200"
        : "text-blue-800",
    };
  };

  // ----------------------------------------------
  // MAIN UI
  // ----------------------------------------------

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${pageBg}`}
    >
            {/* ---------------------------------------- */}
      {/* TOP NAVIGATION */}
      {/* ---------------------------------------- */}

      <header
        className={`sticky top-0 z-40 border-b backdrop-blur ${
          isDark
            ? "border-slate-800 bg-slate-950/95"
            : "border-slate-200 bg-white/95"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold shadow-sm transition ${
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-teal-800 hover:bg-teal-950/40 hover:text-teal-300"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            <ArrowLeft size={17} />
            <span>Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <User size={18} />
            </div>

            <div className="hidden sm:block">
              <p className={`text-sm font-semibold ${headingText}`}>
                {patientName}
              </p>
              <p className={`text-xs ${mutedText}`}>
                Patient Portal
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* ---------------------------------------- */}
      {/* PAGE CONTENT */}
      {/* ---------------------------------------- */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PAGE INTRODUCTION */}

        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-500">
              Health Assistant
            </span>

            <span
              className={`text-xs ${mutedText}`}
            >
              Educational tool
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Symptoms Checker
          </h1>

          <p
            className={`max-w-2xl text-sm leading-7 sm:text-base ${mutedText}`}
          >
            Select the symptoms you are experiencing to explore
            general health information, self-care suggestions,
            and medicine safety considerations.
          </p>
        </section>

        {/* IMPORTANT MEDICAL DISCLAIMER */}

        <div
          className={`mb-8 flex gap-3 rounded-2xl border p-4 ${
            isDark
              ? "border-amber-900/70 bg-amber-950/20"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <ShieldAlert
            className="mt-0.5 shrink-0 text-amber-500"
            size={22}
          />

          <div>
            <h2
              className={`mb-1 text-sm font-semibold ${
                isDark
                  ? "text-amber-300"
                  : "text-amber-800"
              }`}
            >
              Important Health Notice
            </h2>

            <p
              className={`text-sm leading-6 ${
                isDark
                  ? "text-amber-200/90"
                  : "text-amber-900"
              }`}
            >
              This tool is for educational purposes only. It
              cannot diagnose a medical condition, replace a
              doctor, or prescribe medication. If you believe
              you are experiencing an emergency, seek medical
              care immediately instead of using this checker.
            </p>
          </div>
        </div>

        {/* -------------------------------------- */}
        {/* SYMPTOM SELECTION CARD */}
        {/* -------------------------------------- */}

        <section
          className={`mb-8 rounded-3xl border p-5 shadow-sm sm:p-7 ${cardBg}`}
        >
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                  <Activity size={19} />
                </div>

                <h2 className="text-xl font-bold">
                  Select Your Symptoms
                </h2>
              </div>

              <p className={`text-sm ${mutedText}`}>
                Choose up to 10 symptoms that best describe
                how you feel.
              </p>
            </div>

            <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-sm font-semibold text-teal-500">
              {selectedSymptoms.length}/10 selected
            </span>
          </div>

          {/* SEARCH */}

          <div className="relative mb-6">
            <Search
              size={19}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedText}`}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search symptoms..."
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 ${inputBg}`}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${mutedText}`}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* CATEGORY TABS */}

          {!searchQuery && (
            <div className="mb-6 flex flex-wrap gap-2">
              {symptomCategories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category.name)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category.name
                      ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                      : isDark
                      ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-teal-500 hover:text-teal-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* SEARCH RESULTS LABEL */}

          {searchQuery && (
            <p className={`mb-4 text-sm ${mutedText}`}>
              {filteredSymptoms.length} matching symptom
              {filteredSymptoms.length === 1 ? "" : "s"} found
            </p>
          )}

          {/* SYMPTOM OPTIONS */}

          {filteredSymptoms.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSymptoms.map((item) => {
                const isSelected =
                  selectedSymptoms.includes(item.name);

                return (
                  <button
                    key={`${item.category}-${item.name}`}
                    type="button"
                    onClick={() =>
                      toggleSymptom(item.name)
                    }
                    disabled={
                      !isSelected &&
                      selectedSymptoms.length >= 10
                    }
                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-teal-500 bg-teal-500/10"
                        : isDark
                        ? "border-slate-700 bg-slate-800/60 hover:border-teal-500/60"
                        : "border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50"
                    } ${
                      !isSelected &&
                      selectedSymptoms.length >= 10
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-medium ${
                          isSelected
                            ? "text-teal-500"
                            : ""
                        }`}
                      >
                        {item.name}
                      </span>

                      {searchQuery && (
                        <span
                          className={`mt-1 block text-xs ${mutedText}`}
                        >
                          {item.category}
                        </span>
                      )}
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        isSelected
                          ? "border-teal-600 bg-teal-600 text-white"
                          : isDark
                          ? "border-slate-600"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle size={14} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className={`rounded-2xl border border-dashed p-10 text-center ${
                isDark
                  ? "border-slate-700"
                  : "border-slate-200"
              }`}
            >
              <Search
                size={28}
                className={`mx-auto mb-3 ${mutedText}`}
              />

              <p className="font-medium">
                No symptoms found
              </p>

              <p className={`mt-1 text-sm ${mutedText}`}>
                Try a different search term.
              </p>
            </div>
          )}

          {/* SELECTED SYMPTOMS */}

          {selectedSymptoms.length > 0 && (
            <div className="mt-7 border-t border-slate-200/20 pt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  Selected Symptoms
                </h3>

                <button
                  type="button"
                  onClick={() => setSelectedSymptoms([])}
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-sm font-medium text-teal-500"
                  >
                    {symptom}

                    <button
                      type="button"
                      onClick={() =>
                        removeSymptom(symptom)
                      }
                      aria-label={`Remove ${symptom}`}
                      className="rounded-full transition hover:text-red-500"
                    >
                      <X size={15} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* -------------------------------------- */}
        {/* DURATION & SEVERITY */}
        {/* -------------------------------------- */}

        <section
          className={`mb-8 rounded-3xl border p-5 shadow-sm sm:p-7 ${cardBg}`}
        >
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-bold">
              Tell Us More
            </h2>

            <p className={`text-sm ${mutedText}`}>
              These details help organize the general
              information shown in your results.
            </p>
          </div>

          {/* DURATION */}

          <div className="mb-8">
            <label
              htmlFor="symptom-duration"
              className="mb-3 flex items-center gap-2 text-sm font-semibold"
            >
              <Clock size={17} className="text-teal-500" />
              How long have you experienced these symptoms?
            </label>

            <select
              id="symptom-duration"
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
              className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 ${inputBg}`}
            >
              <option value="">
                Select duration
              </option>

              {durationOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* SEVERITY */}

          <div>
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Activity size={17} className="text-teal-500" />
              How severe are your symptoms?
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {severityOptions.map((option) => {
                const isSelected =
                  severity === option.value;

                const severityColors = {
                  green: isDark
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-emerald-500 bg-emerald-50",
                  yellow: isDark
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-amber-500 bg-amber-50",
                  red: isDark
                    ? "border-red-500 bg-red-500/10"
                    : "border-red-500 bg-red-50",
                };

                const dotColors = {
                  green: "bg-emerald-500",
                  yellow: "bg-amber-500",
                  red: "bg-red-500",
                };

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSeverity(option.value)
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? severityColors[option.color]
                        : isDark
                        ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${dotColors[option.color]}`}
                        />
                        {option.label}
                      </span>

                      {isSelected && (
                        <CheckCircle
                          size={18}
                          className="text-teal-500"
                        />
                      )}
                    </div>

                    <p
                      className={`text-xs leading-5 ${mutedText}`}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FORM ERROR */}

          {formError && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p>{formError}</p>
            </div>
          )}

          {/* GENERATE BUTTON */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerateResults}
              disabled={isGenerating}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Preparing Results...
                </>
              ) : (
                <>
                  <Activity size={18} />
                  Check My Symptoms
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetChecker}
              className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-4 text-sm font-semibold transition ${
                isDark
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        </section>
     
        {/* SYMPTOM RESULTS */}

        {showResults && guidance && (
          <section
            id="symptom-results"
            className="scroll-mt-24 space-y-8"
          >
            {/* RESULTS HEADER */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                    <CheckCircle size={19} />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Your Health Overview
                  </h2>
                </div>

                <p className={`text-sm ${mutedText}`}>
                  General information based on the symptoms
                  you selected.
                </p>
              </div>

              <button
                type="button"
                onClick={resetChecker}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  isDark
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                <RotateCcw size={16} />
                Start New Check
              </button>
            </div>

            {/* SELECTED SYMPTOMS SUMMARY */}

            <div
              className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${cardBg}`}
            >
              <div className="mb-4 flex items-center gap-2">
                <Activity
                  size={19}
                  className="text-teal-500"
                />

                <h3 className="font-bold">
                  Symptoms You Reported
                </h3>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-sm font-medium text-teal-500"
                  >
                    {symptom}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  className={`rounded-xl p-4 ${
                    isDark
                      ? "bg-slate-800"
                      : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`mb-1 flex items-center gap-2 text-xs ${mutedText}`}
                  >
                    <Clock size={15} />
                    Duration
                  </div>

                  <p className="text-sm font-semibold">
                    {duration}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-4 ${
                    isDark
                      ? "bg-slate-800"
                      : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`mb-1 flex items-center gap-2 text-xs ${mutedText}`}
                  >
                    <Activity size={15} />
                    Severity
                  </div>

                  <p className="text-sm font-semibold capitalize">
                    {severity}
                  </p>
                </div>
              </div>
            </div>

            {/* GENERAL GUIDANCE */}

            {(() => {
              const style = getGuidanceStyle(
                guidance.level
              );

              return (
                <div
                  className={`rounded-3xl border p-5 sm:p-6 ${style.container}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      {guidance.level === "urgent" ? (
                        <AlertTriangle
                          size={23}
                          className={style.icon}
                        />
                      ) : guidance.level === "caution" ? (
                        <ShieldAlert
                          size={23}
                          className={style.icon}
                        />
                      ) : (
                        <Info
                          size={23}
                          className={style.icon}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-bold ${style.title}`}
                        >
                          {guidance.title}
                        </h3>

                        <span
                          className={`rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold capitalize ${style.text}`}
                        >
                          {guidance.level === "urgent"
                            ? "Urgent"
                            : guidance.level === "caution"
                            ? "Caution"
                            : guidance.level === "moderate"
                            ? "Monitor"
                            : "General"}
                        </span>
                      </div>

                      <p
                        className={`mb-3 text-sm leading-7 ${style.text}`}
                      >
                        {guidance.message}
                      </p>

                      <div
                        className={`rounded-xl bg-white/10 p-4 text-sm leading-6 ${style.text}`}
                      >
                        <strong>
                          Recommended next step:
                        </strong>{" "}
                        {guidance.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CONDITION INFORMATION */}

            <div>
              <div className="mb-5">
                <h3 className="mb-2 text-xl font-bold">
                  Health Information
                </h3>

                <p className={`text-sm ${mutedText}`}>
                  General information about symptom groups
                  related to your selection.
                </p>
              </div>

              <div className="space-y-6">
                {conditionDetails.map(
                  (condition, conditionIndex) => (
                    <article
                      key={`${condition.title}-${conditionIndex}`}
                      className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg}`}
                    >
                      {/* CONDITION TITLE */}

                      <div className="border-b border-slate-200/10 p-5 sm:p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                            <Stethoscope size={20} />
                          </div>

                          <h4 className="text-lg font-bold">
                            {condition.title}
                          </h4>
                        </div>

                        <p
                          className={`text-sm leading-7 ${mutedText}`}
                        >
                          {condition.description}
                        </p>
                      </div>

                      <div className="space-y-6 p-5 sm:p-6">
                        {/* POSSIBLE CAUSES */}

                        <div>
                          <h5 className="mb-3 flex items-center gap-2 text-sm font-bold">
                            <Info
                              size={17}
                              className="text-blue-500"
                            />
                            Possible Causes
                          </h5>

                          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {condition.possibleCauses.map(
                              (cause, index) => (
                                <li
                                  key={`${cause}-${index}`}
                                  className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
                                    isDark
                                      ? "bg-slate-800/70"
                                      : "bg-slate-50"
                                  }`}
                                >
                                  <CheckCircle
                                    size={16}
                                    className="mt-0.5 shrink-0 text-teal-500"
                                  />

                                  <span>{cause}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* HOME CARE */}

                        <div>
                          <h5 className="mb-3 flex items-center gap-2 text-sm font-bold">
                            <Heart
                              size={17}
                              className="text-emerald-500"
                            />
                            General Self-Care
                          </h5>

                          <div
                            className={`rounded-2xl p-4 ${
                              isDark
                                ? "bg-emerald-950/20"
                                : "bg-emerald-50"
                            }`}
                          >
                            <ul className="space-y-3">
                              {condition.homeCare.map(
                                (tip, index) => (
                                  <li
                                    key={`${tip}-${index}`}
                                    className="flex items-start gap-3 text-sm leading-6"
                                  >
                                    <CheckCircle
                                      size={17}
                                      className="mt-0.5 shrink-0 text-emerald-500"
                                    />

                                    <span>{tip}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* MEDICINE INFORMATION */}

                        <div>
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h5 className="flex items-center gap-2 text-sm font-bold">
                              <ShieldCheck
                                size={18}
                                className="text-teal-500"
                              />
                              Medicine Information
                            </h5>

                            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-500">
                              Educational only
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {condition.medicines.map(
                              (medicine, medicineIndex) => (
                                <div
                                  key={`${medicine.name}-${medicineIndex}`}
                                  className={`rounded-2xl border p-4 sm:p-5 ${
                                    isDark
                                      ? "border-slate-700 bg-slate-800/60"
                                      : "border-slate-200 bg-slate-50/70"
                                  }`}
                                >
                                  {/* MEDICINE NAME */}

                                  <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                                        <Bandage size={19} />
                                      </div>

                                      <div className="min-w-0">
                                        <h6 className="font-bold leading-6">
                                          {medicine.name}
                                        </h6>

                                        <span className="mt-1 inline-block rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-500">
                                          {medicine.category}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* PURPOSE */}

                                  <div className="mb-4">
                                    <p
                                      className={`mb-1 text-xs font-bold uppercase tracking-wide ${mutedText}`}
                                    >
                                      Purpose
                                    </p>

                                    <p className="text-sm leading-6">
                                      {medicine.purpose}
                                    </p>
                                  </div>

                                  {/* FORMS */}

                                  <div className="mb-4">
                                    <p
                                      className={`mb-1 text-xs font-bold uppercase tracking-wide ${mutedText}`}
                                    >
                                      Common Forms
                                    </p>

                                    <p className="text-sm leading-6">
                                      {medicine.forms}
                                    </p>
                                  </div>

                                  {/* SIDE EFFECTS */}

                                  <div
                                    className={`mb-4 rounded-xl p-3 ${
                                      isDark
                                        ? "bg-amber-950/30"
                                        : "bg-amber-50"
                                    }`}
                                  >
                                    <p
                                      className={`mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${
                                        isDark
                                          ? "text-amber-300"
                                          : "text-amber-700"
                                      }`}
                                    >
                                      <AlertCircle size={15} />
                                      Possible Side Effects
                                    </p>

                                    <p
                                      className={`text-sm leading-6 ${
                                        isDark
                                          ? "text-amber-200"
                                          : "text-amber-900"
                                      }`}
                                    >
                                      {medicine.sideEffects}
                                    </p>
                                  </div>

                                  {/* SAFETY CAUTION */}

                                  <div
                                    className={`rounded-xl border p-3 ${
                                      isDark
                                        ? "border-red-900/70 bg-red-950/20"
                                        : "border-red-200 bg-red-50"
                                    }`}
                                  >
                                    <p
                                      className={`mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${
                                        isDark
                                          ? "text-red-300"
                                          : "text-red-700"
                                      }`}
                                    >
                                      <ShieldAlert size={15} />
                                      Important Precaution
                                    </p>

                                    <p
                                      className={`text-sm leading-6 ${
                                        isDark
                                          ? "text-red-200"
                                          : "text-red-800"
                                      }`}
                                    >
                                      {medicine.caution}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* WHEN TO SEEK CARE */}

                        <div
                          className={`rounded-2xl border p-4 ${
                            isDark
                              ? "border-red-900/70 bg-red-950/20"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <h5
                            className={`mb-2 flex items-center gap-2 text-sm font-bold ${
                              isDark
                                ? "text-red-300"
                                : "text-red-700"
                            }`}
                          >
                            <AlertTriangle size={17} />
                            When to Seek Medical Care
                          </h5>

                          <p
                            className={`text-sm leading-6 ${
                              isDark
                                ? "text-red-200"
                                : "text-red-800"
                            }`}
                          >
                            {condition.seekCare}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>

            {/* PATIENT SAFETY NOTES */}

            <section>
              <div className="mb-5">
                <h3 className="mb-2 text-xl font-bold">
                  Your Personal Safety Review
                </h3>

                <p className={`text-sm ${mutedText}`}>
                  Important considerations based on the
                  information in your health profile.
                </p>
              </div>

              <div className="space-y-3">
                {safetyNotes.map((note, index) => {
                  const style = getSafetyStyle(note.type);

                  return (
                    <div
                      key={`${note.title}-${index}`}
                      className={`flex items-start gap-3 rounded-2xl border p-4 ${style.container}`}
                    >
                      {note.type === "danger" ? (
                        <ShieldAlert
                          size={20}
                          className={`mt-0.5 shrink-0 ${style.icon}`}
                        />
                      ) : note.type === "warning" ? (
                        <AlertTriangle
                          size={20}
                          className={`mt-0.5 shrink-0 ${style.icon}`}
                        />
                      ) : (
                        <Info
                          size={20}
                          className={`mt-0.5 shrink-0 ${style.icon}`}
                        />
                      )}

                      <div>
                        <h4
                          className={`mb-1 text-sm font-bold ${style.title}`}
                        >
                          {note.title}
                        </h4>

                        <p
                          className={`text-sm leading-6 ${style.text}`}
                        >
                          {note.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* FINAL MEDICAL DISCLAIMER */}

            <div
              className={`rounded-3xl border p-5 sm:p-6 ${
                isDark
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                  <Shield size={20} />
                </div>

                <h3 className="font-bold">
                  Medical Disclaimer
                </h3>
              </div>

              <p
                className={`text-sm leading-7 ${mutedText}`}
              >
                MediCare is an educational health information
                tool. The information displayed is not a
                diagnosis, prescription, or substitute for
                professional medical advice. Medicine
                suitability depends on your medical history,
                allergies, age, current medicines, and other
                factors. Always consult a qualified healthcare
                professional or pharmacist before starting,
                stopping, or changing medication.
              </p>
            </div>

      
{/* ACTION BUTTONS */}

<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

  {/* Find a Suitable Doctor */}
  <button
    type="button"
    onClick={() => navigate("/doctors")}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98]"
  >
    <Stethoscope size={18} />
    <span>Find a Suitable Doctor</span>
  </button>

  {/* View Medical History */}
<button
  type="button"
  onClick={() => navigate("/history")}
  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-4 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] ${
    isDark
      ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md"
  }`}
>
  <ClipboardList size={18} />
  <span>View Medical History</span>
</button>

  {/* Save This Information */}
  <button
    type="button"
    onClick={handleSaveInformation}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
  >
    <Save size={18} />
    <span>Save This Information</span>
  </button>

</div>
</section>
)}
</main>


      {/* FOOTER */}

      <footer
        className={`mt-12 border-t ${
          isDark
            ? "border-slate-800 bg-slate-900/50"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Heart size={16} />
            </div>

            <span className="text-sm font-bold">
              MediCare
            </span>
          </div>

          <p className={`text-xs leading-5 ${mutedText}`}>
            General health education only. Not a substitute
            for professional medical care.
          </p>

          <span className={`text-xs ${mutedText}`}>
            © {new Date().getFullYear()} MediCare
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Symptoms;