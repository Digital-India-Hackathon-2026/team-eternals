import { useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  fetchHospitalDashboard,
  fetchQueue,
  fetchDepartments,
  fetchReceptionStats,
  registerPatient,
  registerPrivatePatient,
  fetchPrivateQueue,
  fetchPrivateStats,
} from "../lib/api";
import {
  FaHospital, FaUserMd, FaTicketAlt,
  FaAmbulance, FaSearch, FaCheckCircle, FaSync,
} from "react-icons/fa";
import { MdEmergency } from "react-icons/md";

// ─── Shared helpers ────────────────────────────────────────────────────────────
function statusBadge(v = "") {
  const s = String(v).toLowerCase();
  if (s.includes("high") || s.includes("critical") || s.includes("busy") || s.includes("emergency"))
    return "bg-red-50 text-red-700 ring-1 ring-red-100";
  if (s.includes("medium") || s.includes("moderate") || s.includes("waiting") || s.includes("consultation"))
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
}

function PriorityPill({ priority }) {
  const cfg = {
    Critical: "bg-red-600 text-white",
    High:     "bg-orange-500 text-white",
    Medium:   "bg-yellow-500 text-white",
    Low:      "bg-emerald-500 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${cfg[priority] || "bg-slate-400 text-white"}`}>
      {(priority === "Critical" || priority === "High") && <MdEmergency size={12} />}
      {priority}
    </span>
  );
}

// ─── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "patient",    label: "Patient View",        icon: FaTicketAlt },
  { key: "private",   label: "Private Hospital",     icon: FaHospital  },
  { key: "government",label: "Government Reception", icon: FaUserMd    },
];

// ─── Shared input style ────────────────────────────────────────────────────────
const inputCls = "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50";

// ─── Incoming Patient Alert Card ───────────────────────────────────────────────
function IncomingPatientCard({ patient }) {
  if (!patient) return null;
  const isEmergency = patient.priority === "High" || patient.priority === "Critical";
  return (
    <div className={`rounded-2xl border-2 p-6 animate-fade-in-up ${isEmergency ? "border-red-300 bg-red-50" : "border-blue-200 bg-blue-50"}`}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isEmergency ? "bg-red-600" : "bg-blue-600"} text-white shadow`}>
          {isEmergency ? <MdEmergency size={22} /> : <FaCheckCircle size={20} />}
        </div>
        <div>
          <p className={`text-xs font-black uppercase tracking-wide ${isEmergency ? "text-red-600" : "text-blue-600"}`}>
            {isEmergency ? "🚨 Emergency — Action Required" : "✅ Incoming Patient via SmartHealthAI"}
          </p>
          <p className="text-xl font-black text-slate-900">{patient.patientName}</p>
        </div>
        {isEmergency && (
          <span className="ml-auto animate-pulse rounded-full bg-red-600 px-3 py-1.5 text-xs font-black text-white">
            HIGH PRIORITY
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Token",      value: patient.token,      big: true },
          { label: "Department", value: patient.department },
          { label: "Priority",   value: <PriorityPill priority={patient.priority} /> },
          { label: "Age / Sex",  value: `${patient.age || "—"} / ${patient.gender || "—"}` },
          { label: "Mobile",     value: patient.mobile || "—" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">{item.label}</p>
            <p className={`font-black ${item.big ? "text-blue-700 text-xl" : "text-slate-900 text-sm"}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {patient.symptoms && (
        <div className="mt-3 rounded-xl bg-white border border-slate-100 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">Chief Complaint</p>
          <p className="text-sm font-semibold text-slate-700">{patient.symptoms}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-black text-emerald-700">
          <FaCheckCircle /> Pre-registered · Appt: {patient.appointmentId || "—"}
        </div>
        {isEmergency && (
          <a href="tel:108" className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white hover:bg-red-700 transition">
            <FaAmbulance /> Emergency: 108
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Shared Queue Table ────────────────────────────────────────────────────────
function QueueTable({ queue, loading, cols, incomingToken, id }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left" id={id}>
          <thead className="bg-slate-950 text-white">
            <tr>
              {cols.map((h) => (
                <th key={h} className="px-3 py-3 text-xs font-black uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading
              ? [1,2,3].map((i) => (
                  <tr key={i}>
                    {cols.map((c) => <td key={c} className="px-3 py-4"><div className="skeleton h-4 w-14" /></td>)}
                  </tr>
                ))
              : queue.length === 0
                ? <tr><td colSpan={cols.length} className="px-4 py-10 text-center text-slate-400 font-semibold">No patients in queue</td></tr>
                : queue.map((row) => {
                    const isNew = incomingToken && row.token === incomingToken;
                    return (
                      <tr key={row.token + row.patient} className={`transition ${isNew ? "bg-blue-50 ring-2 ring-inset ring-blue-400" : "hover:bg-slate-50"}`}>
                        <td className={`px-3 py-3 font-black ${isNew ? "text-blue-700" : "text-slate-950"}`}>
                          {row.token}
                          {isNew && <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-black text-white">NEW</span>}
                        </td>
                        <td className="px-3 py-3 font-bold text-slate-700 max-w-[110px] truncate">{row.patient}</td>
                        <td className="px-3 py-3 font-bold text-slate-700 text-xs">{row.department}</td>
                        {row.type !== undefined && (
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${row.type === "Emergency" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                              {row.type}
                            </span>
                          </td>
                        )}
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-black ${statusBadge(row.priority)}`}>{row.priority}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-black ${statusBadge(row.status)}`}>{row.status}</span>
                        </td>
                      </tr>
                    );
                  })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Shared Stat Cards ─────────────────────────────────────────────────────────
function StatCards({ stats }) {
  const icons = ["🏥", "⏳", "👨‍⚕️", "🚨"];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label} className="card p-5 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-500">{s.label}</p>
            <span className="text-xl">{icons[i]}</span>
          </div>
          <p className="text-4xl font-black text-slate-950">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Shared Department Grid ────────────────────────────────────────────────────
function DeptGrid({ departments, incomingDept }) {
  return (
    <div className="card p-6 animate-fade-in-up">
      <h2 className="text-2xl font-black text-slate-950 mb-4">Department Queue Status</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const isMatch = incomingDept && d.department.toLowerCase().includes(incomingDept.toLowerCase());
          return (
            <div key={d.department} className={`rounded-2xl p-5 ring-1 transition ${isMatch ? "bg-blue-50 ring-blue-200" : "bg-slate-50 ring-slate-200"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`font-black ${isMatch ? "text-blue-800" : "text-slate-950"}`}>
                    {d.department}
                    {isMatch && <span className="ml-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-black text-white">↑ +1</span>}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Queue: <strong className="text-slate-700">{isMatch ? (d.queue || 0) + 1 : d.queue}</strong>
                    {" · "}Wait: <strong className="text-slate-700">{d.wait}</strong>
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadge(d.status)}`}>{d.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HOSPITAL DASHBOARD LAYOUT
// Used by BOTH Private Hospital and Government Reception
// Only difference: form fields, button label, queue columns, data source
// ─────────────────────────────────────────────────────────────────────────────
function HospitalDashboard({
  // Identity
  badgeLabel, title, subtitle,
  // Stats
  stats,
  // Form
  formFields,       // Array of { name, label, type, required, options?, placeholder? }
  formData, onInput, onSubmit, isSubmitting, submitLabel,
  successMsg, errorMsg,
  // Queue
  queue, queueLoading, onRefresh, queueCols, queueId,
  latestTokenBanner,
  // Departments
  departments,
  // Incoming patient
  incomingPatient,
}) {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* ── Incoming patient alert ── */}
      <IncomingPatientCard patient={incomingPatient} />

      {/* ── Header band ── */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="badge badge-blue">{badgeLabel}</span>
            <h2 className="mt-3 text-3xl font-black text-slate-950">{title}</h2>
            <p className="mt-1 text-slate-500 text-sm font-semibold">{subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Date",    value: currentDate,             cls: "bg-slate-50   ring-slate-200   text-slate-500  val-slate-950" },
              { label: "Status",  value: "● Open",                cls: "bg-emerald-50 ring-emerald-100 text-emerald-700 val-emerald-800" },
              { label: "Today",   value: stats[0]?.value ?? "—",  cls: "bg-blue-50    ring-blue-100    text-blue-700   val-blue-800" },
              { label: "Waiting", value: stats[1]?.value ?? "—",  cls: "bg-amber-50   ring-amber-100   text-amber-700  val-amber-800" },
            ].map((s) => {
              const [bg, ring, lc, vc] = s.cls.split(/\s+/);
              return (
                <div key={s.label} className={`rounded-2xl p-3 ring-1 text-center ${bg} ${ring}`}>
                  <p className={`text-xs font-black uppercase ${lc}`}>{s.label}</p>
                  <p className={`mt-1 font-black text-sm text-${vc.replace("val-","")}`}>{s.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── KPI stat cards ── */}
      <StatCards stats={stats} />

      {/* ── Registration form + Live queue side-by-side ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">

        {/* Registration Form */}
        <section className="card p-6 animate-fade-in-up">
          <h2 className="text-2xl font-black text-slate-950">New Patient Registration</h2>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            {formFields.map((f) => (
              <label key={f.name} className={`block ${f.fullWidth ? "sm:col-span-2" : ""}`}>
                <span className="text-sm font-bold text-slate-700">
                  {f.label}{f.required && " *"}{f.hint && <span className="ml-1 text-slate-400 font-normal">{f.hint}</span>}
                </span>
                {f.type === "select" ? (
                  <select name={f.name} value={formData[f.name]} onChange={onInput} className={inputCls} required={f.required} id={`field-${f.name}`}>
                    {f.options.map((o) => typeof o === "string"
                      ? <option key={o}>{o}</option>
                      : <option key={o.value} value={o.value}>{o.label}</option>
                    )}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea rows="3" name={f.name} value={formData[f.name]} onChange={onInput}
                    className={inputCls} placeholder={f.placeholder} required={f.required} id={`field-${f.name}`} />
                ) : (
                  <input type={f.type || "text"} name={f.name} value={formData[f.name]} onChange={onInput}
                    className={inputCls} placeholder={f.placeholder} required={f.required}
                    maxLength={f.maxLength} min={f.min} max={f.max} id={`field-${f.name}`} />
                )}
              </label>
            ))}

            <button type="submit" disabled={isSubmitting}
              className="self-end rounded-2xl bg-blue-600 px-6 py-3.5 font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Registering…" : submitLabel}
            </button>

            {(successMsg || errorMsg) && (
              <div className={`rounded-2xl p-4 text-sm font-bold ring-1 sm:col-span-2 animate-fade-in ${successMsg ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-red-50 text-red-700 ring-red-100"}`}>
                {successMsg || errorMsg}
              </div>
            )}
          </form>
        </section>

        {/* Live Queue */}
        <section className="card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-950">Live Queue</h2>
            <div className="flex items-center gap-2">
              <button onClick={onRefresh}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-200 transition">
                <FaSync size={10} /> Refresh
              </button>
              <span className="badge badge-green text-xs">● Live</span>
            </div>
          </div>

          {latestTokenBanner && (
            <div className="mb-4 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100 animate-fade-in">
              <p className="text-sm font-black text-blue-800">
                🎟️ Latest: <strong>{latestTokenBanner.token}</strong> · Est. wait: {latestTokenBanner.wait}
              </p>
            </div>
          )}

          <QueueTable
            queue={queue}
            loading={queueLoading}
            cols={queueCols}
            incomingToken={incomingPatient?.token}
            id={queueId}
          />
        </section>
      </div>

      {/* ── Department grid ── */}
      <DeptGrid departments={departments} incomingDept={incomingPatient?.department} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HOSPITAL VIEW
// ─────────────────────────────────────────────────────────────────────────────
function PrivateHospitalView({ dashboard, incomingPatient }) {
  const [formData, setFormData] = useState({
    patientName: "", age: "", mobileNumber: "", gender: "",
    department: "General Medicine", symptoms: "", priority: "Low", appointmentType: "OPD",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const [errorMsg, setErrorMsg]         = useState("");
  const [queue, setQueue]               = useState([]);
  const [pvtStats, setPvtStats]         = useState(null);
  const [queueLoading, setQueueLoading] = useState(true);
  const [latestToken, setLatestToken]   = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [q, s] = await Promise.all([
        fetchPrivateQueue().catch(() => []),
        fetchPrivateStats().catch(() => null),
      ]);
      setQueue(q);
      if (s) setPvtStats(s);
    } finally {
      setQueueLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const waitingCount = queue.filter((q) => q.status === "Waiting").length;
  const stats = [
    { label: "Appointments Today", value: pvtStats?.appointmentsToday ?? 0 },
    { label: "Waiting Patients",   value: pvtStats?.waitingPatients   ?? waitingCount },
    { label: "Doctors on Duty",    value: pvtStats?.doctorsOnDuty     ?? 0 },
    { label: "Beds Available",     value: pvtStats?.bedsAvailable     ?? 0 },
  ];

  // Static dept data for private (not from govt API)
  const departments = [
    { department: "Cardiology",       queue: 8,  wait: "45 min", status: "Busy"      },
    { department: "Neurology",        queue: 5,  wait: "30 min", status: "Moderate"  },
    { department: "Orthopedics",      queue: 11, wait: "55 min", status: "Busy"      },
    { department: "General Medicine", queue: 18, wait: "70 min", status: "Busy"      },
    { department: "Dermatology",      queue: 3,  wait: "15 min", status: "Available" },
    { department: "Radiology",        queue: 6,  wait: "35 min", status: "Moderate"  },
  ];

  const handleInput  = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setSuccessMsg(""); setErrorMsg("");
    try {
      const data = await registerPrivatePatient(formData);
      setLatestToken({ token: data.token, wait: data.estimatedWaitingTime });
      setSuccessMsg(`Registered. Slot ${data.token} assigned · Est. wait: ${data.estimatedWaitingTime}`);
      setFormData({ patientName: "", age: "", mobileNumber: "", gender: "", department: "General Medicine", symptoms: "", priority: "Low", appointmentType: "OPD" });
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HospitalDashboard
      badgeLabel="Private Hospital"
      title="OPD Appointment Registration"
      subtitle="Register walk-in and pre-booked OPD patients, issue slots, monitor live queue."
      stats={stats}
      formData={formData}
      onInput={handleInput}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Register & Issue Slot"
      successMsg={successMsg}
      errorMsg={errorMsg}
      formFields={[
        { name: "patientName",    label: "Patient Name",      type: "text",     required: true,  placeholder: "Full name" },
        { name: "age",            label: "Age",               type: "number",   required: true,  placeholder: "e.g. 34", min: 1, max: 120 },
        { name: "mobileNumber",   label: "Mobile Number",     type: "tel",      required: false, placeholder: "10-digit number" },
        { name: "gender",         label: "Gender",            type: "select",   required: true,  options: [{ value: "", label: "Select gender" }, "Male", "Female", "Other"] },
        { name: "department",     label: "Department",        type: "select",   required: false, options: ["General Medicine","Cardiology","Neurology","Orthopedics","Dermatology","Radiology","ENT","Gynaecology"] },
        { name: "appointmentType",label: "Appointment Type",  type: "select",   required: false, options: ["OPD","Emergency","Follow-Up","Procedure"] },
        { name: "symptoms",       label: "Symptoms",          type: "textarea", required: true,  placeholder: "Describe symptoms", fullWidth: true },
        { name: "priority",       label: "Priority Level",    type: "select",   required: false, options: ["Low","Medium","High"] },
      ]}
      queue={queue}
      queueLoading={queueLoading}
      onRefresh={loadData}
      queueCols={["Slot","Patient","Dept","Type","Priority","Status"]}
      queueId="pvt-queue-table"
      latestTokenBanner={latestToken}
      departments={departments}
      incomingPatient={incomingPatient}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNMENT RECEPTION VIEW
// ─────────────────────────────────────────────────────────────────────────────
function GovernmentView({ queue, departments, stats, onRefresh, loading, incomingPatient }) {
  const [formData, setFormData] = useState({
    patientName: "", age: "", mobileNumber: "", aadhaarId: "",
    gender: "", department: "General Medicine", symptoms: "", priority: "Low",
  });
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage]     = useState("");
  const [latestToken, setLatestToken]       = useState(null);

  const handleInput  = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setSuccessMessage(""); setErrorMessage("");
    try {
      const data = await registerPatient({
        patientName: formData.patientName, age: formData.age,
        mobile: formData.mobileNumber,     gender: formData.gender,
        department: formData.department,   symptoms: formData.symptoms,
        priority: formData.priority,
      });
      const token = data.tokenNumber || data.token;
      const wait  = data.estimatedWaitingTime || "25 min";
      setLatestToken({ token, wait });
      setSuccessMessage(`Registered. Token ${token} assigned · Est. wait: ${wait}`);
      await onRefresh();
      setFormData({ patientName: "", age: "", mobileNumber: "", aadhaarId: "", gender: "", department: "General Medicine", symptoms: "", priority: "Low" });
    } catch (err) {
      setErrorMessage(err.message || "Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HospitalDashboard
      badgeLabel="Government Reception"
      title="Digital Patient Registration"
      subtitle="Register patients, issue tokens, monitor live queues — powered by Supabase."
      stats={stats ?? [
        { label: "Patients Registered Today", value: 0 },
        { label: "Waiting Patients",           value: 0 },
        { label: "Completed Consultations",    value: 0 },
        { label: "Emergency Cases",            value: 0 },
      ]}
      formData={formData}
      onInput={handleInput}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Register Patient"
      successMsg={successMessage}
      errorMsg={errorMessage}
      formFields={[
        { name: "patientName",  label: "Patient Name",  type: "text",     required: true,  placeholder: "Full name" },
        { name: "age",          label: "Age",           type: "number",   required: true,  placeholder: "e.g. 34", min: 1, max: 120 },
        { name: "mobileNumber", label: "Mobile Number", type: "tel",      required: false, placeholder: "10-digit number" },
        { name: "aadhaarId",    label: "Aadhaar ID",    type: "text",     required: false, placeholder: "XXXX XXXX XXXX", hint: "(optional)" },
        { name: "gender",       label: "Gender",        type: "select",   required: true,  options: [{ value: "", label: "Select gender" }, "Male", "Female", "Other"] },
        { name: "department",   label: "Department",    type: "select",   required: false, options: ["General Medicine","Cardiology","Neurology","Orthopedics","Dermatology"] },
        { name: "symptoms",     label: "Symptoms",      type: "textarea", required: true,  placeholder: "Describe patient's symptoms", fullWidth: true },
        { name: "priority",     label: "Priority Level",type: "select",   required: false, options: ["Low","Medium","High"] },
      ]}
      queue={queue}
      queueLoading={loading}
      onRefresh={onRefresh}
      queueCols={["Token","Patient","Dept","Priority","Status"]}
      queueId="govt-queue-table"
      latestTokenBanner={latestToken}
      departments={departments}
      incomingPatient={incomingPatient}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT PORTAL VIEW (Token Tracker)
// ─────────────────────────────────────────────────────────────────────────────
function PatientView({ queue, departments, loading, incomingPatient }) {
  const [search, setSearch] = useState(incomingPatient?.token || "");
  const found          = queue.find((r) => r.token?.toLowerCase() === search.trim().toLowerCase());
  const currentServing = queue.find((r) => r.status === "In Consultation");
  const waiting        = queue.filter((r) => r.status === "Waiting");

  return (
    <div className="space-y-6">
      {/* My token card */}
      {incomingPatient?.token && (
        <div className="card p-6 animate-fade-in-up" style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white" }}>
          <p className="text-xs font-black uppercase tracking-wider text-blue-200 mb-1">Your Token Number</p>
          <p className="text-5xl font-black">{incomingPatient.token}</p>
          <p className="mt-2 text-lg font-semibold text-blue-100">{incomingPatient.patientName} — {incomingPatient.department}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">Appt: {incomingPatient.appointmentId}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${(incomingPatient.priority === "High" || incomingPatient.priority === "Critical") ? "bg-red-500" : "bg-emerald-500/80"}`}>
              Priority: {incomingPatient.priority}
            </span>
          </div>
        </div>
      )}

      {/* Token search */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3"><FaSearch className="text-blue-600" size={20} /> Track Your Token</h2>
        <p className="mt-2 text-slate-500 text-sm font-semibold">Enter your token to see your queue position.</p>
        <div className="mt-4 flex gap-3">
          <input id="token-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. A105"
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-900 text-lg outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 uppercase" />
          <button id="btn-track" className="rounded-2xl bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-700 transition">Track</button>
        </div>
        {search && (
          <div className={`mt-4 rounded-2xl p-5 animate-fade-in ${found ? "bg-blue-50 ring-1 ring-blue-200" : "bg-red-50 ring-1 ring-red-100"}`}>
            {found ? (
              <div>
                <p className="text-2xl font-black text-blue-800">🎟️ Token {found.token}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[{ l: "Patient", v: found.patient }, { l: "Department", v: found.department }, { l: "Priority", v: found.priority }, { l: "Status", v: found.status }].map((f) => (
                    <div key={f.l} className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
                      <p className="text-xs font-black uppercase text-blue-500 tracking-wide">{f.l}</p>
                      <p className="mt-1 font-black text-slate-900">{f.v}</p>
                    </div>
                  ))}
                </div>
                {found.status === "Waiting" && (
                  <p className="mt-4 text-sm font-bold text-blue-700">
                    📍 Position: <strong>{waiting.findIndex((r) => r.token === found.token) + 1}</strong> of {waiting.length} waiting
                  </p>
                )}
              </div>
            ) : <p className="font-bold text-red-700">❌ Token not found. Please check and try again.</p>}
          </div>
        )}
      </div>

      {/* Now serving */}
      {currentServing && (
        <div className="card p-6 animate-fade-in-up" style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white" }}>
          <p className="text-sm font-black uppercase tracking-wider text-blue-200">Now Serving</p>
          <p className="mt-2 text-4xl font-black">{currentServing.token}</p>
          <p className="mt-1 text-lg font-semibold text-blue-100">{currentServing.patient} — {currentServing.department}</p>
        </div>
      )}

      {/* Full queue */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-950">Live Queue</h2>
          <span className="badge badge-green text-xs">● Live</span>
        </div>
        <QueueTable queue={queue} loading={loading} cols={["Token","Patient","Department","Priority","Status"]}
          incomingToken={incomingPatient?.token} id="patient-queue-table" />
      </div>

      {/* Dept waits */}
      <DeptGrid departments={departments} incomingDept={incomingPatient?.department} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Hospital() {
  const location         = useLocation();
  const [searchParams]   = useSearchParams();
  const urlTab           = searchParams.get("tab");
  const incomingPatient  = location.state || null;

  const [activeTab,  setActiveTab]  = useState(urlTab || "patient");
  const [dashboard,  setDashboard]  = useState(null);
  const [queue,      setQueue]      = useState([]);
  const [departments,setDepartments]= useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => { if (urlTab) setActiveTab(urlTab); }, [urlTab]);

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
          { label: "Waiting Patients",           value: String(receptionStats.waitingPatients)         },
          { label: "Completed Consultations",    value: String(receptionStats.completedConsultations)  },
          { label: "Emergency Cases",            value: String(receptionStats.emergencyCases)           },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const activeIncoming = incomingPatient;

  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-10 lg:px-8">

        {/* Page header */}
        <div className="overflow-hidden rounded-2xl p-6 text-white shadow-lg mb-6 lg:p-8"
          style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#0f172a 100%)" }}>
          <span className="badge" style={{ background: "rgba(255,255,255,0.12)", color: "#93c5fd", borderColor: "rgba(255,255,255,0.2)" }}>
            Hospital Operations
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">SmartHealthAI Hospital Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
            Track tokens, register patients, and manage OPD queues — private and government in one unified interface.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-md ring-1 ring-slate-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon   = tab.icon;
            const active = activeTab === tab.key;
            const hasNew = activeIncoming && urlTab === tab.key;
            return (
              <button key={tab.key} id={`tab-${tab.key}`} onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm whitespace-nowrap transition-all duration-200 ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                <Icon size={15} /> {tab.label}
                {hasNew && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-black text-white animate-pulse">1</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "patient" && (
          <PatientView queue={queue} departments={departments} loading={loading}
            incomingPatient={urlTab === "patient" ? activeIncoming : null} />
        )}
        {activeTab === "private" && (
          <PrivateHospitalView dashboard={dashboard}
            incomingPatient={urlTab === "private" ? activeIncoming : null} />
        )}
        {activeTab === "government" && (
          <GovernmentView queue={queue} departments={departments} stats={stats}
            onRefresh={loadData} loading={loading}
            incomingPatient={urlTab === "government" ? activeIncoming : null} />
        )}
      </section>
    </main>
  );
}
