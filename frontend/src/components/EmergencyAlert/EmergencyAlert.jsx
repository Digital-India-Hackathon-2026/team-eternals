function EmergencyAlert({ report }) {
  if (!report) return null;

  const priority = report.priority?.toLowerCase();
  const hospital = report.hospital || "the recommended hospital";
  const department = report.department || "the recommended department";

  const navigateToHospital = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital)}`,
      "_blank"
    );
  };

  if (priority === "high") {
    return (
      <section className="mt-10">
        <div className="overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white shadow-2xl shadow-red-200">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div className="flex gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl ring-1 ring-white/25">
                🚨
              </div>

              <div>
                <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold uppercase tracking-wide text-red-50 ring-1 ring-white/20">
                  High Priority
                </span>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                  Immediate medical attention is recommended.
                </h2>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-red-50">
                  Based on your reported symptoms, urgent clinical evaluation is advised. Please proceed to the Emergency Department as soon as possible.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/12 p-5 ring-1 ring-white/20">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-100">
                      Recommended next action
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      Go to emergency care now
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/12 p-5 ring-1 ring-white/20">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-100">
                      Recommended hospital
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {hospital}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:w-64 lg:flex-col">
              <button
                type="button"
                onClick={() => window.open("tel:108")}
                className="rounded-2xl bg-white px-6 py-4 text-lg font-bold text-red-700 shadow-lg transition hover:bg-red-50"
              >
                Call 108
              </button>

              <button
                type="button"
                onClick={navigateToHospital}
                className="rounded-2xl border border-white/40 bg-white/10 px-6 py-4 text-lg font-bold text-white transition hover:bg-white/20"
              >
                Navigate to Hospital
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (priority === "medium") {
    return (
      <section className="mt-10">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xl shadow-amber-100 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-3xl text-white shadow-lg shadow-amber-200">
                ⚠️
              </div>

              <div>
                <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
                  Medium Priority
                </span>

                <h2 className="mt-4 text-3xl font-extrabold text-amber-950">
                  A same-day medical review is recommended.
                </h2>

                <p className="mt-3 max-w-3xl text-lg leading-8 text-amber-800">
                  Based on your reported symptoms, a clinician should review your condition today so the next steps can be planned safely.
                </p>

                <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
                  <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                    Recommended next action
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    Visit {department} today
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100 sm:grid-cols-2 lg:min-w-96">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                  Department
                </p>
                <p className="mt-2 font-bold text-slate-900">
                  {department}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                  Hospital
                </p>
                <p className="mt-2 font-bold text-slate-900">
                  {hospital}
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.open("tel:108")}
                className="rounded-2xl bg-amber-500 px-5 py-3 font-bold text-white shadow-lg shadow-amber-100 transition hover:bg-amber-600"
              >
                Call 108
              </button>

              <button
                type="button"
                onClick={navigateToHospital}
                className="rounded-2xl border border-amber-200 bg-white px-5 py-3 font-bold text-amber-800 transition hover:bg-amber-50"
              >
                Navigate to Hospital
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-xl shadow-emerald-100 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-3xl text-white shadow-lg shadow-emerald-200">
              ✓
            </div>

            <div>
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                Low Priority
              </span>

              <h2 className="mt-4 text-3xl font-extrabold text-emerald-950">
                A routine consultation is recommended.
              </h2>

              <p className="mt-3 max-w-3xl text-lg leading-8 text-emerald-800">
                Your symptoms can be reviewed through a routine appointment. Continue monitoring how you feel, and seek urgent care if symptoms worsen or new concerning symptoms appear.
              </p>

              <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Recommended next action
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  Schedule a consultation with {department}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 sm:grid-cols-2 lg:min-w-96">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Department
              </p>
              <p className="mt-2 font-bold text-slate-900">
                {department}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Hospital
              </p>
              <p className="mt-2 font-bold text-slate-900">
                {hospital}
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.open("tel:108")}
              className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700"
            >
              Call 108
            </button>

            <button
              type="button"
              onClick={navigateToHospital}
              className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              Navigate to Hospital
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmergencyAlert;
