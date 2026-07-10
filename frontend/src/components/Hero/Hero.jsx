import {
  FaArrowRight,
  FaBrain,
  FaClock,
  FaHeartbeat,
  FaHospital,
  FaUserMd,
} from "react-icons/fa";

function Hero() {
  const stats = [
    {
      label: "Hospitals",
      value: "120+",
      icon: <FaHospital />,
      color: "text-teal-600 bg-teal-50 ring-teal-100",
    },
    {
      label: "Specialist Match",
      value: "95%",
      icon: <FaBrain />,
      color: "text-purple-600 bg-purple-50 ring-purple-100",
    },
    {
      label: "Emergency Support",
      value: "24/7",
      icon: <FaHeartbeat />,
      color: "text-emerald-600 bg-emerald-50 ring-emerald-100",
    },
    {
      label: "Fast Routing",
      value: "<15 min",
      icon: <FaClock />,
      color: "text-indigo-600 bg-indigo-50 ring-indigo-100",
    },
  ];

  const hospitals = [
    ["Apollo Hospitals", 12, "emerald"],
    ["CARE Hospitals", 8, "teal"],
    ["Yashoda Hospitals", 21, "amber"],
    ["KIMS Hospitals", 6, "emerald"],
  ];

  const scrollToAnalysis = () => {
    const target = document.getElementById("symptom-form") || document.querySelector("textarea");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const scrollToPatientJourney = (event) => {
    event.currentTarget
      .closest("section")
      ?.nextElementSibling
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-purple-100 shadow-lg backdrop-blur-xl">
              <FaBrain className="text-purple-300" />
              Fast Hospital Routing
            </span>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find the Right Hospital and Specialist Faster
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              SmartHealthAI helps patients choose the right specialist department, check hospital availability, and reach trusted Hyderabad hospitals faster when care is needed.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={scrollToAnalysis}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-1 hover:bg-indigo-400"
              >
                Find Care Now
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={scrollToPatientJourney}
                className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                View Process
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ring-1 ${stat.color}`}>
                    {stat.icon}
                  </div>

                  <h2 className="mt-4 text-3xl font-black text-white">
                    {stat.value}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-10 hidden h-24 w-24 rounded-full bg-purple-400/20 blur-2xl lg:block"></div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl sm:p-6">
              <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-700 ring-1 ring-purple-100">
                      <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                      Specialist Recommendation
                    </span>

                    <h2 className="mt-4 text-2xl font-black text-slate-950">
                      Hospital Availability Dashboard
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {hospitals.map(([name, queue, status]) => (
                    <div
                      key={name}
                      className="group flex items-center justify-between rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-teal-50/60"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                          <FaHospital />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-950">
                            {name}
                          </h3>

                          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
                            <span className={`h-2 w-2 rounded-full ${status === "amber" ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                            Emergency available
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Queue
                        </p>

                        <p className="text-2xl font-black text-slate-950">
                          {queue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-5 text-white shadow-lg shadow-teal-100">
                    <p className="text-sm font-bold uppercase tracking-wide text-teal-50">
                      Average Wait Time
                    </p>

                    <p className="mt-3 text-5xl font-black">
                      11m
                    </p>
                  </div>

                  <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-5 text-white shadow-lg shadow-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                        <FaUserMd />
                      </div>

                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-purple-100">
                          Routing Guidance
                        </p>

                        <p className="mt-1 font-bold leading-6">
                          Route chest pain cases to Cardiology first.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-teal-300 animate-pulse"></span>
                Monitoring hospital availability in real time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
