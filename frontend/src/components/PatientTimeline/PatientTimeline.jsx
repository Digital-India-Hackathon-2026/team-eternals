import {
  FaClipboardList,
  FaRobot,
  FaHospital,
  FaMapMarkerAlt,
  FaUserMd,
  FaCheckCircle,
} from "react-icons/fa";

function PatientTimeline() {
  const steps = [
    {
      icon: <FaClipboardList />,
      title: "Symptoms Submitted",
      desc: "Patient enters symptoms",
      completed: true,
    },
    {
      icon: <FaRobot />,
      title: "AI Analysis",
      desc: "Gemini analyzes symptoms",
      completed: true,
    },
    {
      icon: <FaHospital />,
      title: "Department Assigned",
      desc: "Correct department selected",
      completed: true,
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Hospital Recommended",
      desc: "Nearest suitable hospital",
      completed: true,
    },
    {
      icon: <FaUserMd />,
      title: "Consultation",
      desc: "Doctor examination",
      completed: false,
    },
  ];

  return (
    <section className="mt-16">

      <div className="text-center">

        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          Patient Journey Tracker
        </span>

        <h2 className="text-4xl font-bold mt-5">
          Track Your Healthcare Journey
        </h2>

        <p className="text-slate-500 mt-3 text-lg">
          Follow every stage from symptom analysis to treatment.
        </p>

      </div>

      <div className="mt-16 flex flex-col lg:flex-row justify-between items-center gap-8">

        {steps.map((step, index) => (

          <div
            key={index}
            className="flex flex-col items-center relative w-full"
          >

            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white shadow-lg
              ${
                step.completed
                  ? "bg-green-600"
                  : "bg-slate-300"
              }`}
            >
              {step.icon}
            </div>

            {index !== steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-[60%] w-full border-t-4 border-dashed border-blue-300"></div>
            )}

            <h3 className="font-bold text-xl mt-6 text-center">
              {step.title}
            </h3>

            <p className="text-slate-500 text-center mt-2">
              {step.desc}
            </p>

            {step.completed && (
              <div className="flex items-center gap-2 mt-4 text-green-600 font-semibold">
                <FaCheckCircle />
                Completed
              </div>
            )}

          </div>

        ))}

      </div>

    </section>
  );
}

export default PatientTimeline;