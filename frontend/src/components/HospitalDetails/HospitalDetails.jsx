import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getRecommendedHyderabadHospital,
  hyderabadHospitals,
} from "../MapPreview/MapPreview";

const defaultHospital = {
  name: "SmartHealth CityCare Hospital",
  type: "Multi-specialty emergency hospital",
  location: "MG Road, Bengaluru",
  phone: "+91 80 4567 2211",
  rating: "4.8",
  reviews: "2,184",
  waitTime: "18 min",
  queue: "24 patients",
  emergency: "24/7 Emergency Open",
  ambulance: "6 ambulances nearby",
  position: [12.9716, 77.5946],
};

const departments = [
  { name: "Emergency & Trauma", status: "Open", load: "Moderate" },
  { name: "Cardiology", status: "Open", load: "Low" },
  { name: "Neurology", status: "Open", load: "Moderate" },
  { name: "Orthopedics", status: "Open", load: "Low" },
];

const doctors = [
  {
    name: "Dr. Ananya Rao",
    specialty: "Emergency Medicine",
    availability: "Available now",
  },
  {
    name: "Dr. Vikram Menon",
    specialty: "Cardiologist",
    availability: "Next slot 11:30 AM",
  },
  {
    name: "Dr. Sara Thomas",
    specialty: "Neurologist",
    availability: "Available in 25 min",
  },
];

const slots = ["10:45 AM", "11:30 AM", "12:15 PM", "02:00 PM", "03:45 PM"];

const facilities = [
  "ICU & critical care",
  "Digital diagnostics",
  "Pharmacy",
  "Blood bank",
  "Insurance desk",
  "Wheelchair support",
];

const reviews = [
  {
    name: "Priya S.",
    text: "Fast emergency triage and clear communication from the care team.",
  },
  {
    name: "Rahul K.",
    text: "Clean facility, helpful staff, and the appointment slot was accurate.",
  },
];

function InfoCard({ title, value, detail, tone = "blue" }) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${toneClasses[tone]}`}
      >
        {title}
      </span>
      <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function HospitalMap({ hospital, onSelectHospital }) {
  return (
    <div className="sticky top-6 overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200 lg:min-h-[760px]">
      <div className="border-b border-slate-100 p-6">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
          Live Location
        </span>
        <h3 className="mt-3 text-2xl font-black text-slate-950">Hospital map</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          View the hospital, emergency access, and nearby ambulance coverage.
        </p>
      </div>

      <div className="h-[420px] sm:h-[520px] lg:h-[640px]">
        <MapContainer
          center={hospital.position}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hyderabadHospitals.map((item) => {
            const isActive = item.name === hospital.name;

            return (
              <CircleMarker
                key={item.name}
                center={item.position}
                radius={isActive ? 18 : 11}
                pathOptions={{
                  color: isActive ? "#2563eb" : "#059669",
                  fillColor: isActive ? "#3b82f6" : "#10b981",
                  fillOpacity: isActive ? 0.9 : 0.72,
                }}
                eventHandlers={{
                  click: () => onSelectHospital?.(item),
                }}
              >
                <Popup>
                  <strong>{item.name}</strong>
                  <br />
                  Queue: {item.queue}
                  <br />
                  Doctors: {item.doctors}
                  <br />
                  Beds: {item.beds}
                  <br />
                  ETA: {item.eta}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default function HospitalDetails({ report, selectedHospital, onSelectHospital }) {
  const recommendedHospital = getRecommendedHyderabadHospital(report);
  const activeHospital = selectedHospital || recommendedHospital;
  const hospital = {
    ...defaultHospital,
    ...activeHospital,
    type: report?.hospitalType || defaultHospital.type,
    location: report?.address || activeHospital?.address || "Hyderabad, Telangana",
    phone: report?.phone || report?.contact || defaultHospital.phone,
    rating: report?.rating || report?.hospitalRating || defaultHospital.rating,
    reviews: report?.reviews || defaultHospital.reviews,
    waitTime: report?.waitTime || report?.estimatedWaitTime || activeHospital?.eta || defaultHospital.waitTime,
    queue: report?.queueLength || report?.queue || activeHospital?.queue || defaultHospital.queue,
    emergency: activeHospital?.emergencyStatus || report?.emergencyStatus || defaultHospital.emergency,
    ambulance: report?.ambulanceAvailability || defaultHospital.ambulance,
    position: activeHospital?.position || defaultHospital.position,
  };

  return (
    <section className="mt-20" id="hospital-details">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
          Hospital Details
        </span>
        <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Complete care details before you visit
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Real-time hospital availability, doctors, appointment slots, facilities,
          queue status, and navigation in one premium patient experience.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/95 text-3xl font-black text-blue-700 shadow-lg">
                  SH
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-100">
                    {hospital.type}
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    {hospital.name}
                  </h3>
                  <p className="mt-2 text-blue-100">{hospital.location}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <a
                  href={`tel:${hospital.phone}`}
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  Call Hospital
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.position[0]},${hospital.position[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-blue-500 px-5 py-3 text-center text-sm font-black text-white shadow-sm ring-1 ring-white/20 transition hover:bg-blue-400"
                >
                  Navigate
                </a>
                <a
                  href="#appointment-slots"
                  className="rounded-2xl bg-emerald-500 px-5 py-3 text-center text-sm font-black text-white shadow-sm transition hover:bg-emerald-400"
                >
                  Book Appointment
                </a>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard title="Rating" value={`${hospital.rating}/5`} detail={`${hospital.reviews} patient reviews`} />
              <InfoCard title="Queue" value={hospital.queue} detail="Live reception count" tone="amber" />
              <InfoCard title="Doctors" value={activeHospital.doctors || "7 doctors"} detail="Available clinicians" tone="emerald" />
              <InfoCard title="Beds" value={activeHospital.beds || "5 beds"} detail="Available bed capacity" />
              <InfoCard title="Distance" value={activeHospital.distance || "4.2 km"} detail="Approximate travel distance" />
              <InfoCard title="ETA" value={activeHospital.eta || hospital.waitTime} detail="Estimated arrival time" />
              <InfoCard title="Emergency" value={hospital.emergency} detail="Current emergency status" tone="emerald" />
              <InfoCard title="Ambulance" value="Available" detail={hospital.ambulance} tone="emerald" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Departments">
              <div className="space-y-3">
                {departments.map((department) => (
                  <div key={department.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="font-bold text-slate-950">{department.name}</p>
                      <p className="text-sm text-slate-500">Load: {department.load}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                      {department.status}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Emergency Access">
              <div className="space-y-4">
                <InfoCard title="Emergency" value="Open 24/7" detail={hospital.emergency} tone="emerald" />
                <InfoCard title="Ambulance" value="6 Units" detail="Nearest unit ETA: 7 min" tone="blue" />
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Doctors Available Today">
            <div className="grid gap-4 md:grid-cols-3">
              {doctors.map((doctor) => (
                <div key={doctor.name} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 font-black text-blue-700">
                    {doctor.name.split(" ")[1][0]}
                  </div>
                  <p className="mt-4 font-black text-slate-950">{doctor.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
                  <p className="mt-4 rounded-full bg-white px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                    {doctor.availability}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Available Appointment Slots">
            <div id="appointment-slots" className="flex flex-wrap gap-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  className="rounded-2xl bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-600 hover:text-white"
                  type="button"
                >
                  {slot}
                </button>
              ))}
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Facilities & Services">
              <div className="grid gap-3 sm:grid-cols-2">
                {facilities.map((facility) => (
                  <div key={facility} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                    {facility}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Contact Information">
              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <p><strong className="text-slate-950">Phone:</strong> {hospital.phone}</p>
                <p><strong className="text-slate-950">Address:</strong> {hospital.location}</p>
                <p><strong className="text-slate-950">Reception:</strong> OPD desk open until 9:00 PM</p>
                <p><strong className="text-slate-950">Insurance:</strong> Cashless and government schemes supported</p>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Patient Ratings & Reviews">
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-amber-400">★★★★★</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">“{review.text}”</p>
                  <p className="mt-4 font-black text-slate-950">{review.name}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <HospitalMap hospital={hospital} onSelectHospital={onSelectHospital} />
      </div>
    </section>
  );
}
