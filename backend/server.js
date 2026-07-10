const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "SmartHealthAI Backend Running 🚀",
  });
});

// AI Analysis Route (Mock Data)
app.post("/api/analyze", async (req, res) => {
  try {
    const result = {
      priority: "Medium",
      department: "Cardiology",
      hospital: "Apollo Hospitals Jubilee Hills",
      confidence: "92%",
      waitTime: "18 Minutes",
      summary:
        "Based on the reported symptoms, the patient should be evaluated by a cardiologist.",
      tests: [
        "ECG",
        "Blood Pressure Monitoring",
        "Troponin Test",
        "Complete Blood Count",
      ],
      diagnoses: [
        "Hypertension",
        "Stable Angina",
      ],
      distance: "3.8 km",
      travelTime: "12 min",
      doctorsAvailable: "5",
      emergencyBedsAvailable: "4",
      queueLength: "16 patients",
      emergencyAvailable: true,
    };

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to analyze symptoms.",
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 SmartHealthAI Backend running on port ${PORT}`);
});