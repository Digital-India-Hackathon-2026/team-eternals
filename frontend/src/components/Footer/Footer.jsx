import { Link } from "react-router-dom";
import { FaHeartbeat, FaGithub } from "react-icons/fa";

const footerLinks = [
  { label: "Patient Portal",     path: "/patient"  },
  { label: "Hospital Dashboard", path: "/hospital" },
  { label: "About",              path: "/about"    },
];

function Footer() {
  return (
    <footer className="bg-slate-950 text-white mt-0">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto]">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 shadow-lg">
                <FaHeartbeat size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none">SmartHealthAI</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Clinical Care & Triage Guidance</p>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              SmartHealthAI by Team Eternals — Digital India Hackathon 2026.
              Transforming hospital waiting from uncertainty into confident, predictable healthcare access.
            </p>
            <a
              href="https://github.com/siddharth-89-eng/SmartHealthAI"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
            >
              <FaGithub size={16} /> View on GitHub
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">Platform</p>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-800 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500 font-semibold">
            © 2026 Team Eternals · Digital India Hackathon
          </p>
          <p className="text-xs text-slate-500">
            Built with React · Node.js · Intelligent Care Routing
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;