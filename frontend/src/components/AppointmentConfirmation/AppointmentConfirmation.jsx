const appointment = {
  id: "SHA-482913",
  patientName: "Aarav Sharma",
  hospital: "SmartHealth CityCare Hospital",
  department: "Cardiology",
  doctor: "Dr. Vikram Menon",
  date: "14 July 2026",
  time: "11:30 AM",
  queueNumber: "Q-18",
  emergencyPhone: "+91 80 4567 2211",
  address: "MG Road, Bengaluru",
};

const instructions = [
  "Arrive 15 minutes early.",
  "Carry ID proof.",
  "Bring previous medical reports.",
  "Wear a mask if symptomatic.",
];

const actions = [
  "Download Appointment Slip",
  "Add to Calendar",
  "Get Directions",
  "Share",
];

function DetailRow({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950 sm:text-base">{value}</p>
    </div>
  );
}

export default function AppointmentConfirmation() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-8 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-4xl font-black text-emerald-600 ring-1 ring-emerald-100">
              ✓
            </div>

            <div>
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                Appointment Confirmed
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Your hospital visit is confirmed
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Keep this confirmation ready for faster check-in at the hospital reception.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <DetailRow label="Appointment ID" value={appointment.id} />
            <DetailRow label="Patient Name" value={appointment.patientName} />
            <DetailRow label="Hospital" value={appointment.hospital} />
            <DetailRow label="Department" value={appointment.department} />
            <DetailRow label="Doctor" value={appointment.doctor} />
            <DetailRow label="Date" value={appointment.date} />
            <DetailRow label="Time" value={appointment.time} />
            <DetailRow label="Queue Number" value={appointment.queueNumber} />
          </div>

          <div className="mt-8 rounded-3xl bg-blue-50 p-5 ring-1 ring-blue-100">
            <h3 className="text-xl font-black text-slate-950">Important Instructions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {instructions.map((instruction) => (
                <div key={instruction} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                  {instruction}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
            <span className="inline-flex rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-100 ring-1 ring-red-400/20">
              Emergency Contact
            </span>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-300">24/7 hospital emergency desk</p>
                <p className="mt-1 text-2xl font-black">{appointment.emergencyPhone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Hospital address</p>
                <p className="mt-1 text-lg font-black">{appointment.address}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-6 text-white shadow-xl xl:sticky xl:top-6">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
            Check-in QR
          </span>
          <h3 className="mt-4 text-2xl font-black">Hospital check-in</h3>
          <p className="mt-2 text-sm leading-6 text-blue-100">
            Scan this QR placeholder at reception to verify your appointment details.
          </p>

          <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg">
            <div className="grid aspect-square grid-cols-5 gap-2 rounded-2xl bg-slate-50 p-4">
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded ${index % 2 === 0 || index % 7 === 0 ? "bg-slate-950" : "bg-white"}`}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-xs font-black uppercase tracking-wide text-slate-500">
              {appointment.id}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {actions.map((action, index) => (
              <button
                key={action}
                type="button"
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  index === 0
                    ? "bg-white text-blue-700 shadow-lg hover:bg-blue-50"
                    : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
