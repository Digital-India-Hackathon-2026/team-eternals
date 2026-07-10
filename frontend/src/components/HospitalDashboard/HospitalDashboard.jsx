function HospitalDashboard({ report }) {
  const hospitalName = report?.hospitalName ?? report?.hospital ?? "SmartHealth City Hospital";
  const hospitalStatus = report?.hospitalStatus ?? "Operational";
  const currentPatients = report?.currentPatients ?? "126";
  const doctorsOnDuty = report?.doctorsOnDuty ?? report?.doctorsAvailable ?? "32";
  const departmentsActive = report?.departmentsActive ?? "12";
  const emergencyStatus = report?.emergencyStatus ?? "Available";
  const patientsToday = report?.patientsToday ?? "184";
  const activeQueue = report?.activeQueue ?? report?.queueLength ?? "27";
  const doctorsAvailable = report?.doctorsAvailable ?? doctorsOnDuty;
  const emergencyBeds = report?.emergencyBeds ?? report?.bedsAvailable ?? "8";
  const icuBeds = report?.icuBeds ?? "6";
  const averageWaitingTime = report?.averageWaitingTime ?? report?.waitTime ?? "22 min";
  const operationalSummary =
    report?.operationalSummary ??
    report?.aiHospitalInsight ??
    "Patient flow is stable. Emergency department has moderate traffic while Cardiology is currently experiencing higher patient volume.";
  const departmentRows = report?.departmentStatus ??
    report?.departments ?? [
      { department: "Cardiology", doctors: 6, patientsWaiting: 14, status: "Busy" },
      { department: "Emergency", doctors: 8, patientsWaiting: 3, status: "Available" },
      { department: "Neurology", doctors: 4, patientsWaiting: 9, status: "Moderate" },
      { department: "Orthopedics", doctors: 5, patientsWaiting: 6, status: "Available" },
      { department: "Dermatology", doctors: 3, patientsWaiting: 12, status: "Busy" },
    ];
  const overviewItems = [
    { label: "Hospital Status", value: hospitalStatus, tone: "blue" },
    { label: "Current Patients", value: currentPatients, tone: "amber" },
    { label: "Doctors On Duty", value: doctorsOnDuty, tone: "green" },
    { label: "Departments Active", value: departmentsActive, tone: "blue" },
    { label: "Emergency Status", value: emergencyStatus, tone: "red" },
  ];
  const operationKpis = [
    {
      label: "Patients Today",
      value: patientsToday,
      detail: "Total registered visits",
      classes: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      label: "Active Queue",
      value: activeQueue,
      detail: "Patients waiting now",
      classes: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      label: "Doctors On Duty",
      value: doctorsAvailable,
      detail: "Clinical staff currently active",
      classes: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Emergency Beds",
      value: emergencyBeds,
      detail: "Immediate intake capacity",
      classes: "bg-red-50 text-red-700 ring-red-100",
    },
    {
      label: "ICU Beds",
      value: icuBeds,
      detail: "Critical care capacity",
      classes: "bg-red-50 text-red-700 ring-red-100",
    },
    {
      label: "Average Waiting Time",
      value: averageWaitingTime,
      detail: "Current hospital average",
      classes: "bg-blue-50 text-blue-700 ring-blue-100",
    },
  ];
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
  };
  const getStatusClasses = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (
      normalizedStatus.includes("available") ||
      normalizedStatus.includes("open") ||
      normalizedStatus.includes("low")
    ) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    }

    if (
      normalizedStatus.includes("moderate") ||
      normalizedStatus.includes("medium")
    ) {
      return "bg-amber-50 text-amber-700 ring-amber-100";
    }

    return "bg-red-50 text-red-700 ring-red-100";
  };
  const getStatusLabel = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (
      normalizedStatus.includes("available") ||
      normalizedStatus.includes("open") ||
      normalizedStatus.includes("low")
    ) {
      return "🟢 Available";
    }

    if (
      normalizedStatus.includes("moderate") ||
      normalizedStatus.includes("medium")
    ) {
      return "🟡 Moderate";
    }

    return "🔴 Busy";
  };

  return (
    <section className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-300/60">
      <div className="bg-slate-100 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
              Today's Operations
            </span>
            <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Hospital Resources
            </h3>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-6 text-slate-600">
            Key operational metrics for patient volume, queue load, staffing, beds, and waiting time.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {operationKpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    {kpi.label}
                  </p>
                  <p className="mt-3 text-4xl font-black text-slate-950">
                    {kpi.value}
                  </p>
                </div>
                <span className={`rounded-2xl px-3 py-2 text-xs font-black ring-1 ${kpi.classes}`}>
                  Live
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                {kpi.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700 ring-1 ring-slate-200">
              Department Status
            </span>
            <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Live Department Status
            </h3>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
            Updated live
          </span>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em]">
                    Department
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em]">
                    Doctors
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em]">
                    Patients Waiting
                  </th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {departmentRows.map((row) => {
                  const department = row.department ?? row.name ?? "Department";
                  const doctors = row.doctors ?? row.doctorsAvailable ?? "0";
                  const patientsWaiting = row.patientsWaiting ?? row.waiting ?? row.queue ?? "0";
                  const status = row.status ?? "Available";

                  return (
                    <tr key={department} className="transition hover:bg-slate-50">
                      <td className="px-5 py-5 text-base font-black text-slate-950">
                        {department}
                      </td>
                      <td className="px-5 py-5 text-base font-bold text-slate-700">
                        {doctors}
                      </td>
                      <td className="px-5 py-5 text-base font-bold text-slate-700">
                        {patientsWaiting}
                      </td>
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-black ring-1 ${getStatusClasses(status)}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 shadow-lg shadow-purple-100/40 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <span className="w-fit rounded-full bg-purple-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
              Operational Summary
            </span>
            <p className="text-lg font-semibold leading-8 text-slate-700 lg:max-w-4xl">
              {operationalSummary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HospitalDashboard;
