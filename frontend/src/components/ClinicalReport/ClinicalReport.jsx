import {
  FaHeartbeat,
  FaHospital,
  FaClock,
  FaBrain,
  FaExclamationTriangle,
  FaUserMd,
} from "react-icons/fa";

function ClinicalReport({ report }) {
  if (!report) return null;

  const priorityColor =
    report.priority === "High"
      ? "bg-red-100 text-red-700"
      : report.priority === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          🤖 AI Clinical Report
        </h2>

        <span className={`${priorityColor} px-4 py-2 rounded-full font-semibold`}>
          {report.priority} Priority
        </span>
      </div>

      <div className="space-y-6">
        {report.priority === "High" && (
  <div className="mb-6 rounded-xl bg-red-100 border border-red-300 p-4">
    <h3 className="font-bold text-red-700">
      🚨 Medical Emergency
    </h3>

    <p className="text-red-600 mt-2">
      Seek immediate medical attention. If symptoms are severe, call 108 or visit the nearest emergency department immediately.
    </p>
  </div>
)}
        {/* Department */}
        <div className="flex items-center justify-between border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <FaUserMd className="text-blue-600 text-xl" />
            <span className="font-semibold">Department</span>
          </div>

          <span className="font-bold text-slate-700">
            {report.department}
          </span>
        </div>

        {/* Hospital */}
        <div className="flex items-center justify-between border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <FaHospital className="text-green-600 text-xl" />
            <span className="font-semibold">Recommended Hospital</span>
          </div>

          <span className="font-bold text-right max-w-xs">
            {report.hospital}
          </span>
        </div>

        {/* Wait Time */}
        <div className="flex items-center justify-between border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <FaClock className="text-orange-500 text-xl" />
            <span className="font-semibold">Estimated Wait</span>
          </div>

          <span className="font-bold">
            {report.waitTime || "10-15 Minutes"}
          </span>
        </div>

        {/* AI Confidence */}
        <div className="border rounded-2xl p-5">

          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaBrain className="text-purple-600" />
              <span className="font-semibold">
                AI Confidence
              </span>
            </div>

            <span className="font-bold">
              {report.confidence}
            </span>

          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full w-full"></div>
          </div>

        </div>

        {/* Risk Level */}
        <div className="border rounded-2xl p-5">

          <div className="flex justify-between mb-3">

            <div className="flex items-center gap-2">

              <FaExclamationTriangle className="text-red-500" />

              <span className="font-semibold">
                Risk Level
              </span>

            </div>

            <span className="font-bold text-red-600">
              {report.priority}
            </span>

          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-full"></div>
          </div>

        </div>

        {/* Clinical Summary */}
        <div className="bg-slate-50 rounded-2xl p-6">

          <div className="flex items-center gap-2 mb-3">

            <FaHeartbeat className="text-red-500" />

            <h3 className="font-bold text-lg">
              Clinical Summary
            </h3>

          </div>

          <p className="text-slate-600 leading-8">
            {report.summary}
          </p>

        </div>

        {/* Recommended Tests */}
        <div className="bg-blue-50 rounded-2xl p-6">

          <h3 className="font-bold text-lg mb-4">
            Recommended Tests
          </h3>

          <div className="grid grid-cols-2 gap-3">

            {report.tests?.map((test, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-3 shadow"
              >
                {test}
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ClinicalReport;