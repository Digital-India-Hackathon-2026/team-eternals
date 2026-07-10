export default function About() {
  return (
    <main className="bg-slate-50">
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl ring-1 ring-slate-200 sm:p-12">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
            About SmartHealthAI
          </span>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            A connected healthcare experience for faster, smarter care
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            SmartHealthAI brings patient triage, appointment booking, hospital discovery, queue intelligence, and hospital operations into a unified digital platform.
          </p>
        </div>
      </section>
    </main>
  );
}
