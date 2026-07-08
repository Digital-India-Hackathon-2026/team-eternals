import { useState } from "react";

function SymptomForm({ setReport }) {
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);

  function analyzeSymptoms() {
    if (symptom.trim() === "") {
      alert("Please enter your symptoms.");
      return;
    }

    setLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let report = {};

      const text = symptom.toLowerCase();

      if (
        text.includes("chest") ||
        text.includes("heart") ||
        text.includes("pain")
      ) {
        report = {
          priority: "High",
          department: "Cardiology",
          hospital: "Apollo Hospitals",
          reason:
            "Chest pain may indicate a cardiac condition. Immediate evaluation is recommended.",
          waitTime: "12 Minutes",
          distance: "3.2 km",
          queue: "14 Patients",
        };
      } else if (
        text.includes("headache") ||
        text.includes("migraine")
      ) {
        report = {
          priority: "Medium",
          department: "Neurology",
          hospital: "Yashoda Hospitals",
          reason:
            "Persistent headaches require neurological evaluation.",
          waitTime: "18 Minutes",
          distance: "4.5 km",
          queue: "10 Patients",
        };
      } else if (
        text.includes("fever") ||
        text.includes("cold") ||
        text.includes("cough")
      ) {
        report = {
          priority: "Low",
          department: "General Medicine",
          hospital: "KIMS Hospitals",
          reason:
            "Common viral symptoms detected.",
          waitTime: "25 Minutes",
          distance: "2.1 km",
          queue: "20 Patients",
        };
      } else {
        report = {
          priority: "Medium",
          department: "General Medicine",
          hospital: "CARE Hospitals",
          reason:
            "Further medical evaluation is recommended.",
          waitTime: "20 Minutes",
          distance: "3.8 km",
          queue: "15 Patients",
        };
      }

      setReport(report);
      setLoading(false);
    }, 2000);
  }

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "18px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#0F4C81" }}>
        🩺 Describe Your Symptoms
      </h2>

      <textarea
        rows="6"
        placeholder="Example: Chest pain, fever, dizziness..."
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "16px",
          resize: "none",
        }}
      />

      <button
        onClick={analyzeSymptoms}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "14px 30px",
          background: loading ? "#94a3b8" : "#0F4C81",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "🤖 AI Analyzing..." : "Analyze Symptoms"}
      </button>
    </section>
  );
}

export default SymptomForm;