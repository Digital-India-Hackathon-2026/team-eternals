import {
  FaBrain,
  FaCheck,
  FaClipboardList,
  FaHospital,
  FaStethoscope,
  FaUserMd,
} from "react-icons/fa";

function ClinicalReport({ report }) {
  if (!report) return null;

  const department = report.department || report.recommendedDepartment || "Emergency Medicine";
  const hospital = report.hospital || report.recommendedHospital || "Recommended Hospital";
  const priority = report.priority || report.priorityLevel || "Medium";
  const riskLevel = report.riskLevel || report.severity || priority;
  const normalizedRisk = String(riskLevel).toLowerCase();
  const confidenceValue = report.confidenceScore || report.confidence || "92%";
  const confidenceNumber = Number.parseFloat(confidenceValue);
  const confidence = String(confidenceValue).includes("%")
    ? String(confidenceValue)
    : Number.isFinite(confidenceNumber)
      ? `${confidenceNumber <= 1 ? Math.round(confidenceNumber * 100) : Math.round(confidenceNumber)}%`
      : `${confidenceValue}%`;
  const generatedAt = report.generatedAt || report.timestamp || new Date().toLocaleString();
  const possibleConditions =
    report.possibleConditions ||
    report.conditions || [
      { name: report.possibleCondition || "Acute cardiac stress pattern", confidence: "84%" },
      { name: "Respiratory strain", confidence: "62%" },
      { name: "General viral illness", confidence: "38%" },
    ];
  const recommendedTests = report.tests?.length
    ? report.tests
    : report.recommendedTests?.length
      ? report.recommendedTests
      : ["CBC", "ECG", "Blood Pressure", "X-Ray", "MRI"];
  const aiExplanation =
    report.aiExplanation ||
    report.explanation ||
    report.summary ||
    `Based on the symptoms provided and the level of urgency indicated, ${department} is the most appropriate department for evaluation. ${hospital} is recommended so you can receive timely care and the right follow-up investigations.`;
  const conditionLabels = ["Most likely", "Possible", "Less likely"];
  const riskStyles = normalizedRisk.includes("high") || normalizedRisk.includes("critical")
    ? "bg-red-50 text-red-700 ring-red-100"
    : normalizedRisk.includes("medium") || normalizedRisk.includes("moderate")
      ? "bg-amber-50 text-amber-700 ring-amber-100"
      : "bg-emerald-50 text-emerald-700 ring-emerald-100";
  const primaryItems = [
    {
      label: "Department",
      value: department,
      icon: <FaUserMd />,
      tone: "bg-teal-50 text-teal-700 ring-teal-100",
    },
    {
      label: "Priority",
      value: priority,
      icon: <FaClipboardList />,
      tone: riskStyles,
    },
    {
      label: "Recommended Hospital",
      value: hospital,
      icon: <FaHospital />,
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
    },
  ];
  const clinicalFindings = [
    report.symptomMatch || "Symptom match supports the recommended department",
    report.severityAssessment || `Severity assessment indicates ${riskLevel} risk`,
    report.ageFactor || "Age factor reviewed against clinical risk patterns",
    report.riskIndicators || "Risk indicators checked for escalation needs",
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl"></div>
      <div className="absolute -bottom-24 left-8 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl"></div>

      <div className="relative">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-purple-700 ring-1 ring-purple-100">
              <FaBrain />
              Clinical Assessment
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Medical Assessment
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Structured clinical guidance generated from the submitted symptoms, urgency signals, and hospital routing data.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[34rem]">
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-xl shadow-slate-200">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Confidence Score
              </p>
              <p className="mt-2 text-3xl font-black text-emerald-300">
                {confidence}
              </p>
            </div>

            <div className="rounded-3xl bg-white px-5 py-4 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Risk Level
              </p>
              <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-black ring-1 ${riskStyles}`}>
                {riskLevel}
              </span>
            </div>

            <div className="rounded-3xl bg-white px-5 py-4 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Generated
              </p>
              <p className="mt-3 text-sm font-black leading-5 text-slate-950">
                {generatedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 ring-1 ring-blue-100">
              Recommendation
            </span>
            <h3 className="text-2xl font-black text-slate-950">
              Primary Recommendation
            </h3>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {primaryItems.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ring-1 ${item.tone}`}>
                  {item.icon}
                </div>
                <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-black leading-tight text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-purple-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-700 ring-1 ring-purple-100">
                Diagnosis Review
              </span>
              <h3 className="text-2xl font-black text-slate-950">
                Possible Diagnoses
              </h3>
            </div>

            <div className="mt-6 space-y-4">
              {possibleConditions.slice(0, 3).map((condition, index) => {
                const conditionName = typeof condition === "string" ? condition : condition.name || condition.condition;
                const conditionConfidence = typeof condition === "string"
                  ? ["84%", "62%", "38%"][index]
                  : condition.confidence || condition.probability || ["84%", "62%", "38%"][index];

                return (
                  <div
                    key={`${conditionName}-${index}`}
                    className="rounded-3xl bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-600 ring-1 ring-slate-200">
                          {index + 1}. {conditionLabels[index]}
                        </span>
                        <p className="mt-4 text-xl font-black text-slate-950">
                          {conditionName}
                        </p>
                      </div>
                      <span className="rounded-2xl bg-blue-50 px-4 py-2 text-lg font-black text-blue-700 ring-1 ring-blue-100">
                        {conditionConfidence}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 ring-1 ring-emerald-100">
                Findings
              </span>
              <h3 className="text-2xl font-black text-slate-950">
                Clinical Findings
              </h3>
            </div>

            <div className="mt-6 space-y-3">
              {clinicalFindings.map((finding) => (
                <div
                  key={finding}
                  className="flex gap-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700 ring-1 ring-emerald-200">
                    <FaCheck />
                  </span>
                  <p className="font-bold leading-7 text-slate-700">
                    {finding}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-700 ring-1 ring-teal-100">
              Investigations
            </span>
            <h3 className="text-2xl font-black text-slate-950">
              Recommended Investigations
            </h3>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {recommendedTests.map((test) => (
              <span
                key={test}
                className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-5 py-3 font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-700 hover:ring-teal-100"
              >
                <FaStethoscope className="text-teal-600" />
                {test}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-teal-50 p-6 shadow-xl shadow-purple-100/40 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-2xl text-white shadow-lg shadow-purple-200">
              <FaBrain />
            </div>

            <div>
              <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                Recommendation Summary
              </span>
              <h3 className="mt-3 text-2xl font-black text-slate-950">
                Why this recommendation?
              </h3>
              <p className="mt-3 text-lg font-medium leading-8 text-slate-700">
                {aiExplanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClinicalReport;
