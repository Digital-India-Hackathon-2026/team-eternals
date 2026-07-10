// =============================================
// Centralized API Service — SmartHealthAI
// All backend communication goes through here.
// =============================================

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const BASE = `${API_BASE}/api`;

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
// Private Hospital — Walk-in OPD Registration
// -----------------------------------------------
export function registerPrivatePatient({ patientName, age, mobileNumber, gender, department, symptoms, priority, appointmentType }) {
  return request("/private/register", {
    method: "POST",
    body: JSON.stringify({ patientName, age, mobileNumber, gender, department, symptoms, priority, appointmentType }),
  });
}

// -----------------------------------------------
// Private Hospital — Live OPD Queue
// -----------------------------------------------
export function fetchPrivateQueue() {
  return request("/private/queue");
}

// -----------------------------------------------
// Private Hospital — Stats
// -----------------------------------------------
export function fetchPrivateStats() {
  return request("/private/stats");
}

// -----------------------------------------------
// Hospitals — List all (optionally filtered)
// -----------------------------------------------
export function fetchHospitals({ type, dept } = {}) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (dept) params.set("dept", dept);
  const qs = params.toString();
  return request(`/hospitals${qs ? "?" + qs : ""}`);
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
// Patient — Book Hospital (Step 5)
// -----------------------------------------------
export function bookHospital({ patientName, age, mobile, gender, hospitalId, hospitalName, hospitalType, department, priority, symptoms, aiSummary }) {
  return request("/patient/book", {
    method: "POST",
    body: JSON.stringify({ patientName, age, mobile, gender, hospitalId, hospitalName, hospitalType, department, priority, symptoms, aiSummary }),
  });
}
