function AIInsight({ report }) {
  const recommendation =
    report?.aiRecommendation ??
    report?.recommendation ??
    "Seek timely clinical evaluation at the recommended hospital.";
  const primaryClinicalDecision =
    report?.primaryClinicalDecision ??
    report?.clinicalDecision ??
    "Prioritize assessment based on symptom severity and risk profile.";
  const recommendedDepartment =
    report?.recommendedDepartment ?? report?.department ?? "Emergency Medicine";
  const priorityLevel = report?.priorityLevel ?? report?.priority ?? "High";
  const confidenceScore = report?.confidenceScore ?? report?.confidence ?? "94%";
  const possibleCondition =
    report?.possibleCondition ?? report?.condition ?? "Acute cardiac pattern";
  const reasoningSummary =
    report?.reasoningSummary ??
    report?.reasoning ??
    "The recommendation combines symptom intensity, urgency indicators, department fit, hospital readiness, and expected wait time.";
  const currentAIStage = report?.currentAIStage ?? report?.aiStage ?? "Final Advice";
  const aiConfidenceExplanation =
    report?.aiConfidenceExplanation ??
    `The recommendation has ${confidenceScore} confidence because multiple symptoms strongly match emergency cardiac patterns.`;
  const normalizedPriority = String(priorityLevel).toLowerCase();
  const priorityTone = normalizedPriority.includes("high") || normalizedPriority.includes("critical")
    ? {
        label: "High Priority",
        text: "text-red-700",
        bg: "bg-red-50",
        ring: "ring-red-100",
        dot: "bg-red-500",
      }
    : normalizedPriority.includes("medium") || normalizedPriority.includes("moderate")
      ? {
          label: "Medium Priority",
          text: "text-amber-700",
          bg: "bg-amber-50",
          ring: "ring-amber-100",
          dot: "bg-amber-500",
        }
      : {
          label: "Safe Priority",
          text: "text-emerald-700",
          bg: "bg-emerald-50",
          ring: "ring-emerald-100",
          dot: "bg-emerald-500",
        };
  const decisionItems = [
    {
      label: "AI Recommendation",
      value: recommendation,
      tone: "text-purple-700 bg-purple-50 ring-purple-100",
    },
    {
      label: "Primary Clinical Decision",
      value: primaryClinicalDecision,
      tone: "text-blue-700 bg-blue-50 ring-blue-100",
    },
    {
      label: "Recommended Department",
      value: recommendedDepartment,
      tone: "text-blue-700 bg-blue-50 ring-blue-100",
    },
    {
      label: "Priority Level",
      value: priorityLevel,
      tone: `${priorityTone.text} ${priorityTone.bg} ${priorityTone.ring}`,
    },
    {
      label: "Confidence Score",
      value: confidenceScore,
      tone: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    },
    {
      label: "Possible Condition",
      value: possibleCondition,
      tone: "text-amber-700 bg-amber-50 ring-amber-100",
    },
  ];
  const processStages = [
    "Symptoms",
    "Risk Analysis",
    "Priority Classification",
    "Department Selection",
    "Hospital Recommendation",
    "Final Advice",
  ];

  return (
    <section className="mt-20 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-300/60">
      <div className="grid lg:grid-cols-[3fr_2fr]">
        <div className="relative overflow-hidden bg-white p-5 sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-purple-100 blur-3xl"></div>
          <div className="absolute bottom-10 left-8 h-44 w-44 rounded-full bg-blue-100 blur-3xl"></div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple-700 ring-1 ring-purple-100">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Executive AI Decision Panel
              </span>

              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${priorityTone.bg} ${priorityTone.text} ${priorityTone.ring}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${priorityTone.dot}`}></span>
                {priorityTone.label}
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  AI Recommendation
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  A clinical decision summary that turns symptom analysis, risk signals, and hospital intelligence into a clear next action.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-xl shadow-slate-200">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Confidence
                </p>
                <p className="mt-2 text-3xl font-black text-emerald-300">
                  {confidenceScore}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {decisionItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200"
                >
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ring-1 ${item.tone}`}>
                    {item.label}
                  </span>
                  <p className="mt-4 text-xl font-black leading-7 text-slate-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 shadow-lg shadow-blue-100/40">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                  Reasoning Summary
                </span>
              </div>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {reasoningSummary}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-5 sm:p-8 lg:p-10">
          <div className="flex h-full min-h-[600px] flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-slate-950/30">
            <div>
              <span className="inline-flex rounded-full bg-purple-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple-200 ring-1 ring-purple-300/20">
                AI Decision Process
              </span>
              <h3 className="mt-5 text-3xl font-black tracking-tight text-white">
                Decision Flow
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The active stage shows where the AI decision engine is focused in the care-routing process.
              </p>
            </div>

            <div className="mt-8 flex-1 rounded-3xl bg-slate-900/80 p-5 ring-1 ring-white/10">
              <div className="flex h-full flex-col justify-between gap-3">
                {processStages.map((stage, index) => {
                  const isActive = stage.toLowerCase() === String(currentAIStage).toLowerCase();
                  const isLast = index === processStages.length - 1;

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
                          {isActive ? "Current AI stage" : "Decision checkpoint"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-100 p-5 sm:p-8 lg:p-10">
        <div className="rounded-[1.75rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-emerald-50 p-6 shadow-lg shadow-purple-100/40 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <span className="w-fit rounded-full bg-purple-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
              AI Confidence Explanation
            </span>
            <p className="text-lg font-semibold leading-8 text-slate-700 lg:max-w-4xl">
              {aiConfidenceExplanation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIInsight;
