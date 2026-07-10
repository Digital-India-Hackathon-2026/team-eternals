import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const hyderabadHospitals = [
  {
    name: "Apollo Hospitals Jubilee Hills",
    queue: "18 patients",
    doctors: "12 doctors",
    beds: "34 beds",
    distance: "6.8 km",
    eta: "18 min",
    emergencyStatus: "Emergency Available",
    position: [17.4149, 78.4123],
  },
  {
    name: "Yashoda Hospitals",
    queue: "24 patients",
    doctors: "10 doctors",
    beds: "28 beds",
    distance: "5.2 km",
    eta: "16 min",
    emergencyStatus: "Emergency Available",
    position: [17.4399, 78.4983],
  },
  {
    name: "KIMS Hospital",
    queue: "15 patients",
    doctors: "9 doctors",
    beds: "31 beds",
    distance: "4.9 km",
    eta: "14 min",
    emergencyStatus: "Emergency Available",
    position: [17.4406, 78.4848],
  },
  {
    name: "AIG Hospitals",
    queue: "12 patients",
    doctors: "8 doctors",
    beds: "26 beds",
    distance: "9.1 km",
    eta: "24 min",
    emergencyStatus: "Emergency Available",
    position: [17.4435, 78.3505],
  },
  {
    name: "Gandhi Hospital",
    queue: "32 patients",
    doctors: "14 doctors",
    beds: "48 beds",
    distance: "7.4 km",
    eta: "21 min",
    emergencyStatus: "Trauma Care Open",
    position: [17.4241, 78.5026],
  },
  {
    name: "Osmania General Hospital",
    queue: "29 patients",
    doctors: "13 doctors",
    beds: "44 beds",
    distance: "3.7 km",
    eta: "13 min",
    emergencyStatus: "Emergency Available",
    position: [17.3713, 78.4747],
  },
];

const hyderabadCenter = [17.385, 78.4867];

const normalizeName = (value = "") => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getRecommendedHyderabadHospital = (report) => {
  const recommendedName = normalizeName(
    report?.hospital || report?.recommendedHospital || report?.hospitalName
  );

  return (
    hyderabadHospitals.find((hospital) =>
      recommendedName.includes(normalizeName(hospital.name)) ||
      normalizeName(hospital.name).includes(recommendedName)
    ) || hyderabadHospitals[0]
  );
};

const selectedIcon = L.divIcon({
  className: "",
  html: '<div style="width:46px;height:46px;border-radius:9999px;background:#2563eb;border:5px solid white;box-shadow:0 16px 34px rgba(37,99,235,.45);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:900;">★</div>',
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const hospitalIcon = L.divIcon({
  className: "",
  html: '<div style="width:40px;height:40px;border-radius:9999px;background:#0f766e;border:4px solid white;box-shadow:0 14px 30px rgba(15,118,110,.35);display:flex;align-items:center;justify-content:center;color:white;font-size:17px;font-weight:900;">H</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapPreview({ report, selectedHospital, onSelectHospital }) {
  const recommendedHospital = getRecommendedHyderabadHospital(report);
  const activeHospital = selectedHospital || recommendedHospital;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-slate-200/80 lg:w-4/5 lg:justify-self-end">
      <div className="h-[520px] overflow-hidden rounded-[1.75rem] border border-slate-100 shadow-inner sm:h-[650px]">
        <MapContainer
          center={hyderabadCenter}
          zoom={12}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hyderabadHospitals.map((hospital) => {
            const isActive = activeHospital.name === hospital.name;

            return (
              <Marker
                key={hospital.name}
                position={hospital.position}
                icon={isActive ? selectedIcon : hospitalIcon}
                eventHandlers={{
                  click: () => onSelectHospital?.(hospital),
                }}
              >
                <Popup>
                  <strong>{hospital.name}</strong>
                  <br />
                  Queue: {hospital.queue}
                  <br />
                  Doctors: {hospital.doctors}
                  <br />
                  Beds: {hospital.beds}
                  <br />
                  ETA: {hospital.eta}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}

export default MapPreview;
