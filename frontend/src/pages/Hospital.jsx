import PrivateHospitalDashboard from "../components/HospitalDashboard/HospitalDashboard";

const summaryCards = [
  {
    title: "Live Operations",
    items: [
      { label: "Active Patients", value: "126" },
      { label: "Doctors on Duty", value: "32" },
      { label: "Emergency Cases", value: "7" },
    ],
  },
  {
    title: "Hospital Resources",
    items: [
      { label: "Available Beds", value: "42" },
      { label: "ICU Beds", value: "6" },
      { label: "Ambulances Ready", value: "4" },
    ],
  },
];

export default function Hospital() {
  return (
    <main className="bg-slate-50">
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-6 text-white shadow-2xl shadow-slate-300/60 ring-1 ring-slate-800 sm:p-10 lg:p-14">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
            Hospital Management
          </span>

          <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">
            Private Hospital Operations Dashboard
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-blue-100">
            Monitor appointments, patient flow, bed occupancy, emergency cases and hospital resources from one intelligent dashboard.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {summaryCards.map((card) => (
            <div key={card.title} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">{card.title}</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {card.items.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{item.label}</p>
                    <p className="mt-3 text-4xl font-black text-blue-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <PrivateHospitalDashboard />
      </section>
    </main>
  );
}
