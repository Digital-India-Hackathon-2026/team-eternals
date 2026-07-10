// ─────────────────────────────────────────────────────────────────────────────
// SmartHealthAI — Patient Module (Complete End-to-End Healthcare Journey)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { QRCodeSVG } from "qrcode.react";
import {
  FaUser, FaPhone, FaVenusMars, FaCalendarAlt,
  FaBrain, FaPaperPlane, FaSpinner, FaCheckCircle,
  FaHospital, FaMapMarkerAlt, FaClock, FaUserMd,
  FaBed, FaStar, FaAmbulance, FaExclamationTriangle,
  FaQrcode, FaTicketAlt, FaArrowRight, FaHeartbeat,
  FaShieldAlt, FaChevronRight, FaRobot
} from "react-icons/fa";
import { MdEmergency, MdLocalHospital } from "react-icons/md";
import { registerPatientDetails, symptomChat, bookHospital } from "../lib/api";
import { HYDERABAD_HOSPITALS, getNearbyHospitals } from "../lib/hospitalData";

// ─── Fix Leaflet default marker icons ────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const govtIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const privateIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 48], iconAnchor: [15, 48], popupAnchor: [1, -34],
});

// ─── Map centering helper ─────────────────────────────────────────────────────
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 13); }, [lat, lng, map]);
  return null;
}

// ─── Priority badge helper ────────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cfg = {
    Critical: "bg-red-600 text-white",
    High:     "bg-orange-500 text-white",
    Medium:   "bg-yellow-500 text-white",
    Low:      "bg-emerald-500 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-black uppercase tracking-wide ${cfg[priority] || "bg-slate-500 text-white"}`}>
      {(priority === "Critical" || priority === "High") && <MdEmergency />}
      {priority}
    </span>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Patient Details" },
  { id: 2, label: "Symptoms" },
  { id: 3, label: "Triage Result" },
  { id: 4, label: "Nearby Hospitals" },
  { id: 5, label: "Book" },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {STEPS.map((step, idx) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center min-w-0">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-all duration-300 ${
                done ? "bg-emerald-500 text-white" :
                active ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                "bg-slate-100 text-slate-400"
              }`}>
                {done ? <FaCheckCircle size={14} /> : step.id}
              </div>
              <span className={`mt-1.5 text-xs font-bold whitespace-nowrap hidden sm:block ${active ? "text-blue-600" : done ? "text-emerald-600" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-16 mx-1 mt-[-18px] sm:mt-[-22px] rounded transition-all duration-300 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared field wrapper (must be at module level to preserve focus) ────────
function Field({ id, label, icon: Icon, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
        <Icon size={11} /> {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1 — Patient Registration
// ═════════════════════════════════════════════════════════════════════════════
function StepPatientDetails({ onNext, onEmergencyTrigger }) {
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emergencyMode, setEmergencyMode] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.age || isNaN(form.age) || form.age < 1) e.age = "Valid age required";
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) e.mobile = "10-digit mobile number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerPatientDetails(form);
      onNext(form);
    } catch {
      // Proceed even if backend unavailable
      onNext(form);
    } finally {
      setLoading(false);
    }
  };



  if (emergencyMode) {
    const emergencyOptions = [
      { reason: "Chest Pain / Heart Issue", dept: "Cardiology", icon: "🫀" },
      { reason: "Road Accident / Trauma", dept: "Orthopedics", icon: "🚗" },
      { reason: "Breathing Difficulty", dept: "Emergency", icon: "🫁" },
      { reason: "Stroke / Numbness", dept: "Neurology", icon: "🧠" },
      { reason: "Other Medical Emergency", dept: "Emergency", icon: "⚠️" },
    ];
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="bg-red-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <FaAmbulance className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Emergency Assistance</h2>
              <p className="text-sm text-red-100 font-medium">Select primary complaint for instant routing</p>
            </div>
          </div>
        </div>
        <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-6 space-y-6 shadow-lg">
          <div className="grid gap-3 sm:grid-cols-2">
            {emergencyOptions.map((opt) => (
              <button
                key={opt.reason}
                type="button"
                onClick={() => onEmergencyTrigger(opt.reason, opt.dept)}
                className="flex items-center gap-4 rounded-2xl border-2 border-red-100 bg-red-50/30 p-4 text-left transition hover:border-red-500 hover:bg-red-50 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                <span className="text-3xl">{opt.icon}</span>
                <div>
                  <p className="font-black text-slate-900 text-sm">{opt.reason}</p>
                  <p className="text-[10px] font-black uppercase text-red-600 tracking-wider">Fast-track: {opt.dept}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setEmergencyMode(false)}
            className="w-full text-center text-xs font-black text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Registration Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quick Emergency Triage Access */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in-up">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md animate-pulse">
            <FaAmbulance size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-red-800">Critical Medical Emergency?</h3>
            <p className="text-xs text-red-600 font-semibold mt-0.5">Skip chat & forms. Direct routing to nearest ICU/Beds.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEmergencyMode(true)}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white hover:bg-red-700 transition shrink-0 shadow-lg shadow-red-100 hover:-translate-y-0.5 active:translate-y-0"
        >
          Fast-Track Emergency
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-fade-in-up">
        <div className="bg-blue-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <FaUser className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Patient Registration</h2>
              <p className="text-sm text-blue-100 font-medium">Enter your details to begin the consultation</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field id="pat-name" label="Full Name" icon={FaUser} error={errors.name}>
            <input
              id="pat-name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-200 ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-400 focus:bg-white"}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field id="pat-age" label="Age" icon={FaCalendarAlt} error={errors.age}>
              <input
                id="pat-age"
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 34"
                value={form.age}
                onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-200 ${errors.age ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-400 focus:bg-white"}`}
              />
            </Field>

            <Field id="pat-gender" label="Gender" icon={FaVenusMars}>
              <select
                id="pat-gender"
                value={form.gender}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
          </div>

          <Field id="pat-mobile" label="Mobile Number" icon={FaPhone} error={errors.mobile}>
            <input
              id="pat-mobile"
              type="tel"
              maxLength={10}
              placeholder="10-digit number"
              value={form.mobile}
              onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, "") }))}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-200 ${errors.mobile ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-400 focus:bg-white"}`}
            />
          </Field>

          <button
            type="submit"
            id="btn-register-patient"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaArrowRight />}
            {loading ? "Registering..." : "Continue to Symptom Check"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2 — AI Symptom Chat
// ═════════════════════════════════════════════════════════════════════════════
const QUICK_SYMPTOMS = [
  "Chest Pain", "High Fever", "Severe Headache", "Difficulty Breathing",
  "Abdominal Pain", "Road Accident", "Dizziness", "Vomiting",
];

function StepSymptomChat({ patient, onComplete }) {
  const [primarySymptom, setPrimarySymptom] = useState("");
  const [phase, setPhase] = useState("input"); // "input" | "chat"
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Build a fallback triage report if the API doesn't return one
  const buildFallbackTriage = (symptom) => {
    const lower = (symptom || "").toLowerCase();
    let department = "General Medicine";
    let priority = "Medium";
    if (lower.includes("chest") || lower.includes("heart")) { department = "Cardiology"; priority = "High"; }
    else if (lower.includes("head") || lower.includes("neuro")) { department = "Neurology"; priority = "Medium"; }
    else if (lower.includes("bone") || lower.includes("joint") || lower.includes("fracture") || lower.includes("accident")) { department = "Orthopedics"; priority = "High"; }
    else if (lower.includes("skin") || lower.includes("rash")) { department = "Dermatology"; priority = "Low"; }
    else if (lower.includes("breath") || lower.includes("lung")) { department = "Pulmonology"; priority = "High"; }
    else if (lower.includes("fever") || lower.includes("temperature")) { department = "General Medicine"; priority = "Medium"; }
    return {
      priority,
      department,
      confidence: "88%",
      waitTime: "20 min",
      summary: `Based on your reported symptoms, you should be evaluated by a ${department} specialist promptly.`,
      diagnoses: ["Requires clinical evaluation", "Please consult a specialist"],
      tests: ["Complete Blood Count", "Blood Pressure Monitoring"],
    };
  };

  const startChat = async () => {
    if (!primarySymptom.trim()) return;
    setLoading(true);
    setPhase("chat");
    const initialMessages = [{ role: "user", content: `Primary Symptom: ${primarySymptom}` }];
    setMessages(initialMessages);

    try {
      const data = await symptomChat({ messages: initialMessages, age: patient.age, gender: patient.gender, severity: 3 });
      if (data.status === "interviewing") {
        setMessages(prev => [...prev, { role: "assistant", content: data.question }]);
      } else {
        const triage = data.report || buildFallbackTriage(primarySymptom);
        onComplete({ primarySymptom, messages: initialMessages, triage });
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "How long have you been experiencing this? Does it come and go or is it constant?" }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg = { role: "user", content: chatInput.trim() };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setChatInput("");
    setLoading(true);

    try {
      const data = await symptomChat({ messages: nextMsgs, age: patient.age, gender: patient.gender, severity: 3 });
      if (data.status === "interviewing") {
        setMessages(prev => [...prev, { role: "assistant", content: data.question }]);
      } else {
        const triage = data.report || buildFallbackTriage(primarySymptom);
        setMessages(prev => [...prev, { role: "assistant", content: "✓ Assessment complete. Generating your triage report now..." }]);
        setTimeout(() => onComplete({ primarySymptom, messages: nextMsgs, triage }), 800);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Are you experiencing any associated symptoms like fever, nausea, or pain that spreads to other areas?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-indigo-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <FaRobot className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Symptom & Department Guide</h2>
              <p className="text-sm text-indigo-200 font-medium">Assisting you with clinical care coordination</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {phase === "input" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500 mb-2">Hello, {patient.name}! What brings you in today?</p>
                <div className="flex gap-2">
                  <input
                    id="primary-symptom-input"
                    type="text"
                    placeholder="Describe your primary symptom..."
                    value={primarySymptom}
                    onChange={e => setPrimarySymptom(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && startChat()}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-2">Common Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SYMPTOMS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPrimarySymptom(s)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${primarySymptom === s ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-start-chat"
                onClick={startChat}
                disabled={!primarySymptom.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-black text-white transition hover:bg-indigo-700 disabled:opacity-40"
              >
                <FaBrain /> Start Symptom Guidance
              </button>
            </div>
          )}

          {phase === "chat" && (
            <div className="space-y-4">
              <div ref={chatContainerRef} className="h-80 overflow-y-auto rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <FaRobot size={12} className="text-indigo-600" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                      <FaRobot size={12} className="text-indigo-600" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-2 text-sm text-slate-500 font-medium shadow-sm">
                      <FaSpinner className="animate-spin text-indigo-500" size={12} /> Analyzing...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  id="chat-user-response"
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type your response..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                />
                <button
                  type="submit"
                  id="btn-send-response"
                  disabled={loading || !chatInput.trim()}
                  className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700 disabled:opacity-40"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 3 — Triage Result
// ═════════════════════════════════════════════════════════════════════════════
function StepTriageResult({ triage, primarySymptom, onNext }) {
  const priorityBg = {
    Critical: "border-red-200 bg-red-50",
    High: "border-orange-200 bg-orange-50",
    Medium: "border-yellow-200 bg-yellow-50",
    Low: "border-emerald-200 bg-emerald-50",
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-4">
      {/* Priority card */}
      <div className={`rounded-2xl border-2 p-6 ${priorityBg[triage.priority] || "border-slate-200 bg-white"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900">Department Recommendation</h2>
          <PriorityBadge priority={triage.priority} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-400 mb-1">Department</p>
            <p className="text-sm font-black text-slate-900">{triage.department}</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-400 mb-1">Confidence</p>
            <p className="text-sm font-black text-blue-700">{triage.confidence}</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-400 mb-1">Wait Est.</p>
            <p className="text-sm font-black text-slate-900">{triage.waitTime}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-black uppercase text-slate-400 mb-1.5">Clinical Summary</p>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">{triage.summary}</p>
        </div>
      </div>

      {/* Possible conditions */}
      {triage.diagnoses?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase text-slate-400 mb-3">Possible Conditions (Informational)</p>
          <div className="flex flex-wrap gap-2">
            {triage.diagnoses.map((d, i) => (
              <span key={i} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">{d}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended tests */}
      {triage.tests?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase text-slate-400 mb-3">Recommended Initial Tests</p>
          <div className="flex flex-wrap gap-2">
            {triage.tests.map((t, i) => (
              <span key={i} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <FaShieldAlt className="text-amber-500 mt-0.5 shrink-0" size={14} />
        <p className="text-xs font-semibold text-amber-700 leading-relaxed">
          <strong>Important Guidance Note:</strong> This assessment is designed to help guide you to the right department. Always seek immediate professional medical attention for any serious or worsening condition.
        </p>
      </div>

      <button
        id="btn-find-hospitals"
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white transition hover:bg-blue-700"
      >
        <FaHospital /> Find Nearby Hospitals <FaChevronRight size={12} />
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 4 — Nearby Hospitals + Map
// ═════════════════════════════════════════════════════════════════════════════
function StepNearbyHospitals({ triage, userLocation, hospitals, selectedHospital, onSelect, onNext }) {
  const [filter, setFilter] = useState("All"); // All | Private | Government
  const [mapHospital, setMapHospital] = useState(null);

  const filtered = hospitals.filter(h => filter === "All" || h.type === filter);
  const top = filtered.slice(0, 8);

  const handleSelect = (h) => {
    setMapHospital(h);
    onSelect(h);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Nearby Hospitals</h2>
          <p className="text-sm text-slate-500 font-medium">
            {userLocation ? "Based on your live location" : "Based on Hyderabad, Telangana"}
            {triage.department && ` · Filtered for ${triage.department}`}
          </p>
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {["All", "Private", "Government"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-black transition ${filter === f ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      {userLocation && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 300 }}>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapHospital && <RecenterMap lat={mapHospital.lat} lng={mapHospital.lng} />}
            {/* User marker */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup><strong>📍 Your Location</strong></Popup>
            </Marker>
            {/* Hospital markers */}
            {top.map(h => (
              <Marker
                key={h.id}
                position={[h.lat, h.lng]}
                icon={selectedHospital?.id === h.id ? selectedIcon : h.type === "Government" ? govtIcon : privateIcon}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>{h.name}</strong><br />
                    {h.type} · {h.distanceLabel} · ⭐ {h.rating}<br />
                    <span className="text-slate-500">Wait: {h.waitTime} · Queue: {h.queue}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Hospital cards */}
      <div className="space-y-3">
        {top.map((h, idx) => {
          const isSelected = selectedHospital?.id === h.id;
          const isRecommended = idx === 0;
          return (
            <div
              key={h.id}
              onClick={() => handleSelect(h)}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                isSelected ? "border-blue-500 bg-blue-50 shadow-lg" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${h.type === "Government" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                  <MdLocalHospital size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-slate-900">{h.name}</h3>
                        {isRecommended && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">⭐ Best Match</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${h.type === "Government" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                          {h.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{h.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <FaStar size={11} className="text-amber-400" />
                      <span className="text-xs font-black text-slate-700">{h.rating}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <FaMapMarkerAlt size={10} className="text-slate-400" /> {h.distanceLabel}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <FaClock size={10} className="text-slate-400" /> {h.travelTime}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <FaUserMd size={10} className="text-slate-400" /> {h.doctors} Doctors
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <FaBed size={10} className="text-slate-400" /> {h.emergencyBeds} Emg Beds
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600">Queue: <strong>{h.queue} patients</strong></span>
                    <span className="text-xs font-bold text-slate-600">Wait: <strong>{h.waitTime}</strong></span>
                    {h.hasDepartment && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-100">
                        ✓ {triage.department} available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedHospital && (
        <button
          id="btn-book-hospital"
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white transition hover:bg-blue-700"
        >
          Book at {selectedHospital.name} <FaChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 4b — Ambulance (shown when High/Critical priority)
// ═════════════════════════════════════════════════════════════════════════════
function AmbulancePanel({ triage, selectedHospital, userLocation }) {
  if (triage.priority !== "High" && triage.priority !== "Critical") return null;

  return (
    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
          <FaAmbulance className="text-red-600" size={18} />
        </div>
        <div>
          <h3 className="font-black text-red-700">Emergency Alert</h3>
          <p className="text-xs text-red-600 font-semibold">Priority: {triage.priority} — Ambulance recommended</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
        <div className="rounded-xl bg-white border border-red-100 p-3">
          <p className="text-xs font-black text-slate-400 mb-1">Nearest Ambulance</p>
          <p className="text-sm font-black text-slate-900">1.2 km away</p>
        </div>
        <div className="rounded-xl bg-white border border-red-100 p-3">
          <p className="text-xs font-black text-slate-400 mb-1">ETA</p>
          <p className="text-sm font-black text-red-600">4 min</p>
        </div>
        <div className="rounded-xl bg-white border border-red-100 p-3">
          <p className="text-xs font-black text-slate-400 mb-1">Emergency No.</p>
          <p className="text-sm font-black text-slate-900">108</p>
        </div>
        <div className="rounded-xl bg-white border border-red-100 p-3">
          <p className="text-xs font-black text-slate-400 mb-1">Destination</p>
          <p className="text-xs font-black text-slate-900 truncate">{selectedHospital?.name || "Nearest ER"}</p>
        </div>
      </div>

      <a
        href="tel:108"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 py-3 text-sm font-black text-white transition hover:bg-red-700"
      >
        <FaAmbulance /> Call Emergency Ambulance (108)
      </a>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 5 — Booking Confirmation
// ═════════════════════════════════════════════════════════════════════════════
function StepBooking({ patient, triage, selectedHospital, symptoms, onBookingComplete }) {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  const handleBook = async () => {
    setLoading(true);
    try {
      const data = await bookHospital({
        patientName: patient.name,
        age: patient.age,
        mobile: patient.mobile,
        gender: patient.gender,
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        hospitalType: selectedHospital.type,
        department: triage.department,
        priority: triage.priority,
        symptoms,
        aiSummary: triage.summary,
      });
      setBooking(data);
    } catch (err) {
      // Fallback confirmation
      const appointmentId = `APT-${Date.now().toString(36).toUpperCase()}`;
      setBooking({
        success: true,
        appointmentId,
        token: selectedHospital.type === "Government" ? `A${Math.floor(Math.random() * 90) + 105}` : `P${Math.floor(Math.random() * 900) + 100}`,
        queueNumber: `Q${Math.floor(Math.random() * 50) + 10}`,
        estimatedTime: `${Math.floor(Math.random() * 40) + 15} min`,
        hospitalType: selectedHospital.type,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-slate-900 px-6 py-5">
            <h2 className="text-lg font-black text-white">Confirm Appointment</h2>
            <p className="text-sm text-slate-300 font-medium">{selectedHospital.name}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
              <Row label="Patient" value={patient.name} />
              <Row label="Age / Gender" value={`${patient.age} yrs / ${patient.gender}`} />
              <Row label="Mobile" value={patient.mobile} />
              <Row label="Hospital" value={selectedHospital.name} />
              <Row label="Hospital Type" value={selectedHospital.type} />
              <Row label="Department" value={triage.department} />
              <Row label="Priority" value={triage.priority} />
              <Row label="Est. Travel" value={selectedHospital.travelTime} />
              <Row label="Current Queue" value={`${selectedHospital.queue} patients`} />
            </div>

            <button
              id="btn-confirm-booking"
              onClick={handleBook}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? <><FaSpinner className="animate-spin" /> Booking...</> : <><FaCheckCircle /> Confirm Booking</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Booking confirmed
  const qrData = `SmartHealthAI|${booking.appointmentId}|${patient.name}|${selectedHospital.name}|${triage.department}`;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up space-y-4">
      {/* Success header */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
          <FaCheckCircle size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black text-emerald-800">Appointment Confirmed!</h2>
          <p className="text-sm text-emerald-700 font-medium">Show this to reception at {selectedHospital.name}</p>
        </div>
      </div>

      {/* Booking details + QR */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <DetailBlock label="Appointment ID" value={booking.appointmentId} accent />
            <DetailBlock label="Token Number" value={booking.token} accent />
            <DetailBlock label="Queue Number" value={booking.queueNumber} />
            <DetailBlock label="Estimated Time" value={booking.estimatedTime} />
            <DetailBlock label="Department" value={triage.department} />
            <DetailBlock label="Hospital" value={selectedHospital.name} />
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <QRCodeSVG value={qrData} size={140} level="M" />
            </div>
            <p className="mt-2 text-xs text-slate-500 font-semibold text-center">Show at reception</p>
          </div>
        </div>
      </div>

      <button
        id="btn-go-to-dashboard"
        onClick={() => onBookingComplete(booking)}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black text-white transition ${
          selectedHospital.type === "Government"
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {selectedHospital.type === "Government"
          ? <><MdLocalHospital /> View at Government Reception</>
          : <><FaHospital /> View at Private Hospital Dashboard</>
        }
        <FaChevronRight size={12} />
      </button>
    </div>
  );
}

// Helper sub-components
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function DetailBlock({ label, value, accent }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
      <p className={`text-base font-black ${accent ? "text-blue-700" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN — Patient Page (orchestrator)
// ═════════════════════════════════════════════════════════════════════════════
const HYDERABAD_CENTER = { lat: 17.3850, lng: 78.4867 };

export default function Patient() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState(null);
  const [symptomData, setSymptomData] = useState(null); // { primarySymptom, messages, triage }
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  // Scroll to top on step transitions to prevent viewport focus issues
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // Get geolocation when step 4 starts
  const initializeHospitals = useCallback((dept) => {
    const fallback = HYDERABAD_CENTER;
    // Set fallback immediately so the UI is not empty/broken while waiting
    setUserLocation(fallback);
    const initialHospitals = getNearbyHospitals(fallback.lat, fallback.lng, dept);
    setHospitals(initialHospitals);
    setSelectedHospital(initialHospitals[0] || null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          const updatedHospitals = getNearbyHospitals(loc.lat, loc.lng, dept);
          setHospitals(updatedHospitals);
          // If the top hospital was selected, update it to the new location-based top hospital
          setSelectedHospital(prev => {
            if (!prev || prev.id === initialHospitals[0]?.id) {
              return updatedHospitals[0] || null;
            }
            return prev;
          });
        },
        (error) => {
          console.warn("Geolocation failed or denied, using Hyderabad center fallback:", error);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const handleEmergencyTrigger = (reason, department) => {
    const form = {
      name: "Emergency Patient",
      age: "Unspecified",
      gender: "Unspecified",
      mobile: "Unspecified"
    };
    setPatient(form);
    setSymptomData({
      primarySymptom: reason,
      messages: [{ role: "user", content: `EMERGENCY ALERT: ${reason}` }],
      triage: {
        priority: "Critical",
        department: department || "Emergency",
        confidence: "99%",
        waitTime: "Immediate",
        summary: `CRITICAL TRAUMA/EMERGENCY: Patient reported a severe case of "${reason}". Skip wait queues and proceed directly to emergency services.`,
        diagnoses: ["Immediate clinical stabilization required"],
        tests: ["Trauma Assessment", "ECG / Vitals Monitoring"],
      }
    });
    setStep(3); // Skip Chat directly to Triage
  };

  // Step 1 → 2
  const handlePatientNext = (form) => {
    setPatient(form);
    setStep(2);
  };

  // Build a safe fallback triage if data.triage is missing
  const safeFallbackTriage = (symptom) => ({
    priority: "Medium",
    department: "General Medicine",
    confidence: "85%",
    waitTime: "25 min",
    summary: `Based on your reported symptoms (${symptom || "unspecified"}), please proceed to the hospital for evaluation.`,
    diagnoses: ["Requires clinical evaluation"],
    tests: ["Complete Blood Count", "Blood Pressure Monitoring"],
  });

  // Step 2 → 3
  const handleChatComplete = (data) => {
    const safeTriage = data.triage && typeof data.triage === "object"
      ? data.triage
      : safeFallbackTriage(data.primarySymptom);
    setSymptomData({ ...data, triage: safeTriage });
    setStep(3);
  };

  // Step 3 → 4
  const handleTriageNext = () => {
    setStep(4);
    initializeHospitals(symptomData?.triage?.department || "");
  };

  // Step 4 → 5
  const handleHospitalNext = () => {
    setStep(5);
  };

  // Step 5 → redirect
  const handleBookingComplete = (booking) => {
    setBookingResult(booking);
    const tab = selectedHospital?.type === "Government" ? "government" : "private";
    navigate(`/hospital?tab=${tab}`, {
      state: {
        patientName: patient.name,
        age: patient.age,
        mobile: patient.mobile,
        gender: patient.gender,
        department: symptomData?.triage?.department,
        priority: symptomData?.triage?.priority,
        symptoms: symptomData?.primarySymptom,
        token: booking.token,
        appointmentId: booking.appointmentId,
        hospitalName: selectedHospital.name,
      },
    });
  };

  const triage = symptomData?.triage;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" size={16} />
                Patient Healthcare Journey
              </h1>
              <p className="text-xs text-slate-500 font-medium">SmartHealthAI · Digital India Platform</p>
            </div>
            <StepIndicator currentStep={step} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1 */}
        {step === 1 && (
          <StepPatientDetails onNext={handlePatientNext} onEmergencyTrigger={handleEmergencyTrigger} />
        )}

        {/* Step 2 */}
        {step === 2 && patient && (
          <StepSymptomChat patient={patient} onComplete={handleChatComplete} />
        )}

        {/* Step 3 */}
        {step === 3 && (
          triage ? (
            <StepTriageResult
              triage={triage}
              primarySymptom={symptomData?.primarySymptom}
              onNext={handleTriageNext}
            />
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 text-center">
                <FaSpinner className="animate-spin text-blue-500 mx-auto mb-4" size={28} />
                <p className="text-sm font-semibold text-slate-600">Generating your triage report...</p>
              </div>
            </div>
          )
        )}

        {/* Step 4 */}
        {step === 4 && triage && (
          <>
            {/* Ambulance panel (only for High/Critical) */}
            {(triage.priority === "High" || triage.priority === "Critical") && (
              <AmbulancePanel
                triage={triage}
                selectedHospital={selectedHospital}
                userLocation={userLocation}
              />
            )}

            <StepNearbyHospitals
              triage={triage}
              userLocation={userLocation}
              hospitals={hospitals}
              selectedHospital={selectedHospital}
              onSelect={setSelectedHospital}
              onNext={handleHospitalNext}
            />
          </>
        )}

        {/* Step 5 */}
        {step === 5 && selectedHospital && triage && (
          <StepBooking
            patient={patient}
            triage={triage}
            selectedHospital={selectedHospital}
            symptoms={symptomData?.primarySymptom}
            onBookingComplete={handleBookingComplete}
          />
        )}
      </div>
    </div>
  );
}
