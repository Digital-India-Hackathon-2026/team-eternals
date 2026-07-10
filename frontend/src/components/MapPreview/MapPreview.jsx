import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
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

const patientIcon = L.divIcon({
  className: "",
  html: '<div style="width:30px;height:30px;border-radius:9999px;background:#4f46e5;border:4px solid white;box-shadow:0 12px 28px rgba(79,70,229,.35);"></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const hospitalIcon = L.divIcon({
  className: "",
  html: '<div style="width:40px;height:40px;border-radius:9999px;background:#0f766e;border:4px solid white;box-shadow:0 14px 30px rgba(15,118,110,.35);display:flex;align-items:center;justify-content:center;color:white;font-size:17px;font-weight:900;">H</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapPreview({ report }) {
  const hospitalPosition = [
    report?.latitude ?? report?.lat ?? report?.hospitalLat ?? 17.4239,
    report?.longitude ?? report?.lng ?? report?.hospitalLng ?? 78.4738,
  ];
  const patientPosition = [
    report?.patientLatitude ?? report?.patientLat ?? 17.4126,
    report?.patientLongitude ?? report?.patientLng ?? 78.4497,
  ];
  const route = [patientPosition, hospitalPosition];
  const mapCenter = [
    (patientPosition[0] + hospitalPosition[0]) / 2,
    (patientPosition[1] + hospitalPosition[1]) / 2,
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-slate-200/80 lg:w-4/5 lg:justify-self-end">
      <div className="h-[520px] overflow-hidden rounded-[1.75rem] border border-slate-100 shadow-inner sm:h-[650px]">
        <MapContainer
          center={mapCenter}
          zoom={13}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={route}
            pathOptions={{ color: "#2563eb", opacity: 0.85, weight: 6 }}
          />

          <Marker position={patientPosition} icon={patientIcon}>
            <Popup>Patient marker</Popup>
          </Marker>

          <Marker position={hospitalPosition} icon={hospitalIcon}>
            <Popup>Hospital marker</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}

export default MapPreview;
