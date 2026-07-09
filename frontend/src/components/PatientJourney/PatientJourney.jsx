import {
  FaUserInjured,
  FaRobot,
  FaHospital,
  FaClock,
  FaAmbulance,
} from "react-icons/fa";

function PatientJourney() {
  const steps = [
    {
      icon: <FaUserInjured />,
      title: "Enter Symptoms",
      desc: "Describe symptoms, age and severity.",
    },
    {
      icon: <FaRobot />,
      title: "AI Analysis",
      desc: "Gemini analyzes symptoms instantly.",
    },
    {
      icon: <FaHospital />,
      title: "Hospital Selection",
      desc: "Best department & nearby hospital.",
    },
    {
      icon: <FaClock />,
      title: "Wait Prediction",
      desc: "Know waiting time before visiting.",
    },
    {
      icon: <FaAmbulance />,
      title: "Emergency Support",
      desc: "Immediate ambulance guidance if needed.",
    },
  ];

  return (
    <section className="bg-white py-20">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            AI Powered Patient Journey
          </span>

          <h2 className="text-5xl font-bold mt-6 text-slate-900">
            How SmartHealthAI Works
          </h2>

          <p className="mt-5 text-xl text-slate-500 max-w-3xl mx-auto">
            From symptom assessment to treatment,
            AI guides patients through every stage
            while helping hospitals optimize resources.
          </p>

        </div>

        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 mt-16">

          {steps.map((step, index) => (

            <div
              key={index}
              className="relative bg-slate-50 rounded-3xl p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2"
            >

              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl mx-auto">

                {step.icon}

              </div>

              <h3 className="text-xl font-bold text-center mt-6">

                {step.title}

              </h3>

              <p className="text-slate-500 text-center mt-3 leading-7">

                {step.desc}

              </p>

              {index !== steps.length - 1 && (

                <div className="hidden lg:block absolute top-16 -right-8 w-16 border-t-4 border-dashed border-blue-300"></div>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default PatientJourney;