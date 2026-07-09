import {
  FaClock,
  FaUsers,
  FaCalendarCheck,
  FaBrain,
} from "react-icons/fa";

function WaitTimePrediction({ report }) {

  const queue = 18;
  const consultation = 10;
  const wait = queue * consultation;

  return (
    <section className="mt-16">

      <div className="text-center">

        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
          AI Queue Prediction
        </span>

        <h2 className="text-4xl font-bold mt-5">
          Predict Waiting Time Before Visiting
        </h2>

        <p className="text-slate-500 mt-3 text-lg">
          SmartHealthAI estimates waiting time using queue length,
          doctor availability and department workload.
        </p>

      </div>

      <div className="grid lg:grid-cols-4 gap-6 mt-12">

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <FaUsers className="text-4xl text-blue-600 mx-auto" />

          <h3 className="mt-5 text-slate-500">
            Current Queue
          </h3>

          <h1 className="text-5xl font-bold mt-3">
            {queue}
          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <FaClock className="text-4xl text-orange-500 mx-auto" />

          <h3 className="mt-5 text-slate-500">
            Avg Consultation
          </h3>

          <h1 className="text-5xl font-bold mt-3">
            {consultation}m
          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <FaClock className="text-4xl text-green-600 mx-auto" />

          <h3 className="mt-5 text-slate-500">
            Estimated Wait
          </h3>

          <h1 className="text-5xl font-bold mt-3">
            {wait}m
          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <FaCalendarCheck className="text-4xl text-purple-600 mx-auto" />

          <h3 className="mt-5 text-slate-500">
            Best Time
          </h3>

          <h1 className="text-3xl font-bold mt-4">
            4 PM
          </h1>

        </div>

      </div>

      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white">

        <div className="flex gap-5 items-center">

          <div className="bg-white/20 p-5 rounded-2xl">

            <FaBrain className="text-4xl" />

          </div>

          <div>

            <h2 className="text-3xl font-bold">

              AI Recommendation

            </h2>

            <p className="text-blue-100 mt-3 text-lg">

              Based on current hospital traffic,
              visiting after
              <span className="font-bold text-white">
                {" "}4 PM{" "}
              </span>
              can reduce waiting time by nearly
              <span className="font-bold text-white">
                {" "}35%.
              </span>

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WaitTimePrediction;