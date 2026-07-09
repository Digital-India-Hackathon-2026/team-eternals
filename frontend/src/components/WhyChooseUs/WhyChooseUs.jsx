import {
  FaRobot,
  FaHospital,
  FaClock,
  FaAmbulance,
} from "react-icons/fa";

function WhyChooseUs() {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI Symptom Analysis",
      description:
        "Gemini AI analyzes symptoms and recommends the correct medical department with confidence scores.",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: <FaHospital />,
      title: "Smart Hospital Recommendation",
      description:
        "Suggests the most suitable hospital based on department, urgency and healthcare facilities.",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: <FaClock />,
      title: "Wait Time Prediction",
      description:
        "Predicts waiting time and recommends the best time to visit, reducing unnecessary hospital crowding.",
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      icon: <FaAmbulance />,
      title: "Emergency Assistance",
      description:
        "Detects critical cases instantly and recommends emergency care with ambulance support.",
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <section className="mt-24">

      <div className="text-center">

        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold">
          Why SmartHealthAI?
        </span>

        <h2 className="text-5xl font-bold mt-6 text-slate-900">
          One Platform.
          <br />
          Complete Patient Journey.
        </h2>

        <p className="mt-5 text-xl text-slate-500 max-w-3xl mx-auto">
          SmartHealthAI helps patients receive faster and smarter healthcare
          while helping hospitals improve efficiency using Artificial Intelligence.
        </p>

      </div>

      <div className="grid lg:grid-cols-4 gap-8 mt-16">

        {features.map((feature, index) => (

          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${feature.bg} ${feature.color}`}
            >
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold mt-6">
              {feature.title}
            </h3>

            <p className="text-slate-500 leading-8 mt-4">
              {feature.description}
            </p>

          </div>

        ))}

      </div>

      <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center">

        <h2 className="text-4xl font-bold">
          Transforming Healthcare with AI
        </h2>

        <p className="text-blue-100 text-xl mt-5 max-w-3xl mx-auto">
          From intelligent symptom analysis to hospital workflow optimization,
          SmartHealthAI enhances every stage of the healthcare experience for
          both patients and hospitals.
        </p>

      </div>

    </section>
  );
}

export default WhyChooseUs;