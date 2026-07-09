import {
  FaUsers,
  FaHeartbeat,
  FaUserMd,
  FaClock,
  FaArrowUp,
} from "react-icons/fa";

function HospitalDashboard() {
  return (
    <section className="mt-16">

      <div className="flex items-center justify-between mb-8">

        <div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            Live Hospital Analytics
          </span>

          <h2 className="text-4xl font-bold mt-4 text-slate-900">
            Hospital Operations Dashboard
          </h2>

        </div>

        <span className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold animate-pulse">
          LIVE
        </span>

      </div>

      {/* Statistics */}

      <div className="grid lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <FaUsers className="text-4xl text-blue-600" />

          <h3 className="mt-4 text-slate-500">
            Today's Patients
          </h3>

          <h1 className="text-5xl font-bold mt-2">
            148
          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <FaHeartbeat className="text-4xl text-red-500" />

          <h3 className="mt-4 text-slate-500">
            Emergency Cases
          </h3>

          <h1 className="text-5xl font-bold mt-2">
            18
          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <FaUserMd className="text-4xl text-green-600" />

          <h3 className="mt-4 text-slate-500">
            Doctors Available
          </h3>

          <h1 className="text-5xl font-bold mt-2">
            27
          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <FaClock className="text-4xl text-orange-500" />

          <h3 className="mt-4 text-slate-500">
            Avg Wait
          </h3>

          <h1 className="text-5xl font-bold mt-2">
            17m
          </h1>

        </div>

      </div>

      {/* AI Prediction */}

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex items-center gap-4">

          <div className="bg-white/20 p-4 rounded-2xl">

            <FaArrowUp className="text-3xl" />

          </div>

          <div>

            <h2 className="text-3xl font-bold">

              AI Demand Forecast

            </h2>

            <p className="text-blue-100 mt-2">

              Cardiology patient flow is expected to increase by
              <span className="font-bold text-white"> 18% </span>
              within the next 30 minutes.

            </p>

          </div>

        </div>

      </div>

      {/* Department Load */}

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-8">

          Department Load

        </h2>

        {[
          ["Cardiology", 90],
          ["Neurology", 65],
          ["Orthopedics", 55],
          ["Emergency", 95],
          ["General Medicine", 40],
        ].map(([dept, value]) => (

          <div key={dept} className="mb-6">

            <div className="flex justify-between mb-2">

              <span className="font-semibold">

                {dept}

              </span>

              <span>

                {value}%

              </span>

            </div>

            <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden">

              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${value}%` }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default HospitalDashboard;