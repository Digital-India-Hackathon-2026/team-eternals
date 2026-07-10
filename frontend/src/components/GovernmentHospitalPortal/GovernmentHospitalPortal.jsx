import { useState, useEffect, useCallback } from "react";
import {
  registerPatient,
  fetchQueue,
  fetchDepartments,
  fetchReceptionStats,
} from "../../lib/api";

function GovernmentHospitalPortal() {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    mobileNumber: "",
    aadhaarId: "",
    gender: "",
    department: "General Medicine",
    symptoms: "",
    priority: "Low",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [latestToken, setLatestToken] = useState(null);

  // Live data from backend
  const [tokenQueue, setTokenQueue] = useState([]);
  const [departmentQueues, setDepartmentQueues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ── Fetch live data from backend ──
  const loadLiveData = useCallback(async () => {
    try {
      const [queue, depts, receptionStats] = await Promise.all([
        fetchQueue(),
        fetchDepartments(),
        fetchReceptionStats(),
      ]);
      setTokenQueue(queue);
      setDepartmentQueues(depts);
      setStats([
        { label: "Patients Registered Today", value: String(receptionStats.patientsRegisteredToday) },
        { label: "Waiting Patients", value: String(receptionStats.waitingPatients) },
        { label: "Completed Consultations", value: String(receptionStats.completedConsultations) },
        { label: "Emergency Cases", value: String(receptionStats.emergencyCases) },
      ]);
    } catch {
      // Fallback to local defaults if backend unreachable
      setStats([
        { label: "Patients Registered Today", value: "148" },
        { label: "Waiting Patients", value: "36" },
        { label: "Completed Consultations", value: "92" },
        { label: "Emergency Cases", value: "11" },
      ]);
      setTokenQueue([
        { token: "A101", patient: "Ravi Kumar", department: "Cardiology", priority: "High", status: "Waiting" },
        { token: "A102", patient: "Priya Sharma", department: "Dermatology", priority: "Low", status: "In Consultation" },
        { token: "A103", patient: "Rahul Mehta", department: "Orthopedics", priority: "Medium", status: "Completed" },
        { token: "A104", patient: "Saira Begum", department: "General Medicine", priority: "Medium", status: "Waiting" },
      ]);
      setDepartmentQueues([
        { department: "Cardiology", queue: 14, wait: "28 min", status: "Busy" },
        { department: "Neurology", queue: 9, wait: "22 min", status: "Moderate" },
        { department: "Orthopedics", queue: 11, wait: "25 min", status: "Moderate" },
        { department: "General Medicine", queue: 18, wait: "35 min", status: "Busy" },
        { department: "Dermatology", queue: 5, wait: "12 min", status: "Available" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  const notices = [
    "Doctor unavailable in ENT department from 2:00 PM to 4:00 PM.",
    "Emergency room currently busy. Direct non-critical cases to General Medicine.",
    "MRI machine under maintenance until 5:30 PM.",
  ];

  const badgeClass = (value) => {
    const normalized = String(value).toLowerCase();
    if (normalized.includes("high") || normalized.includes("busy"))
      return "bg-red-50 text-red-700 ring-1 ring-red-100";
    if (normalized.includes("medium") || normalized.includes("moderate") || normalized.includes("waiting"))
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const data = await registerPatient({
        patientName: formData.patientName,
        age: formData.age,
        mobile: formData.mobileNumber,
        gender: formData.gender,
        department: formData.department,
        symptoms: formData.symptoms,
        priority: formData.priority,
      });

      const tokenNumber = data.tokenNumber || data.token;
      const estimatedWaitingTime = data.estimatedWaitingTime || "25 min";

      setLatestToken({ token: tokenNumber, estimatedWaitingTime });
      setSuccessMessage(`Patient registered successfully. Token ${tokenNumber} assigned.`);

      // Refresh live data from backend
      await loadLiveData();

      setFormData({
        patientName: "",
        age: "",
        mobileNumber: "",
        aadhaarId: "",
        gender: "",
        department: "General Medicine",
        symptoms: "",
        priority: "Low",
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to register patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Skeleton loader ──
  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="skeleton h-10 w-48 mx-auto mb-4" />
          <div className="skeleton h-6 w-64 mx-auto mb-2" />
          <div className="skeleton h-6 w-56 mx-auto" />
          <p className="mt-6 text-sm font-semibold text-slate-500 animate-pulse">
            Loading hospital data…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Dashboard Header ── */}
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 animate-fade-in-up">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="badge badge-blue">Government Hospital Portal</span>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Digital Reception &amp; Patient Registration
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Register patients, issue tokens, and monitor live department queues.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[34rem]">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Hospital</p>
                <p className="mt-2 text-lg font-black text-slate-950">Government General Hospital</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Date</p>
                <p className="mt-2 text-lg font-black text-slate-950">{currentDate}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Reception</p>
                <p className="mt-2 text-lg font-black text-emerald-800">● Open</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="text-xs font-black uppercase tracking-wider text-blue-700">Today's Registrations</p>
                <p className="mt-2 text-lg font-black text-blue-800">{stats?.[0]?.value}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Registration Form + Live Queue ── */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">

          {/* Registration Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            <h2 className="text-2xl font-black text-slate-950">New Patient Registration</h2>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handlePatientRegistration} id="patient-registration-form">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Patient Name *</span>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="Full name"
                  required
                  id="field-patient-name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Age *</span>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="Age"
                  required
                  id="field-age"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Mobile Number</span>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="10-digit number"
                  id="field-mobile"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Aadhaar ID <span className="text-slate-400 font-normal">(optional)</span></span>
                <input
                  type="text"
                  name="aadhaarId"
                  value={formData.aadhaarId}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="XXXX XXXX XXXX"
                  id="field-aadhaar"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Gender *</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  required
                  id="field-gender"
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Department</span>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  id="field-department"
                >
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Symptoms *</span>
                <textarea
                  rows="4"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="Describe patient's symptoms"
                  required
                  id="field-symptoms"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Priority Level</span>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  id="field-priority"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-register-patient"
                className="self-end rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Registering…" : "Register Patient"}
              </button>

              {(successMessage || errorMessage) && (
                <div
                  className={`rounded-2xl p-4 text-sm font-bold ring-1 sm:col-span-2 animate-fade-in ${
                    successMessage
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                      : "bg-red-50 text-red-700 ring-red-100"
                  }`}
                >
                  {successMessage || errorMessage}
                </div>
              )}
            </form>
          </section>

          {/* Live Token Queue */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
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

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left" id="token-queue-table">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      {["Token", "Patient", "Department", "Priority", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {tokenQueue.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-semibold">
                          No patients in queue
                        </td>
                      </tr>
                    ) : (
                      tokenQueue.map((row) => (
                        <tr key={row.token} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-4 font-black text-slate-950">{row.token}</td>
                          <td className="px-4 py-4 font-bold text-slate-700">{row.patient}</td>
                          <td className="px-4 py-4 font-bold text-slate-700">{row.department}</td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-black ${badgeClass(row.priority)}`}>
                              {row.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-black ${badgeClass(row.status)}`}>
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
          </section>
        </div>

        {/* ── Reception Statistics ── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <h2 className="text-2xl font-black text-slate-950">Reception Statistics</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats?.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Department Queue + Notice Board ── */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 animate-fade-in-up" style={{ animationDelay: "320ms" }}>
            <h2 className="text-2xl font-black text-slate-950">Department Queue Status</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {departmentQueues.map((item) => (
                <div key={item.department} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{item.department}</h3>
                      <p className="mt-2 text-sm font-semibold text-slate-500">Queue: <strong className="text-slate-700">{item.queue}</strong> patients</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">Wait: <strong className="text-slate-700">{item.wait}</strong></p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${badgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <h2 className="text-2xl font-black text-slate-950">Notice Board</h2>
            <div className="mt-6 space-y-4">
              {notices.map((notice) => (
                <div key={notice} className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                  <p className="font-semibold leading-6 text-amber-900 text-sm">⚠ {notice}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </section>
  );
}

export default GovernmentHospitalPortal;
