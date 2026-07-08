import { FaHeartbeat } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">

            <FaHeartbeat size={22} />

          </div>

          <div>

            <h1 className="text-3xl font-extrabold text-slate-900">
              SmartHealthAI
            </h1>

            <p className="text-slate-500 text-sm">
              AI Clinical Triage Platform
            </p>

          </div>

        </div>

        {/* Menu */}

        <nav className="hidden md:flex gap-10 text-slate-700 font-medium">

          <a href="#" className="hover:text-blue-600 transition">
            Home
          </a>

          <a
            href="#symptom-form"
            className="hover:text-blue-600 transition"
          >
            Symptoms
          </a>

          <a
            href="#hospital-section"
            className="hover:text-blue-600 transition"
          >
            Hospitals
          </a>

          <a href="#" className="hover:text-red-500 transition">
            Emergency
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            About
          </a>

        </nav>

        {/* Button */}

        <button
          onClick={() =>
            document
              .getElementById("symptom-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl shadow-lg transition hover:scale-105"
        >
          Get Started
        </button>

      </div>

    </header>
  );
}

export default Navbar;