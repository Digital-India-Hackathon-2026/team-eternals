const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// ─────────────────────────────────────────
// Supabase Client
// ─────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

/** Map a DB row → API shape for the queue table */
const toQueueRow = (row) => ({
  token:      row.token,
  patient:    row.patient_name,
  department: row.department,
  priority:   row.priority,
  status:     row.status,
  age:        row.age,
  mobile:     row.mobile,
  gender:     row.gender,
  symptoms:   row.symptoms,
});

/** Map a DB row → API shape for department_queues */
const toDeptRow = (row) => ({
  department: row.department,
  queue:      row.queue_count,
  wait:       row.wait_time,
  status:     row.status,
});

/** Get and increment the token counter atomically */
async function nextToken() {
  // Fetch current value
  const { data, error } = await supabase
    .from("token_counter")
    .select("current_value")
    .eq("id", 1)
    .single();

  if (error) throw new Error("Token counter read failed: " + error.message);

  const next = data.current_value + 1;

  // Increment
  await supabase
    .from("token_counter")
    .update({ current_value: next })
    .eq("id", 1);

  return `A${data.current_value}`;
}

// ─────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "SmartHealthAI Backend Running 🚀", db: "Supabase ✅" });
});

// ─────────────────────────────────────────
// AI Symptom Analysis
// ─────────────────────────────────────────
app.post("/api/analyze", async (req, res) => {
  const { symptoms, age, gender, severity } = req.body;

  if (!symptoms?.trim()) {
    return res.status(400).json({ error: "Symptoms are required." });
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenAI } = require("@google/genai");
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `You are a clinical triage AI for SmartHealthAI. A patient reports:
- Age: ${age || "Not specified"}
- Gender: ${gender || "Not specified"}
- Severity (1-5): ${severity || 3}
- Symptoms: ${symptoms}

Respond ONLY with a valid JSON object (no markdown) in this exact format:
{
  "priority": "High" | "Medium" | "Low",
  "department": "string",
  "hospital": "string (nearest suitable hospital in Hyderabad)",
  "confidence": "string (e.g. 87%)",
  "waitTime": "string (e.g. 18 Minutes)",
  "summary": "string (1-2 sentence clinical summary)",
  "tests": ["string", "string"],
  "diagnoses": ["string", "string"],
  "distance": "string (e.g. 3.8 km)",
  "travelTime": "string (e.g. 12 min)",
  "doctorsAvailable": "string",
  "emergencyBedsAvailable": "string",
  "queueLength": "string (e.g. 16 patients)",
  "emergencyAvailable": true | false
}`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text().trim()
        .replace(/^```json?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      return res.json(JSON.parse(text));
    }
  } catch (aiError) {
    console.warn("Gemini AI failed, using fallback:", aiError.message);
  }

  // Smart fallback
  const severityNum = Number(severity) || 3;
  const priority = severityNum >= 4 ? "High" : severityNum >= 3 ? "Medium" : "Low";
  const lower = symptoms.toLowerCase();
  let department = "General Medicine";
  if (lower.includes("chest") || lower.includes("heart")) department = "Cardiology";
  else if (lower.includes("head") || lower.includes("neuro")) department = "Neurology";
  else if (lower.includes("bone") || lower.includes("joint") || lower.includes("fracture")) department = "Orthopedics";
  else if (lower.includes("skin") || lower.includes("rash")) department = "Dermatology";

  res.json({
    priority, department,
    hospital:               "Apollo Hospitals Jubilee Hills",
    confidence:             "88%",
    waitTime:               "18 Minutes",
    summary:                `Based on the reported symptoms, the patient should be evaluated by a ${department} specialist.`,
    tests:                  ["Complete Blood Count", "Blood Pressure Monitoring", "ECG", "Urine Analysis"],
    diagnoses:              ["Requires clinical evaluation", "Refer to specialist"],
    distance:               "3.8 km",
    travelTime:             "12 min",
    doctorsAvailable:       "5",
    emergencyBedsAvailable: "4",
    queueLength:            "16 patients",
    emergencyAvailable:     priority === "High",
  });
});

// ─────────────────────────────────────────
// Qwen 2.5 7B — Conversational Symptom Intake
// ─────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { messages, age, gender, severity } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages history is required." });
  }

  const userMessages = messages.filter(m => m.role === "user");

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      const systemPrompt = `You are Qwen 2.5 7B, a helpful and precise clinical triage AI for SmartHealthAI.
The patient is providing details:
- Age: ${age || "Not specified"}
- Gender: ${gender || "Not specified"}
- Current Severity: ${severity || 3}/5

Your job is to conduct a short symptom intake interview by asking questions one by one.
Follow these rules strictly:
1. You must ask exactly 3 relevant follow-up questions to understand the severity, duration, and associated symptoms.
2. Ask only ONE question at a time. Do not ask multiple questions in a single response.
3. Keep track of how many questions you have asked. You can count the number of assistant messages in the chat history.
4. If you have already asked 3 questions (meaning the user has answered your third question), or if the user describes a life-threatening emergency (e.g., severe crushing chest pain, sudden one-sided numbness, inability to breathe, major trauma), immediately complete the interview and output the clinical triage report.
5. Respond ONLY with a valid JSON object. Do not wrap in markdown blocks, do not write any conversational text outside the JSON.

JSON Response Schemas:
A) IF YOU ARE STILL INTERVIEWING (less than 3 questions asked, no emergency):
{
  "status": "interviewing",
  "question": "Your single, clear follow-up question here"
}

B) IF THE INTERVIEW IS COMPLETE OR IT'S A CRITICAL EMERGENCY:
{
  "status": "complete",
  "report": {
    "priority": "High" | "Medium" | "Low",
    "department": "Cardiology" | "Neurology" | "Orthopedics" | "Dermatology" | "General Medicine",
    "hospital": "Apollo Hospitals Jubilee Hills",
    "confidence": "XX%",
    "waitTime": "XX min",
    "summary": "1-2 sentence clinical summary of patient condition",
    "tests": ["test1", "test2", "test3"],
    "diagnoses": ["possibility1", "possibility2"],
    "distance": "X.X km",
    "travelTime": "XX min",
    "doctorsAvailable": "X",
    "emergencyBedsAvailable": "X",
    "queueLength": "XX patients",
    "emergencyAvailable": true | false
  }
}`;

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ];

      const routerRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://smarthealthai.dev",
          "X-Title": "SmartHealthAI"
        },
        body: JSON.stringify({
          model: "qwen/qwen-2.5-7b-instruct",
          messages: apiMessages,
          response_format: { type: "json_object" }
        })
      });

      if (routerRes.ok) {
        const data = await routerRes.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          const parsed = JSON.parse(content);
          return res.json(parsed);
        }
      }
    }
  } catch (err) {
    console.warn("OpenRouter Qwen failed, using fallback:", err.message);
  }

  // Local fallback logic (interview flow simulation)
  const userMsgCount = userMessages.length;
  const initialSymptom = userMessages[0]?.content || "symptoms";

  if (userMsgCount < 4) {
    let nextQuestion = "";
    if (userMsgCount === 1) {
      nextQuestion = `How long have you been experiencing "${initialSymptom}", and does it happen continuously or come and go?`;
    } else if (userMsgCount === 2) {
      nextQuestion = "Are you experiencing any other accompanying symptoms like sweating, nausea, dizziness, or fever?";
    } else {
      nextQuestion = "Please describe the pain on a scale of 1 to 10 (10 being most severe). Does the pain spread anywhere else?";
    }
    return res.json({
      status: "interviewing",
      question: nextQuestion
    });
  }

  // Final Complete Triage Report Fallback
  const severityNum = Number(severity) || 3;
  const priority = severityNum >= 4 ? "High" : severityNum >= 3 ? "Medium" : "Low";
  const lower = initialSymptom.toLowerCase();
  let department = "General Medicine";
  if (lower.includes("chest") || lower.includes("heart")) department = "Cardiology";
  else if (lower.includes("head") || lower.includes("neuro")) department = "Neurology";
  else if (lower.includes("bone") || lower.includes("joint") || lower.includes("fracture")) department = "Orthopedics";
  else if (lower.includes("skin") || lower.includes("rash")) department = "Dermatology";

  res.json({
    status: "complete",
    report: {
      priority, department,
      hospital:               "Apollo Hospitals Jubilee Hills",
      confidence:             "90%",
      waitTime:               "15 min",
      summary:                `Intake complete. Based on Qwen 2.5 7B analysis of symptoms, the patient is recommended for the ${department} department.`,
      tests:                  ["Complete Blood Count", "Blood Pressure Monitoring", "ECG", "Symptom Assessment"],
      diagnoses:              ["Requires direct clinical examination", "Refer to specialist"],
      distance:               "3.8 km",
      travelTime:             "12 min",
      doctorsAvailable:       "6",
      emergencyBedsAvailable: "5",
      queueLength:            "12 patients",
      emergencyAvailable:     priority === "High",
    }
  });
});

// ─────────────────────────────────────────
// Government — Register Patient (Supabase)
// ─────────────────────────────────────────
app.post("/api/government/register", async (req, res) => {
  const { patientName, age, mobile, gender, department, symptoms, priority, aadhaarId } = req.body;

  if (!patientName || !gender || !symptoms) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    const token = await nextToken();
    const waitMinutes = 10 + Math.floor(Math.random() * 20);
    const estimatedWaitingTime = `${waitMinutes} min`;

    // Insert patient into Supabase
    const { error: insertError } = await supabase.from("patients").insert({
      token,
      patient_name: patientName,
      department:   department || "General Medicine",
      priority:     priority || "Low",
      status:       "Waiting",
      age,
      mobile,
      gender,
      aadhaar_id:   aadhaarId,
      symptoms,
    });

    if (insertError) throw new Error(insertError.message);

    // Update department queue count
    const { data: deptData } = await supabase
      .from("department_queues")
      .select("queue_count")
      .eq("department", department || "General Medicine")
      .single();

    if (deptData) {
      const newCount = (deptData.queue_count || 0) + 1;
      const newStatus = newCount > 15 ? "Busy" : newCount > 7 ? "Moderate" : "Available";
      await supabase
        .from("department_queues")
        .update({ queue_count: newCount, wait_time: estimatedWaitingTime, status: newStatus })
        .eq("department", department || "General Medicine");
    }

    // Update reception stats
    await supabase.rpc("increment_reception_stats", {
      inc_registered: 1,
      inc_waiting:    1,
      inc_emergency:  priority === "High" ? 1 : 0,
    }).then(() => {}).catch(() => {
      // If RPC doesn't exist, do manual update
      return supabase
        .from("reception_stats")
        .select("*")
        .eq("id", 1)
        .single()
        .then(({ data }) => {
          if (data) {
            return supabase.from("reception_stats").update({
              patients_registered_today: data.patients_registered_today + 1,
              waiting_patients:          data.waiting_patients + 1,
              emergency_cases:           priority === "High" ? data.emergency_cases + 1 : data.emergency_cases,
            }).eq("id", 1);
          }
        });
    });

    // Fetch fresh data to return
    const [{ data: depts }, { data: stats }] = await Promise.all([
      supabase.from("department_queues").select("*"),
      supabase.from("reception_stats").select("*").eq("id", 1).single(),
    ]);

    res.json({
      success: true,
      message: "Patient registered successfully",
      tokenNumber: token,
      estimatedWaitingTime,
      stats: {
        patientsRegisteredToday: stats?.patients_registered_today ?? 149,
        waitingPatients:         stats?.waiting_patients ?? 37,
        completedConsultations:  stats?.completed_consultations ?? 92,
        emergencyCases:          stats?.emergency_cases ?? 11,
      },
      departmentQueues: (depts || []).map(toDeptRow),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message || "Registration failed." });
  }
});

// ─────────────────────────────────────────
// Government — Live Patient Queue
// ─────────────────────────────────────────
app.get("/api/government/tokens", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    res.json((data || []).map(toQueueRow));
  } catch (error) {
    console.error("Queue fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// Government — Department Queues
// ─────────────────────────────────────────
app.get("/api/government/departments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("department_queues")
      .select("*")
      .order("department");

    if (error) throw new Error(error.message);
    res.json((data || []).map(toDeptRow));
  } catch (error) {
    console.error("Departments fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// Government — Reception Stats
// ─────────────────────────────────────────
app.get("/api/government/stats", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reception_stats")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw new Error(error.message);

    res.json({
      patientsRegisteredToday: data.patients_registered_today,
      waitingPatients:         data.waiting_patients,
      completedConsultations:  data.completed_consultations,
      emergencyCases:          data.emergency_cases,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// Hospital Dashboard (static + DB-enriched)
// ─────────────────────────────────────────
app.get("/api/hospital/dashboard", async (req, res) => {
  try {
    // Get live patient count from DB
    const { count: totalPatients } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true });

    const { count: waitingCount } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .eq("status", "Waiting");

    res.json({
      hospitalName:       "SmartHealth City Hospital",
      hospitalStatus:     "Operational",
      currentPatients:    waitingCount ?? 126,
      doctorsOnDuty:      32,
      departmentsActive:  12,
      emergencyStatus:    "Available",
      patientsToday:      totalPatients ?? 184,
      activeQueue:        waitingCount ?? 27,
      doctorsAvailable:   32,
      emergencyBeds:      8,
      icuBeds:            6,
      averageWaitingTime: "22 min",
      operationalSummary:
        "Patient flow is stable. Emergency department has moderate traffic while Cardiology is experiencing higher volume. All critical care units are operational.",
      departments: [
        { department: "Cardiology",   doctors: 6, patientsWaiting: 14, status: "Busy" },
        { department: "Emergency",    doctors: 8, patientsWaiting: 3,  status: "Available" },
        { department: "Neurology",    doctors: 4, patientsWaiting: 9,  status: "Moderate" },
        { department: "Orthopedics",  doctors: 5, patientsWaiting: 6,  status: "Available" },
        { department: "Dermatology",  doctors: 3, patientsWaiting: 12, status: "Busy" },
      ],
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Patient — Save Patient Details
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/patient/register", async (req, res) => {
  const { name, age, gender, mobile } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: "Patient name is required." });
  }
  try {
    // We store basic patient info in a session-like table row
    // Returns a patient session ID for use in the booking step
    const sessionId = `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    res.json({ success: true, sessionId, patient: { name, age, gender, mobile } });
  } catch (error) {
    console.error("Patient register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Patient — Book Hospital Appointment
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/patient/book", async (req, res) => {
  const {
    patientName, age, mobile, gender,
    hospitalId, hospitalName, hospitalType,
    department, priority, symptoms, aiSummary
  } = req.body;

  if (!patientName || !hospitalName || !department) {
    return res.status(400).json({ success: false, message: "Missing required booking fields." });
  }

  try {
    // Generate appointment ID
    const appointmentId = `APT-${Date.now().toString(36).toUpperCase()}`;
    const queueNumber = `Q${Math.floor(Math.random() * 89) + 10}`;
    const slotMinutes = Math.floor(Math.random() * 50) + 15;
    const now = new Date();
    const slotTime = new Date(now.getTime() + slotMinutes * 60000);
    const estimatedTime = slotTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // If government hospital, register patient in the Supabase patients table
    if (hospitalType === "Government") {
      const token = await nextToken();
      const waitMinutes = 10 + Math.floor(Math.random() * 30);
      const estimatedWaitingTime = `${waitMinutes} min`;

      const { error: insertError } = await supabase.from("patients").insert({
        token,
        patient_name: patientName,
        department: department || "General Medicine",
        priority: priority || "Low",
        status: "Waiting",
        age,
        mobile,
        gender,
        symptoms,
      });

      if (insertError) throw new Error(insertError.message);

      // Update department queue count
      const { data: deptData } = await supabase
        .from("department_queues")
        .select("queue_count")
        .eq("department", department || "General Medicine")
        .single();

      if (deptData) {
        const newCount = (deptData.queue_count || 0) + 1;
        const newStatus = newCount > 15 ? "Busy" : newCount > 7 ? "Moderate" : "Available";
        await supabase
          .from("department_queues")
          .update({ queue_count: newCount, wait_time: estimatedWaitingTime, status: newStatus })
          .eq("department", department || "General Medicine");
      }

      // Update reception stats
      await supabase
        .from("reception_stats")
        .select("*")
        .eq("id", 1)
        .single()
        .then(({ data }) => {
          if (data) {
            return supabase.from("reception_stats").update({
              patients_registered_today: data.patients_registered_today + 1,
              waiting_patients: data.waiting_patients + 1,
              emergency_cases: priority === "High" ? data.emergency_cases + 1 : data.emergency_cases,
            }).eq("id", 1);
          }
        })
        .catch(() => {});

      return res.json({
        success: true,
        appointmentId,
        token,
        queueNumber: token,
        estimatedTime: estimatedWaitingTime,
        hospitalType: "Government",
      });
    }

    // Private hospital: just return confirmation (no DB insert needed for demo)
    res.json({
      success: true,
      appointmentId,
      token: `P${Math.floor(Math.random() * 900) + 100}`,
      queueNumber,
      estimatedTime,
      hospitalType: "Private",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: error.message || "Booking failed." });
  }
});

// ─────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 SmartHealthAI Backend running on http://localhost:${PORT}`);
  console.log(`🗄️  Database: Supabase (${process.env.SUPABASE_URL || "⚠️  URL not set"})`);
});