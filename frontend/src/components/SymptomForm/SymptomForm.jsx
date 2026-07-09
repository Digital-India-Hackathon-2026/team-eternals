import { useState } from "react";
import {
  FaUser,
  FaHeartbeat,
  FaCalendarAlt,
  FaStethoscope,
  FaSpinner,
} from "react-icons/fa";

function SymptomForm({ setReport }) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [severity, setSeverity] = useState(3);
  const [duration, setDuration] = useState("1 Day");
  const [loading, setLoading] = useState(false);

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
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">
        🩺 Patient Information
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="font-semibold flex items-center gap-2 mb-2">
            <FaUser />
            Age
          </label>

          <input
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="font-semibold mb-2 block">
            Gender
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="font-semibold flex items-center gap-2 mb-2">
            <FaCalendarAlt />
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Today</option>
            <option>1 Day</option>
            <option>2 Days</option>
            <option>1 Week</option>
            <option>More than 1 Week</option>
          </select>
        </div>

        <div>
          <label className="font-semibold flex items-center gap-2 mb-2">
            <FaHeartbeat />
            Severity
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full"
          />

          <div className="flex justify-between text-sm mt-2 text-slate-500">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className="font-semibold flex items-center gap-2 mb-2">
          <FaStethoscope />
          Describe Symptoms
        </label>

        <textarea
          rows="6"
          placeholder="Example: Chest pain, dizziness, shortness of breath..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full border rounded-2xl p-4 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Quick Symptom Chips */}

        <div className="flex flex-wrap gap-3 mt-4">
          {[
            "Chest Pain",
            "Fever",
            "Headache",
            "Cough",
            "Dizziness",
            "Vomiting",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSymptoms(item)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={analyzeSymptoms}
        disabled={loading}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-lg font-semibold py-4 rounded-2xl transition flex justify-center items-center gap-3"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            AI Analyzing...
          </>
        ) : (
          "Analyze Symptoms"
        )}
      </button>
    </div>
  );
}

export default SymptomForm;