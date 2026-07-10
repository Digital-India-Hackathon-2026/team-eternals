import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="bg-slate-50">
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
          SmartHealthAI Platform
        </span>

        <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
          Intelligent healthcare access for patients and hospitals
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Navigate patient triage, appointments, hospital operations, and digital government reception workflows from one premium healthcare product.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-blue-500" to="/patient">
            Open Patient Portal
          </Link>
          <Link className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50" to="/hospital">
            View Hospital Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
