function WaitTimePrediction({ report }) {
  const waitTime = report?.waitTime ?? report?.estimatedWaitTime ?? "25-30 min";
  const queueLength = report?.queueLength ?? report?.queue ?? "18 patients";
  const doctorsAvailable = report?.doctorsAvailable ?? report?.availableDoctors ?? "7";
  const averageConsultationTime =
    report?.averageConsultationTime ??
    report?.avgConsultationTime ??
    report?.consultationTime ??
    "9 min";
  const recommendedArrivalTime =
    report?.recommendedArrivalTime ??
    report?.bestVisitingTime ??
    report?.bestTime ??
    "Within 20 minutes";
  const queueCount = Number.parseInt(String(queueLength).replace(/[^0-9]/g, ""), 10);
  const computedQueueStatus = queueCount > 30 ? "High" : queueCount > 15 ? "Medium" : "Low";
  const queueStatus = report?.queueStatus ?? computedQueueStatus;
  const normalizedQueueStatus = String(queueStatus).toLowerCase();
  const currentStage = report?.queueStage ?? report?.currentStage ?? "Waiting";
  const waitingTimeExplanation =
    "Current waiting time is estimated based on patient volume and doctor availability.";
  const queueTone = normalizedQueueStatus.includes("high")
    ? {
        label: "🔴 Heavy",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "ring-red-100",
        dot: "bg-red-500",
        bar: "bg-red-500",
      }
    : normalizedQueueStatus.includes("medium") || normalizedQueueStatus.includes("moderate")
      ? {
          label: "🟡 Moderate",
          text: "text-amber-700",
          bg: "bg-amber-50",
          border: "ring-amber-100",
          dot: "bg-amber-500",
          bar: "bg-amber-500",
        }
      : {
          label: "🟢 Low",
          text: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "ring-emerald-100",
          dot: "bg-emerald-500",
          bar: "bg-emerald-500",
        };
  const recommendedAction = normalizedQueueStatus.includes("high")
    ? "Consider visiting after peak hours."
    : normalizedQueueStatus.includes("medium") || normalizedQueueStatus.includes("moderate")
      ? "Visit within the next hour."
      : "You can visit now.";
  const kpis = [
    {
      label: "Current Queue",
      value: queueLength,
      helper: "Patients currently waiting",
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "ring-amber-100",
    },
    {
      label: "Estimated Waiting Time",
      value: waitTime,
      helper: "Expected time before consultation",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "ring-blue-100",
    },
    {
      label: "Doctors Available",
      value: doctorsAvailable,
      helper: "Clinicians currently available",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "ring-emerald-100",
    },
    {
      label: "Consultation Speed",
      value: averageConsultationTime,
      helper: "Average time per patient",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "ring-blue-100",
    },
    {
      label: "Best Time to Visit",
      value: recommendedArrivalTime,
      helper: "Suggested arrival window",
      text: "text-purple-700",
      bg: "bg-purple-50",
      border: "ring-purple-100",
    },
  ];
  const timelineStages = ["Now", "Registration", "Waiting", "Doctor", "Completed"];

  return (
    <section className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-300/60">
      <div className="grid lg:grid-cols-[3fr_2fr]">
        <div className="relative overflow-hidden bg-white p-5 sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-100 blur-3xl"></div>
          <div className="absolute bottom-10 left-8 h-44 w-44 rounded-full bg-purple-100 blur-3xl"></div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
                Hospital Information
              </span>

              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${queueTone.bg} ${queueTone.text} ${queueTone.border}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${queueTone.dot}`}></span>
                {queueTone.label}
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Estimated Waiting Time
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  {waitingTimeExplanation}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-xl shadow-slate-200">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Estimated Waiting Time
                </p>
                <p className="mt-2 text-3xl font-black text-blue-300">
                  {waitTime}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className={`rounded-3xl p-5 ring-1 ${kpi.bg} ${kpi.border}`}
                >
                  <p className={`text-xs font-black uppercase tracking-[0.16em] ${kpi.text}`}>
                    {kpi.label}
                  </p>
                  <p className="mt-3 text-2xl font-black text-slate-950">
                    {kpi.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    {kpi.helper}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 shadow-lg shadow-purple-100/40">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                  Guidance
                </span>
                <h3 className="text-xl font-black text-slate-950">
                  Recommended Action
                </h3>
              </div>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {recommendedAction}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                {waitingTimeExplanation}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-5 sm:p-8 lg:p-10">
          <div className="flex h-full min-h-[520px] flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-slate-950/30">
            <div>
              <span className="inline-flex rounded-full bg-purple-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple-200 ring-1 ring-purple-300/20">
                Department Status
              </span>
              <h3 className="mt-5 text-3xl font-black tracking-tight text-white">
                Visit Flow
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The highlighted stage shows where patients are currently spending the most time during their visit.
              </p>
            </div>

            <div className="mt-8 flex-1 rounded-3xl bg-slate-900/80 p-5 ring-1 ring-white/10">
              <div className="flex h-full flex-col justify-between gap-3">
                {timelineStages.map((stage, index) => {
                  const isActive = stage.toLowerCase() === String(currentStage).toLowerCase();
                  const isLast = index === timelineStages.length - 1;

                  return (
                    <div key={stage} className="flex flex-1 gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black ring-1 ${
                            isActive
                              ? "bg-purple-500 text-white ring-purple-300 shadow-lg shadow-purple-500/30"
                              : "bg-slate-800 text-slate-300 ring-white/10"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {!isLast && (
                          <span
                            className={`mt-3 h-full min-h-8 w-1 rounded-full ${
                              isActive ? "bg-purple-400" : "bg-slate-700"
                            }`}
                          ></span>
                        )}
                      </div>

                      <div
                        className={`mb-3 flex-1 rounded-3xl p-4 ring-1 ${
                          isActive
                            ? "bg-purple-500/15 ring-purple-300/30"
                            : "bg-white/[0.03] ring-white/10"
                        }`}
                      >
                        <p className="text-lg font-black text-white">
                          {stage}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-400">
                          {isActive ? "Current stage" : "Visit checkpoint"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`mt-5 rounded-3xl p-5 ring-1 ${queueTone.bg} ${queueTone.border}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-sm font-black uppercase tracking-[0.16em] ${queueTone.text}`}>
                    Department Status
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {queueTone.label}
                  </p>
                </div>
                <span className={`h-14 w-14 rounded-2xl ${queueTone.bar}`}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WaitTimePrediction;
