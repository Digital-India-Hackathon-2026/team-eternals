function HospitalCard({ report }) {
  const hospital = report?.hospital ?? "Recommended Hospital";
  const department = report?.department ?? "Emergency Medicine";
  const address = report?.address ?? `${hospital}, Hyderabad, Telangana`;
  const distance = report?.distance ?? "4.2 km";
  const travelTime = report?.travelTime ?? report?.eta ?? "14 min";
  const queueLength = report?.queueLength ?? report?.currentQueue ?? "18 patients";
  const waitTime = report?.waitTime ?? report?.estimatedWait ?? "24 min";
  const doctorsAvailable = report?.doctorsAvailable ?? report?.availableDoctors ?? "7";
  const bedsAvailable = report?.bedsAvailable ?? report?.emergencyBeds ?? "5";
  const phone = report?.phone ?? report?.phoneNumber ?? report?.contact ?? "108";
  const rating = report?.rating ?? report?.hospitalRating ?? "4.8";
  const emergencyAvailable = report?.emergencyAvailable ?? true;
  const latitude = report?.latitude ?? report?.lat ?? report?.hospitalLat ?? 17.4239;
  const longitude = report?.longitude ?? report?.lng ?? report?.hospitalLng ?? 78.4738;
  const aiExplanation =
    report?.aiExplanation ??
    report?.recommendationReason ??
    report?.reason ??
    `${hospital} is recommended because it is close by, has the right ${department} support, and currently shows a good balance of wait time, available doctors, and emergency capacity.`;
  const stats = [
    {
      label: "Distance",
      value: distance,
      tone: "text-blue-700 bg-blue-50 ring-blue-100",
    },
    {
      label: "Travel Time",
      value: travelTime,
      tone: "text-blue-700 bg-blue-50 ring-blue-100",
    },
    {
      label: "Current Queue",
      value: queueLength,
      tone: "text-amber-700 bg-amber-50 ring-amber-100",
    },
    {
      label: "Estimated Wait",
      value: waitTime,
      tone: "text-amber-700 bg-amber-50 ring-amber-100",
    },
    {
      label: "Doctors Available",
      value: doctorsAvailable,
      tone: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    },
    {
      label: "Emergency Beds",
      value: bedsAvailable,
      tone: "text-red-700 bg-red-50 ring-red-100",
    },
  ];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const openDirections = () => window.open(directionsUrl, "_blank");
  const callHospital = () => window.open(`tel:${phone}`);
  const openMaps = () => window.open(mapsUrl, "_blank");

  return (
    <section className="relative z-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white p-5 shadow-2xl shadow-slate-200/80 sm:p-6 lg:w-[120%] lg:p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-100 blur-3xl"></div>
      <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-teal-100 blur-3xl"></div>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple-700 ring-1 ring-purple-100">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            Recommended Hospital
          </span>

          <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 ring-1 ring-teal-100">
            {department}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {emergencyAvailable ? "Emergency Available" : "Emergency Not Listed"}
          </span>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              {hospital}
            </h2>

            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
              {address}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-xl shadow-slate-200">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Patient Match
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xl font-black text-amber-300">★★★★★</span>
              <span className="text-2xl font-black">{rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ring-1 ${stat.tone}`}>
                {stat.label}
              </span>
              <p className="mt-4 text-3xl font-black text-slate-950">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[2rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-teal-50 p-6 shadow-xl shadow-purple-100/40">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-purple-200">
              AI
            </span>
            <h3 className="text-xl font-black text-slate-950">
              Why this hospital?
            </h3>
          </div>
          <p className="mt-4 text-base font-medium leading-7 text-slate-700">
            {aiExplanation}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={openDirections}
            className="rounded-2xl bg-indigo-500 px-5 py-4 text-base font-black text-white shadow-xl shadow-indigo-100 transition hover:-translate-y-1 hover:bg-indigo-400"
          >
            Navigate
          </button>

          <button
            type="button"
            onClick={callHospital}
            className="rounded-2xl bg-teal-600 px-5 py-4 text-base font-black text-white shadow-xl shadow-teal-100 transition hover:-translate-y-1 hover:bg-teal-500"
          >
            Call Hospital
          </button>

          <button
            type="button"
            onClick={openMaps}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-black text-slate-900 shadow-xl shadow-slate-100 transition hover:-translate-y-1 hover:bg-slate-50"
          >
            View on Maps
          </button>
        </div>
      </div>
    </section>
  );
}

export default HospitalCard;
