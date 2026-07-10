import {
  FaUserInjured,
  FaBrain,
  FaHospital,
  FaRoute,
  FaUserMd,
  FaStethoscope,
  FaClipboardCheck,
} from "react-icons/fa";

function PatientJourney() {
  const steps = [
    {
      icon: <FaUserInjured />,
      title: "Patient Information",
      desc: "Share symptoms, age and severity.",
      state: "completed",
      color: "bg-emerald-500 text-white shadow-emerald-200 ring-emerald-100",
    },
    {
      icon: <FaBrain />,
      title: "Clinical Assessment",
      desc: "AI evaluates urgency and risk.",
      state: "current",
      color: "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-purple-200 ring-purple-100",
    },
    {
      icon: <FaStethoscope />,
      title: "Recommended Department",
      desc: "Routes to the right specialty.",
      state: "future",
      color: "bg-slate-100 text-slate-500 shadow-slate-100 ring-slate-200",
    },
    {
      icon: <FaHospital />,
      title: "Recommended Hospital",
      desc: "Finds available care teams.",
      state: "future",
      color: "bg-slate-100 text-slate-500 shadow-slate-100 ring-slate-200",
    },
    {
      icon: <FaRoute />,
      title: "Navigation & Check-in",
      desc: "Guides arrival and intake.",
      state: "future",
      color: "bg-slate-100 text-slate-500 shadow-slate-100 ring-slate-200",
    },
    {
      icon: <FaUserMd />,
      title: "Consultation & Treatment",
      desc: "Continue care with clinicians.",
      state: "future",
      color: "bg-slate-100 text-slate-500 shadow-slate-100 ring-slate-200",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20">
      <div className="absolute left-8 top-12 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl"></div>
      <div className="absolute bottom-0 right-8 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
            <FaBrain />
            AI Patient Journey
          </span>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Your Smart Healthcare Journey
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            From symptom analysis to treatment, SmartHealthAI guides every step.
          </p>
        </div>

        <div className="mt-16 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="relative grid gap-6 lg:grid-cols-6 lg:gap-4">
            <div className="absolute left-8 top-0 hidden h-full w-1 rounded-full bg-gradient-to-b from-emerald-400 via-indigo-500 to-slate-200 sm:left-10 lg:left-0 lg:top-10 lg:block lg:h-1 lg:w-full lg:bg-gradient-to-r"></div>

            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex gap-5 rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl lg:flex-col lg:items-center lg:text-center"
              >
                {index !== steps.length - 1 && (
                  <div className="absolute left-8 top-20 h-[calc(100%+1.5rem)] w-1 rounded-full bg-gradient-to-b from-emerald-400 via-indigo-500 to-slate-200 sm:left-10 lg:hidden"></div>
                )}

                <div className="relative z-10">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-xl ring-4 ${step.color} ${step.state === "current" ? "animate-pulse" : ""}`}>
                    {step.icon}
                  </div>

                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-slate-700 shadow-md ring-1 ring-slate-100">
                    {index + 1}
                  </span>
                </div>

                <div className="relative z-10">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      step.state === "completed"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : step.state === "current"
                        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-100"
                        : "bg-slate-50 text-slate-500 ring-1 ring-slate-100"
                    }`}
                  >
                    {step.state === "completed" ? "Completed" : step.state === "current" ? "Current AI Step" : "Upcoming"}
                  </span>

                  <h3 className="mt-3 text-xl font-extrabold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-600 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/25">
              <FaClipboardCheck />
            </div>

            <p className="text-lg font-semibold leading-8 text-indigo-50">
              SmartHealthAI continuously analyzes your symptoms, hospital availability, waiting time and emergency priority to guide you through the fastest treatment path.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatientJourney;
