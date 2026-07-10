import GovernmentHospitalPortal from "../components/GovernmentHospitalPortal/GovernmentHospitalPortal";

const informationItems = [
  {
    title: "Digital Patient Registration",
    description: "Register patients quickly with structured demographic, contact, and care-priority information.",
  },
  {
    title: "Token Management",
    description: "Generate and monitor digital tokens to organize OPD, emergency, and department queues.",
  },
  {
    title: "Resource Allocation",
    description: "Coordinate doctors, counters, departments, and support staff based on real-time demand.",
  },
  {
    title: "Bed Monitoring",
    description: "Track ward, ICU, and emergency bed availability for faster patient placement decisions.",
  },
  {
    title: "Emergency Tracking",
    description: "Prioritize critical cases with live emergency status and immediate care visibility.",
  },
  {
    title: "AI-assisted Decision Support",
    description: "Use intelligent summaries to identify bottlenecks, waiting risks, and resource pressure.",
  },
];

const benefits = [
  "Faster Registration",
  "Paperless Workflow",
  "Better Transparency",
  "Reduced Waiting Time",
];

export default function Government() {
  return (
    <main className="bg-slate-50">
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-6 text-center text-white shadow-2xl shadow-slate-300/60 ring-1 ring-slate-800 sm:p-10 lg:p-14">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
            Government Healthcare
          </span>

          <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">
            Government Hospital Digital Management System
          </h1>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-blue-100">
            A centralized platform for digitizing patient registration, monitoring hospital resources and improving public healthcare services.
          </p>
        </div>

        <div className="mt-12">
          <GovernmentHospitalPortal />
        </div>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
              Public Hospital Operations
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Digital systems for stronger healthcare delivery
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {informationItems.map((item) => (
              <div key={item.title} className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                Benefits
              </span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Better outcomes for patients and staff
              </h2>
            </div>
            <p className="max-w-2xl text-base font-semibold leading-7 text-slate-600">
              Streamlined digital workflows help government hospitals improve access, reduce manual errors, and make live service delivery more transparent.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 ring-1 ring-blue-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white">
                  ✓
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-950">{benefit}</h3>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
