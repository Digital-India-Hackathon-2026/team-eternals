import { FaArrowRight, FaHeartbeat, FaHospital, FaUserMd } from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div>

            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
              🚑 AI Powered Clinical Triage
            </span>

            <h1 className="text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
              Find the Right
              <br />
              Hospital Department
              <span className="text-blue-600">
                {" "}
                in Seconds
              </span>
            </h1>

            <p className="mt-6 text-xl text-slate-600 leading-9">
              SmartHealthAI analyzes symptoms using AI,
              recommends the correct department,
              prioritizes urgency and guides patients
              to the best nearby hospital.
            </p>

            <div className="flex gap-5 mt-10">

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl flex items-center gap-3">

                Start Analysis

                <FaArrowRight />

              </button>

              <button className="border border-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100">

                View Hospitals

              </button>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-14">

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <FaHospital className="text-blue-600 text-3xl mb-3" />

                <h2 className="text-3xl font-bold">
                  120+
                </h2>

                <p className="text-slate-500">
                  Hospitals
                </p>

              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <FaUserMd className="text-green-600 text-3xl mb-3" />

                <h2 className="text-3xl font-bold">
                  95%
                </h2>

                <p className="text-slate-500">
                  AI Accuracy
                </p>

              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <FaHeartbeat className="text-red-500 text-3xl mb-3" />

                <h2 className="text-3xl font-bold">
                  24/7
                </h2>

                <p className="text-slate-500">
                  Emergency
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                  Live Hospital Dashboard
                </h2>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  Live
                </span>

              </div>

              <div className="space-y-5 mt-8">

                {[
                  ["Apollo Hospitals", 12],
                  ["CARE Hospitals", 8],
                  ["Yashoda Hospitals", 21],
                  ["KIMS Hospitals", 6],
                ].map(([name, queue]) => (

                  <div
                    key={name}
                    className="flex justify-between items-center p-5 rounded-xl bg-slate-100"
                  >

                    <div>

                      <h3 className="font-bold">
                        {name}
                      </h3>

                      <p className="text-slate-500 text-sm">
                        Emergency Available
                      </p>

                    </div>

                    <div className="text-right">

                      <span className="text-green-600 font-bold">
                        Queue
                      </span>

                      <h2 className="text-2xl font-bold">
                        {queue}
                      </h2>

                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-8 bg-blue-600 rounded-xl p-6 text-white">

                <h3 className="font-bold text-xl">
                  Average Waiting Time
                </h3>

                <p className="text-5xl font-bold mt-2">
                  11 mins
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;