function GovernmentHospitalPortal() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const tokenQueue = [
    {
      token: "A101",
      patient: "Ravi Kumar",
      department: "Cardiology",
      priority: "High",
      status: "Waiting",
    },
    {
      token: "A102",
      patient: "Priya",
      department: "Dermatology",
      priority: "Low",
      status: "In Consultation",
    },
    {
      token: "A103",
      patient: "Rahul",
      department: "Orthopedics",
      priority: "Medium",
      status: "Completed",
    },
    {
      token: "A104",
      patient: "Saira Begum",
      department: "General Medicine",
      priority: "Medium",
      status: "Waiting",
    },
  ];

  const stats = [
    { label: "Patients Registered Today", value: "148" },
    { label: "Waiting Patients", value: "36" },
    { label: "Completed Consultations", value: "92" },
    { label: "Emergency Cases", value: "11" },
  ];

  const departmentQueues = [
    { department: "Cardiology", queue: 14, wait: "28 min", status: "Busy" },
    { department: "Neurology", queue: 9, wait: "22 min", status: "Moderate" },
    { department: "Orthopedics", queue: 11, wait: "25 min", status: "Moderate" },
    { department: "General Medicine", queue: 18, wait: "35 min", status: "Busy" },
    { department: "Dermatology", queue: 5, wait: "12 min", status: "Available" },
  ];

  const notices = [
    "Doctor unavailable in ENT department from 2:00 PM to 4:00 PM.",
    "Emergency room currently busy. Direct non-critical cases to General Medicine.",
    "MRI machine under maintenance until 5:30 PM.",
  ];

  const badgeClass = (value) => {
    const normalized = String(value).toLowerCase();

    if (normalized.includes("high") || normalized.includes("busy")) {
      return "bg-red-50 text-red-700 ring-red-100";
    }

    if (normalized.includes("medium") || normalized.includes("moderate") || normalized.includes("waiting")) {
      return "bg-amber-50 text-amber-700 ring-amber-100";
    }

    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  };

  return (
    <section className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
                Government Hospital Portal
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Digital Reception & Patient Registration
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Reception dashboard for registering patients, issuing tokens, and monitoring department queues.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[34rem]">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Hospital Name
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  Government General Hospital
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Current Date
                </p>
                <p className="mt-2 text-lg font-black text-slate-950">
                  {currentDate}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Reception Status
                </p>
                <p className="mt-2 text-lg font-black text-emerald-800">
                  Open
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                  Today's Registrations
                </p>
                <p className="mt-2 text-lg font-black text-blue-800">
                  148
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <h2 className="text-2xl font-black text-slate-950">
              New Patient Registration
            </h2>

            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              {["Patient Name", "Age", "Mobile Number", "Aadhaar ID (optional)"].map((label) => (
                <label key={label} className="block">
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    placeholder={label}
                  />
                </label>
              ))}

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Gender</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50">
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Department</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50">
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Symptoms</span>
                <textarea
                  rows="4"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="Enter patient symptoms"
                ></textarea>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Priority</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <button
                type="button"
                className="self-end rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              >
                Register Patient
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <h2 className="text-2xl font-black text-slate-950">
              Live Token Queue
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      {['Token', 'Patient', 'Department', 'Priority', 'Status'].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-xs font-black uppercase tracking-[0.14em]">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {tokenQueue.map((row) => (
                      <tr key={row.token}>
                        <td className="px-4 py-4 font-black text-slate-950">{row.token}</td>
                        <td className="px-4 py-4 font-bold text-slate-700">{row.patient}</td>
                        <td className="px-4 py-4 font-bold text-slate-700">{row.department}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-sm font-black ring-1 ${badgeClass(row.priority)}`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-sm font-black ring-1 ${badgeClass(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <h2 className="text-2xl font-black text-slate-950">
            Reception Statistics
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <h2 className="text-2xl font-black text-slate-950">
              Department Queue
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {departmentQueues.map((item) => (
                <div key={item.department} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{item.department}</h3>
                      <p className="mt-2 text-sm font-semibold text-slate-500">
                        Queue Count: {item.queue}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Average Wait: {item.wait}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-black ring-1 ${badgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <h2 className="text-2xl font-black text-slate-950">
              Reception Notice Board
            </h2>
            <div className="mt-6 space-y-4">
              {notices.map((notice) => (
                <div key={notice} className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                  <p className="font-bold leading-7 text-blue-900">{notice}</p>
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
