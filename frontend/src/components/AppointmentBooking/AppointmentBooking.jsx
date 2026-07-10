import { useState } from "react";

const hospitals = [
  "SmartHealth CityCare Hospital",
  "Aster Prime Medical Center",
  "Metro Heart & Trauma Institute",
];

const departments = ["Emergency Medicine", "Cardiology", "Neurology", "Orthopedics"];

const doctors = [
  {
    name: "Dr. Ananya Rao",
    specialty: "Emergency Medicine",
    experience: "12 years",
    availability: "Available today",
  },
  {
    name: "Dr. Vikram Menon",
    specialty: "Cardiology",
    experience: "16 years",
    availability: "Next slot 11:30 AM",
  },
  {
    name: "Dr. Sara Thomas",
    specialty: "Neurology",
    experience: "10 years",
    availability: "Available in 25 min",
  },
];

const timeSlots = ["09:30 AM", "10:15 AM", "11:30 AM", "12:45 PM", "02:00 PM", "04:15 PM"];

export default function AppointmentBooking() {
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0].name);
  const [selectedDate, setSelectedDate] = useState("2026-07-14");
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[1]);
  const [patient, setPatient] = useState({ name: "", phone: "", concern: "" });
  const [appointmentId, setAppointmentId] = useState("");

  const selectedDoctorDetails = doctors.find((doctor) => doctor.name === selectedDoctor);

  function handlePatientChange(event) {
    const { name, value } = event.target;
    setPatient((currentPatient) => ({ ...currentPatient, [name]: value }));
  }

  function handleBooking(event) {
    event.preventDefault();
    setAppointmentId(`SHA-${Date.now().toString().slice(-6)}`);
  }

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
            Appointment Booking
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Book a confirmed hospital appointment
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Choose your hospital, department, doctor, date, and preferred time slot with a clean patient-first booking flow.
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
          Instant confirmation enabled
        </div>
      </div>

      <form className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]" onSubmit={handleBooking}>
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-slate-800">Selected Hospital</span>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                value={selectedHospital}
                onChange={(event) => setSelectedHospital(event.target.value)}
              >
                {hospitals.map((hospital) => (
                  <option key={hospital}>{hospital}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-black text-slate-800">Department</span>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                value={selectedDepartment}
                onChange={(event) => setSelectedDepartment(event.target.value)}
              >
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-950">Doctor Selection</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctor === doctor.name;

                return (
                  <button
                    key={doctor.name}
                    type="button"
                    onClick={() => setSelectedDoctor(doctor.name)}
                    className={`rounded-3xl p-5 text-left ring-1 transition ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg ring-blue-600"
                        : "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black ${isSelected ? "bg-white text-blue-700" : "bg-blue-100 text-blue-700"}`}>
                      {doctor.name.split(" ")[1][0]}
                    </div>
                    <p className="mt-4 font-black">{doctor.name}</p>
                    <p className={`mt-1 text-sm ${isSelected ? "text-blue-100" : "text-slate-500"}`}>{doctor.specialty}</p>
                    <p className={`mt-3 text-xs font-bold ${isSelected ? "text-blue-100" : "text-slate-500"}`}>{doctor.experience} experience</p>
                    <p className={`mt-4 rounded-full px-3 py-2 text-xs font-black ${isSelected ? "bg-white/15 text-white" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"}`}>
                      {doctor.availability}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <label className="block rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <span className="text-sm font-black text-slate-800">Date Picker</span>
              <input
                type="date"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>

            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <h3 className="text-sm font-black text-slate-800">Time Slot Cards</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                      selectedSlot === slot
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-blue-700 ring-1 ring-blue-100 hover:bg-blue-50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <h3 className="text-xl font-black text-slate-950">Patient Details</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="name"
                placeholder="Patient full name"
                value={patient.name}
                onChange={handlePatientChange}
                required
              />
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="phone"
                placeholder="Mobile number"
                type="tel"
                value={patient.phone}
                onChange={handlePatientChange}
                required
              />
              <textarea
                className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:col-span-2"
                name="concern"
                placeholder="Briefly describe the concern or symptoms"
                value={patient.concern}
                onChange={handlePatientChange}
              />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-6 text-white shadow-xl lg:sticky lg:top-6">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
            Booking Summary
          </span>
          <h3 className="mt-4 text-2xl font-black">Appointment overview</h3>

          <div className="mt-6 space-y-4 text-sm">
            <p><strong className="text-blue-100">Hospital:</strong> {selectedHospital}</p>
            <p><strong className="text-blue-100">Department:</strong> {selectedDepartment}</p>
            <p><strong className="text-blue-100">Doctor:</strong> {selectedDoctorDetails?.name}</p>
            <p><strong className="text-blue-100">Date:</strong> {selectedDate}</p>
            <p><strong className="text-blue-100">Time:</strong> {selectedSlot}</p>
          </div>

          <button
            className="mt-8 w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-blue-700 shadow-lg transition hover:bg-blue-50"
            type="submit"
          >
            Book Appointment
          </button>

          {appointmentId && (
            <div className="mt-6 rounded-3xl bg-white p-5 text-slate-950 shadow-lg">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                Confirmed
              </span>
              <h4 className="mt-4 text-xl font-black">Appointment booked successfully</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your appointment is confirmed. Please arrive 10 minutes before the scheduled time.
              </p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Appointment ID</p>
                <p className="mt-1 text-2xl font-black text-blue-700">{appointmentId}</p>
              </div>
              <button
                className="mt-4 w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-400"
                type="button"
              >
                Download Appointment
              </button>
            </div>
          )}
        </aside>
      </form>
    </section>
  );
}
