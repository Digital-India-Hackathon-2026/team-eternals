// =============================================
// Centralized API Service — SmartHealthAI
// All backend communication goes through here.
// =============================================

const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

// -----------------------------------------------
// Patient — AI Symptom Analysis
// -----------------------------------------------
export function analyzeSymptoms({ symptoms, age, gender, severity }) {
  return request("/analyze", {
    method: "POST",
    body: JSON.stringify({ symptoms, age, gender, severity }),
  });
}

export function symptomChat({ messages, age, gender, severity }) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ messages, age, gender, severity }),
  });
}

// -----------------------------------------------
// Government Hospital — Register Patient
// -----------------------------------------------
export function registerPatient({ patientName, age, mobile, gender, department, symptoms, priority }) {
  return request("/government/register", {
    method: "POST",
    body: JSON.stringify({ patientName, age, mobile, gender, department, symptoms, priority }),
  });
}

// -----------------------------------------------
// Government Hospital — Live Queue
// -----------------------------------------------
export function fetchQueue() {
  return request("/government/tokens");
}

// -----------------------------------------------
// Government Hospital — Department Queues
// -----------------------------------------------
export function fetchDepartments() {
  return request("/government/departments");
}

// -----------------------------------------------
// Government Hospital — Reception Stats
// -----------------------------------------------
export function fetchReceptionStats() {
  return request("/government/stats");
}

// -----------------------------------------------
// Hospital Dashboard
// -----------------------------------------------
export function fetchHospitalDashboard() {
  return request("/hospital/dashboard");
}

// -----------------------------------------------
// Patient — Register Details (Step 1)
// -----------------------------------------------
export function registerPatientDetails({ name, age, gender, mobile }) {
  return request("/patient/register", {
    method: "POST",
    body: JSON.stringify({ name, age, gender, mobile }),
  });
}

// -----------------------------------------------
// Patient — Book Hospital (Step 6)
// -----------------------------------------------
export function bookHospital({ patientName, age, mobile, gender, hospitalId, hospitalName, hospitalType, department, priority, symptoms, aiSummary }) {
  return request("/patient/book", {
    method: "POST",
    body: JSON.stringify({ patientName, age, mobile, gender, hospitalId, hospitalName, hospitalType, department, priority, symptoms, aiSummary }),
  });
}
