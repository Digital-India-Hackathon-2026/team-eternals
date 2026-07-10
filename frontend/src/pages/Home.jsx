import { Link } from "react-router-dom";
import {
  FaBrain,
  FaHospital,
  FaClock,
  FaShieldAlt,
  FaChartLine,
  FaArrowRight,
  FaHeartbeat,
  FaCheckCircle,
  FaUserMd,
  FaTicketAlt,
} from "react-icons/fa";

const features = [
  {
    icon: FaBrain,
    color: "bg-purple-600",
    title: "AI Symptom Triage",
    description:
      "Enter your symptoms and our Gemini-powered AI instantly recommends the right department, nearest hospital, and predicted wait time.",
    link: "/patient",
    cta: "Try Patient Portal",
  },
  {
    icon: FaTicketAlt,
    color: "bg-blue-600",
    title: "Token & Queue Tracker",
    description:
      "Check your live token status, estimated wait time, and which patient is currently being seen — all in real time from your phone.",
    link: "/patient",
    cta: "Track My Token",
  },
  {
    icon: FaHospital,
    color: "bg-emerald-600",
    title: "Hospital Dashboard",
    description:
      "Unified operations view for both private and government hospitals — register patients, issue tokens, monitor queues and bed availability.",
    link: "/hospital",
    cta: "Open Dashboard",
  },
  {
    icon: FaClock,
    color: "bg-amber-500",
    title: "Wait Time Prediction",
    description:
      "SmartHealthAI calculates queue lengths and waiting times before you even leave home, so you can plan your hospital visit confidently.",
    link: "/patient",
    cta: "Check Wait Times",
  },
  {
    icon: FaShieldAlt,
    color: "bg-red-600",
    title: "Emergency Routing",
    description:
      "High-priority cases are flagged immediately with direct routing to the nearest available emergency department.",
    link: "/patient",
    cta: "Emergency Check",
  },
  {
    icon: FaChartLine,
    color: "bg-indigo-600",
    title: "Live Analytics",
    description:
      "Department-level queue analytics and AI-generated operational summaries help hospitals reduce bottlenecks proactively.",
    link: "/hospital",
    cta: "See Analytics",
  },
];

const steps = [
  {
    number: "01",
    icon: FaHeartbeat,
    title: "Describe Symptoms",
    description:
      "Enter your symptoms, age, gender, and severity level into the patient portal form.",
  },
  {
    number: "02",
    icon: FaBrain,
    title: "AI Analysis",
    description:
      "Our Gemini AI instantly triages your condition, recommends a department, and finds the closest suitable hospital.",
  },
  {
    number: "03",
    icon: FaCheckCircle,
    title: "Get Token & Go",
    description:
      "Get your token number, track your live queue position, and arrive knowing exactly when you'll be seen.",
  },
];

export default function Home() {
  return (
    <main className="bg-slate-50">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center lg:py-36 lg:px-8">

          <div className="animate-fade-in-up">
            <span className="badge badge-blue" style={{ background: "rgba(255,255,255,0.12)", color: "#93c5fd", borderColor: "rgba(255,255,255,0.15)" }}>
              <FaHeartbeat size={10} />
              Digital India Hackathon 2026 · Team Eternals
            </span>
          </div>

          <h1
            className="mt-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-in-up"
            style={{ animationDelay: "80ms", lineHeight: "1.1" }}
          >
            Smarter Healthcare,
            <br />
            <span className="text-blue-300">Zero Uncertainty</span>
          </h1>

          <p
            className="mt-8 mx-auto max-w-3xl text-xl leading-8 text-blue-100 animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            SmartHealthAI coordinates hospital wait times, guides patients to the
            right department, and simplifies hospital reception — so
            families plan with confidence and clinics operate with clarity.
          </p>

          <div
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/patient"
              id="hero-cta-patient"
              className="btn btn-primary text-base px-8 py-4"
            >
              Open Patient Portal
              <FaArrowRight size={14} />
            </Link>
            <Link
              to="/hospital"
              id="hero-cta-hospital"
              className="btn btn-secondary text-base px-8 py-4"
              style={{ background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)" }}
            >
              Hospital Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-chip">Platform Capabilities</span>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Everything in one platform
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-lg leading-8 text-slate-600">
            From AI-powered patient triage to live hospital operations —
            SmartHealthAI covers the full healthcare journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 stagger-children">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="group card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                id={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg mb-5`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                <p className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-700 group-hover:gap-3 transition-all">
                  {feature.cta} <FaArrowRight size={11} />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-chip">Simple Process</span>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              How SmartHealthAI works
            </h2>
            <p className="mt-5 mx-auto max-w-2xl text-lg leading-8 text-slate-600">
              Three steps from symptoms to your seat in the right department.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 stagger-children">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center animate-fade-in-up">
                  {/* Connector line (between cards) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-200 to-blue-100" />
                  )}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200/60 mb-6">
                    <Icon size={26} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600 max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link to="/patient" id="how-it-works-cta" className="btn btn-primary text-base px-8 py-4">
              Start Now — It's Free
              <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BOTTOM CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:px-8">
        <div
          className="overflow-hidden rounded-3xl p-10 text-center text-white lg:p-16"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)" }}
        >
          <span className="badge" style={{ background: "rgba(255,255,255,0.1)", color: "#93c5fd", borderColor: "rgba(255,255,255,0.15)" }}>
            For Patients &amp; Hospitals
          </span>
          <h2 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
            One platform for all of healthcare
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-blue-100">
            Whether you're a patient checking wait times or a hospital managing queues,
            SmartHealthAI has the right view for you.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/patient"
              id="bottom-cta-patient"
              className="btn text-base px-8 py-4"
              style={{ background: "white", color: "#1d4ed8", borderRadius: "0.875rem" }}
            >
              <FaUserMd size={16} /> Patient Portal
            </Link>
            <Link
              to="/hospital"
              id="bottom-cta-hospital"
              className="btn text-base px-8 py-4"
              style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "0.875rem" }}
            >
              <FaHospital size={16} /> Hospital Dashboard
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
