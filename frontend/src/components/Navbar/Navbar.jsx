import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHeartbeat, FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Patient Portal", path: "/patient" },
  { label: "Hospital Dashboard", path: "/hospital" },
  { label: "About", path: "/about" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/60 border-b border-slate-200"
          : "bg-white/80 backdrop-blur-md border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:px-8">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <FaHeartbeat size={18} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 leading-none group-hover:text-blue-700 transition">
              SmartHealthAI
            </p>
            <p className="text-xs text-slate-400 font-semibold leading-tight mt-0.5">
              Clinical Care Guidance
            </p>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── CTA Button (desktop) ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/patient"
            className="btn btn-primary text-sm px-5 py-2.5"
            style={{ borderRadius: "0.75rem" }}
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 pb-6 pt-4 animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-700 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/patient"
              onClick={() => setMobileOpen(false)}
              className="mt-3 btn btn-primary text-sm text-center"
              style={{ borderRadius: "0.75rem" }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
