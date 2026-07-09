import {
  FaBrain,
  FaArrowTrendUp,
  FaHospital,
  FaUsers,
} from "react-icons/fa6";

function AIInsight() {
  return (
    <section className="mt-20">

      <div className="text-center">

        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
          AI Hospital Intelligence
        </span>

        <h2 className="text-5xl font-bold mt-6">
          AI Powered Operational Insights
        </h2>

        <p className="text-slate-500 mt-4 text-lg">
          SmartHealthAI continuously analyzes hospital activity
          to predict demand and reduce congestion.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-16">

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl">

          <FaBrain className="text-6xl" />

          <h2 className="text-3xl font-bold mt-6">
            AI Forecast
          </h2>

          <p className="mt-5 text-blue-100 leading-8">
            Cardiology patient inflow is expected to increase
            by <strong>18%</strong> during the next 30 minutes.
            Consider allocating one additional specialist.
          </p>

        </div>

        <div className="grid gap-6">

          <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5">

            <FaArrowTrendUp className="text-4xl text-green-600" />

            <div>

              <h3 className="font-bold text-xl">
                Peak Hours
              </h3>

              <p className="text-slate-500">
                10:00 AM - 1:00 PM
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5">

            <FaHospital className="text-4xl text-blue-600" />

            <div>

              <h3 className="font-bold text-xl">
                Busiest Department
              </h3>

              <p className="text-slate-500">
                Cardiology
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5">

            <FaUsers className="text-4xl text-orange-500" />

            <div>

              <h3 className="font-bold text-xl">
                Predicted Arrivals
              </h3>

              <p className="text-slate-500">
                34 Patients Next Hour
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AIInsight;