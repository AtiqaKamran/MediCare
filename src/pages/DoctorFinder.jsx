
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Stethoscope,
  UserRound,
  Filter,
  HeartPulse,
} from "lucide-react";

const demoDoctors = [
  {
    id: 1,
    name: "Dr. Ayesha Khan",
    specialty: "General Physician",
    experience: "8 years",
    location: "Lahore",
    description: "General health concerns, fever, flu, and routine checkups.",
  },
  {
    id: 2,
    name: "Dr. Hamza Ali",
    specialty: "Gastroenterologist",
    experience: "10 years",
    location: "Lahore",
    description: "Digestive health, stomach pain, acidity, and related concerns.",
  },
  {
    id: 3,
    name: "Dr. Sara Ahmed",
    specialty: "Dermatologist",
    experience: "7 years",
    location: "Lahore",
    description: "Skin conditions, rashes, and allergy-related skin concerns.",
  },
  {
    id: 4,
    name: "Dr. Usman Malik",
    specialty: "ENT Specialist",
    experience: "9 years",
    location: "Lahore",
    description: "Ear, nose, throat, and sinus-related concerns.",
  },
  {
    id: 5,
    name: "Dr. Hira Shah",
    specialty: "Pulmonologist",
    experience: "11 years",
    location: "Lahore",
    description: "Breathing, cough, and respiratory health concerns.",
  },
];

const specialties = [
  "All Specialties",
  "General Physician",
  "Gastroenterologist",
  "Dermatologist",
  "ENT Specialist",
  "Pulmonologist",
];

export default function DoctorFinder() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("All Specialties");
  const [location, setLocation] = useState("Lahore");

  const filteredDoctors = useMemo(() => {
    return demoDoctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doctor.specialty === selectedSpecialty;

      const matchesLocation =
        !location.trim() ||
        doctor.location.toLowerCase().includes(location.toLowerCase());

      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [searchTerm, selectedSpecialty, location]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-100 p-2 text-teal-700">
              <HeartPulse size={25} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">MediCare</h1>
              <p className="text-xs text-slate-500">
                Your health, our priority
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-teal-700">
            <Stethoscope size={20} />
            <span className="text-sm font-semibold">Doctor Finder</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Find a Suitable Doctor
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            Explore doctors by specialty and location to find care that
            matches your health concerns.
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-teal-700" />
            <h3 className="font-semibold text-slate-900">
              Search and Filters
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search doctor or specialty
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search here..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Medical specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                <MapPin size={15} className="mr-1 inline" />
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or area"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Available Doctor Profiles
          </h3>
          <span className="text-sm text-slate-500">
            {filteredDoctors.length} results
          </span>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                    <UserRound size={28} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {doctor.name}
                    </h4>
                    <p className="text-sm text-teal-700">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">
                      Experience:
                    </span>{" "}
                    {doctor.experience}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" />
                    {doctor.location}
                  </p>

                  <p className="leading-relaxed">{doctor.description}</p>
                </div>

                <div className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Demo profile — verify doctor details before seeking care.
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Search className="mx-auto mb-3 text-slate-400" size={32} />
            <h4 className="font-semibold text-slate-800">
              No doctors found
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search, specialty, or location.
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
          This page provides sample profiles for interface testing. It does
          not verify a doctor's credentials or availability and does not
          replace professional medical advice.
        </p>
      </main>
    </div>
  );
}