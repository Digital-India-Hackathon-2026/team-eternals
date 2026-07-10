import { FaAmbulance, FaHospitalAlt, FaChartLine, FaRobot, FaProjectDiagram, FaHeartbeat } from "react-icons/fa";

export default function About() {
  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
            About SmartHealthAI
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Connecting Patients, Hospitals, and Emergency Services
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 font-medium">
            India's healthcare system is evolving, but critical gaps still remain. We are building the intelligent layer that coordinates care when every second matters.
          </p>
        </div>
      </section>

      {/* The Challenges Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Three Major Challenges
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Challenge 1 */}
          <div className="group relative rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/50">
            <div className="absolute -inset-px rounded-3xl border-2 border-transparent opacity-0 transition-opacity group-hover:border-blue-500 group-hover:opacity-100"></div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100 mb-6 transition-transform group-hover:scale-110">
              <FaAmbulance size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-4">Emergency Delays</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              During emergencies, patients often don't know which hospital has the right specialist, available beds, or the shortest waiting time, causing critical delays.
            </p>
          </div>

          {/* Challenge 2 */}
          <div className="group relative rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/50">
            <div className="absolute -inset-px rounded-3xl border-2 border-transparent opacity-0 transition-opacity group-hover:border-blue-500 group-hover:opacity-100"></div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 mb-6 transition-transform group-hover:scale-110">
              <FaHospitalAlt size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-4">Government Hospitals</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Government hospitals still struggle with manual registration, long queues, and inefficient patient management, leading to overcrowding and fatigue.
            </p>
          </div>

          {/* Challenge 3 */}
          <div className="group relative rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/50">
            <div className="absolute -inset-px rounded-3xl border-2 border-transparent opacity-0 transition-opacity group-hover:border-blue-500 group-hover:opacity-100"></div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100 mb-6 transition-transform group-hover:scale-110">
              <FaChartLine size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-950 mb-4">Private Hospitals</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Private hospitals lack a unified real-time operational dashboard for monitoring appointments, bed availability, emergency cases, and hospital resources.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-16 shadow-2xl sm:px-16 sm:py-20 lg:flex lg:items-center lg:gap-x-12">
          {/* Background Gradients */}
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>

          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              The Solution: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                SmartHealthAI
              </span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300 font-medium">
              To address these challenges, we built SmartHealthAI—an AI-powered healthcare coordination platform. Our goal is to reduce delays, improve patient flow, and connect patients, hospitals, and emergency services through one intelligent platform.
            </p>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0 relative z-10 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/10">
              <FaRobot className="text-blue-400 text-2xl" />
              <h4 className="font-bold text-white">AI Symptom Analysis</h4>
              <p className="text-sm text-slate-400">Analyzes patient symptoms and prioritizes emergencies instantly.</p>
            </div>
            
            <div className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/10">
              <FaProjectDiagram className="text-indigo-400 text-2xl" />
              <h4 className="font-bold text-white">Smart Routing</h4>
              <p className="text-sm text-slate-400">Recommends the most suitable hospital & assists ambulance routing.</p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/10">
              <FaHeartbeat className="text-emerald-400 text-2xl" />
              <h4 className="font-bold text-white">Digital Government Queue</h4>
              <p className="text-sm text-slate-400">Provides a digital reception and token management system.</p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md transition-colors hover:bg-white/10">
              <FaChartLine className="text-purple-400 text-2xl" />
              <h4 className="font-bold text-white">Private Dashboards</h4>
              <p className="text-sm text-slate-400">Offers a real-time private hospital operations monitoring dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
