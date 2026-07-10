import { useState } from "react";
import {
  FaBrain,
  FaUser,
  FaHeartbeat,
  FaStethoscope,
  FaSpinner,
  FaUserMd,
} from "react-icons/fa";

function SymptomForm({ setReport }) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [severity, setSeverity] = useState(3);
  const [loading, setLoading] = useState(false);

  const quickSymptoms = [
    "Chest Pain",
    "Fever",
    "Headache",
    "Difficulty Breathing",
    "Abdominal Pain",
    "Dizziness",
    "Vomiting",
    "Cough",
  ];

  const appendSymptom = (item) => {
    setSymptoms((current) => {
      if (!current.trim()) return item;
      return `${current.trim()}, ${item}`;
    });
  };

  const analyzeSymptoms = async () => {
  if (!symptoms.trim()) {
    alert("Please enter your symptoms.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:5001/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms,
        age,
        gender,
        severity,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze symptoms");
    }

    const data = await response.json();

    setReport(data);

  } catch (error) {
    console.error(error);
    alert("Unable to analyze symptoms.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      id="symptom-form"
      className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8 lg:p-10"
    >
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-purple-200/40 blur-3xl"></div>
      <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl"></div>

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-purple-700 ring-1 ring-purple-100">
          <FaBrain />
          AI Clinical Intake
        </span>

        <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950">
          Describe Your Symptoms
        </h2>

        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          Share your symptoms and SmartHealthAI will recommend the right department and hospital for faster clinical routing.
        </p>

        <div className="mt-8 rounded-3xl bg-slate-50/80 p-5 ring-1 ring-slate-100 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <FaUser />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                Patient Information
              </p>
              <h3 className="text-xl font-extrabold text-slate-950">
                Basic details
              </h3>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
                Age
              </label>

              <input
                type="number"
                placeholder="Enter age"
                value={age}
                disabled={loading}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
                Gender
              </label>

              <select
                value={gender}
                disabled={loading}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
              <FaStethoscope />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-purple-700">
                Clinical Information
              </p>
              <h3 className="text-xl font-extrabold text-slate-950">
                Symptoms and severity
              </h3>
            </div>
          </div>

          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Symptoms
          </label>

          <textarea
            rows="7"
            placeholder="Example: Chest pain, dizziness, shortness of breath..."
            value={symptoms}
            disabled={loading}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50/80 p-5 font-medium leading-8 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <div className="mt-6 rounded-3xl bg-indigo-50/70 p-5 ring-1 ring-indigo-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-indigo-700">
                <FaHeartbeat />
                Severity Level
              </label>

              <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-extrabold text-indigo-700 shadow-sm ring-1 ring-indigo-100">
                {severity} / 5
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              value={severity}
              disabled={loading}
              onChange={(e) => setSeverity(e.target.value)}
              className="mt-5 w-full accent-indigo-600 disabled:cursor-not-allowed"
            />

            <div className="mt-3 flex justify-between text-sm font-semibold text-slate-500">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Quick Symptom Chips
            </h3>

            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 sm:inline-flex">
              Tap to append
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {quickSymptoms.map((item) => (
              <button
                key={item}
                type="button"
                disabled={loading}
                onClick={() => appendSymptom(item)}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-purple-50 hover:text-purple-700 hover:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={analyzeSymptoms}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5 text-lg font-extrabold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:from-indigo-400 disabled:via-purple-400 disabled:to-indigo-500"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Analyzing symptoms using AI...
            </>
          ) : (
            <>
              <FaUserMd />
              Analyze with SmartHealthAI
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default SymptomForm;
