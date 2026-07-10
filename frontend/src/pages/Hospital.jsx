import { useState, useEffect, useCallback } from "react";
import {
  fetchHospitalDashboard,
  fetchQueue,
  fetchDepartments,
  fetchReceptionStats,
  registerPatient,
} from "../lib/api";
import {
  FaHospital,
  FaUserMd,
  FaTicketAlt,
  FaBed,
  FaAmbulance,
  FaBrain,
  FaSearch,
} from "react-icons/fa";

// ─── Badge helper ─────────────────────────────────────────────────────────────
function statusBadge(value) {
  const v = String(value).toLowerCase();
  if (v.includes("high") || v.includes("busy") || v.includes("emergency"))
    return "bg-red-50 text-red-700 ring-1 ring-red-100";
  if (v.includes("medium") || v.includes("moderate") || v.includes("waiting") || v.includes("consultation"))
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "patient",     label: "Patient View",         icon: FaTicketAlt },
  { key: "private",     label: "Private Hospital",      icon: FaHospital  },
  { key: "government",  label: "Government Reception",  icon: FaUserMd    },
];

// ─── PATIENT VIEW (token tracker) ─────────────────────────────────────────────
function PatientView({ queue, departments, loading }) {
  const [search, setSearch] = useState("");
  const found = queue.find(
    (r) => r.token?.toLowerCase() === search.trim().toLowerCase()
  );

  const currentlyServing = queue.find((r) => r.status === "In Consultation");
  const waiting = queue.filter((r) => r.status === "Waiting");

  return (
    <div className="space-y-6">

      {/* Token Search */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3">
          <FaSearch className="text-blue-600" size={20} /> Track Your Token
        </h2>
        <p className="mt-2 text-slate-500 text-sm font-semibold">
          Enter your token number to see your position in the queue.
        </p>
        <div className="mt-4 flex gap-3">
          <input
            id="token-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. A105"
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-900 text-lg outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 uppercase"
          />
          <button
            id="btn-track-token"
            className="btn btn-primary px-6 py-3"
            onClick={() => setSearch(search.trim())}
          >
            Track
          </button>
        </div>

        {search && (
          <div className={`mt-4 rounded-2xl p-5 animate-fade-in ${found ? "bg-blue-50 ring-1 ring-blue-200" : "bg-red-50 ring-1 ring-red-100"}`}>
            {found ? (
              <div>
                <p className="text-2xl font-black text-blue-800">🎟️ Token {found.token}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Patient",    value: found.patient },
                    { label: "Department", value: found.department },
                    { label: "Priority",   value: found.priority },
                    { label: "Status",     value: found.status },
                  ].map((f) => (
                    <div key={f.label} className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
                      <p className="text-xs font-black uppercase text-blue-500 tracking-wide">{f.label}</p>
                      <p className="mt-1 font-black text-slate-900">{f.value}</p>
                    </div>
                  ))}
                </div>
                {found.status === "Waiting" && (
                  <p className="mt-4 text-sm font-bold text-blue-700">
                    📍 Position in queue:{" "}
                    <strong>{waiting.findIndex((r) => r.token === found.token) + 1}</strong> of{" "}
                    {waiting.length} waiting
                  </p>
                )}
              </div>
            ) : (
              <p className="font-bold text-red-700">❌ Token not found. Please check and try again.</p>
            )}
          </div>
        )}
      </div>

      {/* Currently Serving */}
      {currentlyServing && (
        <div
          className="card p-6 animate-fade-in-up"
          style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", color: "white" }}
        >
          <p className="text-sm font-black uppercase tracking-wider text-blue-200">Now Serving</p>
          <p className="mt-2 text-4xl font-black">{currentlyServing.token}</p>
          <p className="mt-1 text-lg font-semibold text-blue-100">
            {currentlyServing.patient} — {currentlyServing.department}
          </p>
        </div>
      )}

      {/* Live Queue */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-950">Live Queue</h2>
          <span className="badge badge-green text-xs">● Live</span>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left" id="live-queue-table">
              <thead className="bg-slate-950 text-white">
                <tr>
                  {["Token", "Patient", "Department", "Priority", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  [1,2,3].map((i) => (
                    <tr key={i}>
                      {[1,2,3,4,5].map((j) => (
                        <td key={j} className="px-4 py-4"><div className="skeleton h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : queue.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-semibold">No patients in queue</td></tr>
                ) : (
                  queue.map((row) => (
                    <tr key={row.token} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4 font-black text-slate-950">{row.token}</td>
                      <td className="px-4 py-4 font-bold text-slate-700">{row.patient}</td>
                      <td className="px-4 py-4 font-bold text-slate-700">{row.department}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadge(row.priority)}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Department Wait Times */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-2xl font-black text-slate-950 mb-4">Department Wait Times</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <div key={d.department} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-950">{d.department}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {d.queue} patients · <strong className="text-slate-700">{d.wait}</strong>
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadge(d.status)}`}>
                  {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRIVATE HOSPITAL VIEW ────────────────────────────────────────────────────
function PrivateHospitalView({ dashboard, loading }) {
  const kpis = [
    { label: "Active Patients",   value: dashboard?.currentPatients ?? "126", icon: FaUserMd,   color: "text-blue-600" },
    { label: "Doctors on Duty",   value: dashboard?.doctorsOnDuty ?? "32",    icon: FaBrain,    color: "text-purple-600" },
    { label: "Available Beds",    value: dashboard?.emergencyBeds ?? "42",    icon: FaBed,      color: "text-emerald-600" },
    { label: "ICU Beds",          value: dashboard?.icuBeds ?? "6",           icon: FaBed,      color: "text-red-600" },
    { label: "Emergency Cases",   value: "7",                                  icon: FaAmbulance, color: "text-orange-600" },
    { label: "Ambulances Ready",  value: "4",                                  icon: FaAmbulance, color: "text-teal-600" },
  ];

  const depts = [
    { name: "Cardiology",      doctors: 4, patients: 18, beds: 8,  status: "Busy" },
    { name: "Neurology",       doctors: 3, patients: 12, beds: 6,  status: "Moderate" },
    { name: "Orthopedics",     doctors: 5, patients: 22, beds: 12, status: "Busy" },
    { name: "General Medicine",doctors: 8, patients: 45, beds: 20, status: "Busy" },
    { name: "Dermatology",     doctors: 2, patients: 8,  beds: 4,  status: "Available" },
    { name: "Radiology",       doctors: 2, patients: 14, beds: 0,  status: "Moderate" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5 animate-fade-in-up">
              {loading ? (
                <>
                  <div className="skeleton h-3 w-24 mb-3" />
                  <div className="skeleton h-10 w-16" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={k.color} size={18} />
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">{k.label}</p>
                  </div>
                  <p className="text-4xl font-black text-slate-950">{k.value}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Department Table */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-2xl font-black text-slate-950 mb-4">Department Status</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left" id="dept-status-table">
              <thead className="bg-slate-950 text-white">
                <tr>
                  {["Department", "Doctors", "Patients", "Beds", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {depts.map((d) => (
                  <tr key={d.name} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 font-black text-slate-950">{d.name}</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{d.doctors}</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{d.patients}</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{d.beds}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadge(d.status)}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-2xl font-black text-slate-950 mb-4">Operational Notices</h2>
        <div className="space-y-3">
          {[
            "Doctor unavailable in ENT department from 2:00 PM to 4:00 PM.",
            "Emergency room currently busy. Direct non-critical cases to General Medicine.",
            "MRI machine under maintenance until 5:30 PM.",
          ].map((n) => (
            <div key={n} className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <p className="font-semibold leading-6 text-amber-900 text-sm">⚠ {n}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GOVERNMENT RECEPTION VIEW ────────────────────────────────────────────────
function GovernmentView({ queue, departments, stats, onRefresh, loading }) {
  const [formData, setFormData] = useState({
    patientName: "", age: "", mobileNumber: "", aadhaarId: "",
    gender: "", department: "General Medicine", symptoms: "", priority: "Low",
  });
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage]   = useState("");
  const [latestToken, setLatestToken]     = useState(null);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const handleInput = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const data = await registerPatient({
        patientName: formData.patientName,
        age:         formData.age,
        mobile:      formData.mobileNumber,
        gender:      formData.gender,
        department:  formData.department,
        symptoms:    formData.symptoms,
        priority:    formData.priority,
      });
      const tokenNumber         = data.tokenNumber || data.token;
      const estimatedWaitingTime = data.estimatedWaitingTime || "25 min";
      setLatestToken({ token: tokenNumber, estimatedWaitingTime });
      setSuccessMessage(`Patient registered. Token ${tokenNumber} assigned.`);
      await onRefresh();
      setFormData({
        patientName: "", age: "", mobileNumber: "", aadhaarId: "",
        gender: "", department: "General Medicine", symptoms: "", priority: "Low",
      });
    } catch (err) {
      setErrorMessage(err.message || "Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50";

  return (
    <div className="space-y-6">

      {/* Header band */}
      <div className="card p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-in-up">
        <div>
          <span className="badge badge-blue">Government Reception</span>
          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Digital Patient Registration
          </h2>
          <p className="mt-1 text-slate-500 text-sm font-semibold">
            Register patients, issue tokens, monitor live queues.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 text-center">
            <p className="text-xs font-black uppercase text-slate-500">Date</p>
            <p className="mt-1 font-black text-slate-950 text-sm">{currentDate}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100 text-center">
            <p className="text-xs font-black uppercase text-emerald-700">Status</p>
            <p className="mt-1 font-black text-emerald-800 text-sm">● Open</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100 text-center">
            <p className="text-xs font-black uppercase text-blue-700">Today</p>
            <p className="mt-1 font-black text-blue-800 text-sm">{stats?.[0]?.value ?? "—"}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100 text-center">
            <p className="text-xs font-black uppercase text-amber-700">Waiting</p>
            <p className="mt-1 font-black text-amber-800 text-sm">{stats?.[1]?.value ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        {stats?.map((s) => (
          <div key={s.label} className="card p-5 animate-fade-in-up">
            <p className="text-sm font-bold text-slate-500">{s.label}</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Form + Queue */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">

        {/* Registration Form */}
        <section className="card p-6 animate-fade-in-up">
          <h2 className="text-2xl font-black text-slate-950">New Patient Registration</h2>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} id="patient-registration-form">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Patient Name *</span>
              <input type="text" name="patientName" value={formData.patientName} onChange={handleInput}
                className={inputCls} placeholder="Full name" required id="field-patient-name" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Age *</span>
              <input type="number" name="age" value={formData.age} onChange={handleInput}
                className={inputCls} placeholder="Age" required id="field-age" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Mobile Number</span>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInput}
                className={inputCls} placeholder="10-digit number" id="field-mobile" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Aadhaar ID <span className="text-slate-400 font-normal">(optional)</span></span>
              <input type="text" name="aadhaarId" value={formData.aadhaarId} onChange={handleInput}
                className={inputCls} placeholder="XXXX XXXX XXXX" id="field-aadhaar" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Gender *</span>
              <select name="gender" value={formData.gender} onChange={handleInput}
                className={inputCls} required id="field-gender">
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Department</span>
              <select name="department" value={formData.department} onChange={handleInput}
                className={inputCls} id="field-department">
                <option>General Medicine</option><option>Cardiology</option>
                <option>Neurology</option><option>Orthopedics</option><option>Dermatology</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-slate-700">Symptoms *</span>
              <textarea rows="3" name="symptoms" value={formData.symptoms} onChange={handleInput}
                className={inputCls} placeholder="Describe patient's symptoms" required id="field-symptoms" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Priority Level</span>
              <select name="priority" value={formData.priority} onChange={handleInput}
                className={inputCls} id="field-priority">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </label>
            <button type="submit" disabled={isSubmitting} id="btn-register-patient"
              className="self-end rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Registering…" : "Register Patient"}
            </button>
            {(successMessage || errorMessage) && (
              <div className={`rounded-2xl p-4 text-sm font-bold ring-1 sm:col-span-2 animate-fade-in ${
                successMessage ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-red-50 text-red-700 ring-red-100"
              }`}>
                {successMessage || errorMessage}
              </div>
            )}
          </form>
        </section>

        {/* Live Token Queue */}
        <section className="card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950">Live Token Queue</h2>
            <span className="badge badge-green text-xs">● Live</span>
          </div>
          {latestToken && (
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100 animate-fade-in">
              <p className="text-sm font-black text-blue-800">
                🎟️ Latest token: <strong>{latestToken.token}</strong> · Wait: {latestToken.estimatedWaitingTime}
              </p>
            </div>
          )}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left" id="token-queue-table">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    {["Token", "Patient", "Dept", "Priority", "Status"].map((h) => (
                      <th key={h} className="px-3 py-3 text-xs font-black uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    [1,2,3].map((i) => (
                      <tr key={i}>{[1,2,3,4,5].map((j) => (
                        <td key={j} className="px-3 py-4"><div className="skeleton h-4 w-14" /></td>
                      ))}</tr>
                    ))
                  ) : queue.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-semibold">No patients in queue</td></tr>
                  ) : (
                    queue.map((row) => (
                      <tr key={row.token} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-3 font-black text-slate-950">{row.token}</td>
                        <td className="px-3 py-3 font-bold text-slate-700 max-w-[100px] truncate">{row.patient}</td>
                        <td className="px-3 py-3 font-bold text-slate-700 text-xs">{row.department}</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-black ${statusBadge(row.priority)}`}>{row.priority}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-black ${statusBadge(row.status)}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Department Queue */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-2xl font-black text-slate-950 mb-4">Department Queue Status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <div key={d.department} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-950">{d.department}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Queue: <strong className="text-slate-700">{d.queue}</strong> · Wait: <strong className="text-slate-700">{d.wait}</strong>
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadge(d.status)}`}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Hospital() {
  const [activeTab, setActiveTab] = useState("patient");

  const [dashboard,    setDashboard]    = useState(null);
  const [queue,        setQueue]        = useState([]);
  const [departments,  setDepartments]  = useState([]);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [dash, q, depts, receptionStats] = await Promise.all([
        fetchHospitalDashboard().catch(() => null),
        fetchQueue().catch(() => []),
        fetchDepartments().catch(() => []),
        fetchReceptionStats().catch(() => null),
      ]);
      setDashboard(dash);
      setQueue(q);
      setDepartments(depts);
      if (receptionStats) {
        setStats([
          { label: "Patients Registered Today", value: String(receptionStats.patientsRegisteredToday) },
          { label: "Waiting Patients",           value: String(receptionStats.waitingPatients) },
          { label: "Completed Consultations",    value: String(receptionStats.completedConsultations) },
          { label: "Emergency Cases",            value: String(receptionStats.emergencyCases) },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-10 lg:px-8">

        {/* Page Header */}
        <div
          className="overflow-hidden rounded-3xl p-8 text-white shadow-2xl lg:p-12 mb-8"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #0f172a 100%)" }}
        >
          <span className="badge" style={{ background: "rgba(255,255,255,0.12)", color: "#93c5fd", borderColor: "rgba(255,255,255,0.2)" }}>
            Hospital Operations
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            SmartHealthAI Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-blue-100">
            Track your token, check wait times, or manage patient registration — all in one place for both private and government hospitals.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-md ring-1 ring-slate-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                id={`tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "patient"    && <PatientView queue={queue} departments={departments} loading={loading} />}
        {activeTab === "private"    && <PrivateHospitalView dashboard={dashboard} loading={loading} />}
        {activeTab === "government" && (
          <GovernmentView
            queue={queue}
            departments={departments}
            stats={stats}
            onRefresh={loadData}
            loading={loading}
          />
        )}
      </section>
    </main>
  );
}
