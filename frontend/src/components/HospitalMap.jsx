import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const HOSPITALS_URL = 'http://localhost:5000/api/hospitals';
const HYDERABAD_CENTER = [17.3850, 78.4867];

const defaultIcon = new L.DivIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
      <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background-color: #ffffff; border: 2px solid #6366f1; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);">
        <span style="font-size: 10px; line-height: 1;">🏥</span>
      </div>
    </div>
  `,
  className: 'custom-marker-default',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const highlightedIcon = new L.DivIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
      <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: #10b981; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background-color: #ffffff; border: 2.5px solid #10b981; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);">
        <span style="font-size: 12px; line-height: 1;">🌟</span>
      </div>
    </div>
  `,
  className: 'custom-marker-highlighted',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const patientIcon = new L.DivIcon({
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
      <span style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background-color: #ef4444; opacity: 0.3; animation: ping 2s infinite;"></span>
      <div style="position: relative; width: 12px; height: 12px; border-radius: 50%; background-color: #ef4444; border: 2px solid #ffffff; box-shadow: 0 0 6px rgba(239, 68, 68, 0.8);"></div>
    </div>
  `,
  className: 'custom-marker-patient',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function HospitalMap({ recommendedHospital, patientLocation, onBookAppointment }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(HOSPITALS_URL);
      const data = await res.json();
      if (data.success) {
        setHospitals(data.hospitals);
      } else {
        throw new Error(data.message || 'Failed to fetch hospitals.');
      }
    } catch (err) {
      console.error('[HospitalMap] Error loading coordinates:', err);
      setError('Error connecting to database. Using mock data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [recommendedHospital]); // Re-fetch on recommendation update to sync capacity remaining

  let viewCenter = HYDERABAD_CENTER;
  if (recommendedHospital && recommendedHospital.coordinates) {
    viewCenter = [recommendedHospital.coordinates.latitude, recommendedHospital.coordinates.longitude];
  } else if (patientLocation && patientLocation.lat && patientLocation.lng) {
    viewCenter = [patientLocation.lat, patientLocation.lng];
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col h-full">
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          color: #1e293b !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.1) !important;
          font-family: inherit;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
        }
        .leaflet-container {
          background: #f8fafc !important;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          70%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <h3 className="text-slate-800 font-bold text-sm">Emergency Routing Map</h3>
        </div>
        {loading && (
          <span className="text-xs text-indigo-600 flex items-center gap-1.5 animate-pulse font-medium">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
            Syncing...
          </span>
        )}
      </div>

      <div className="flex-1 min-h-[300px] rounded-xl overflow-hidden border border-slate-200 relative z-20">
        <MapContainer
          center={viewCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapRecenter center={viewCenter} />

          {patientLocation && patientLocation.lat && patientLocation.lng && (
            <Marker position={[patientLocation.lat, patientLocation.lng]} icon={patientIcon}>
              <Popup>
                <div className="p-1">
                  <h4 className="text-red-600 font-bold text-xs uppercase tracking-wider">Your Location</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Emergency Triage Incident Point</p>
                </div>
              </Popup>
            </Marker>
          )}

          {hospitals.map((hospital) => {
            const isTopRec = recommendedHospital && recommendedHospital.id === hospital.id;
            return (
              <Marker
                key={hospital.id}
                position={[hospital.latitude, hospital.longitude]}
                icon={isTopRec ? highlightedIcon : defaultIcon}
              >
                <Popup>
                  <div className="p-1.5 space-y-2 min-w-[200px] text-slate-800">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-snug">{hospital.facilityName}</h4>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border ${
                          hospital.hospitalType === 'GOVERNMENT'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        }`}>
                          [{hospital.hospitalType}]
                        </span>
                      </div>
                      {isTopRec && (
                        <span className="bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm shrink-0">
                          BEST RECOMMENDED
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      {hospital.physicalStreet}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-slate-400 font-semibold">Available Beds</p>
                        <p className="font-bold text-slate-700">{hospital.availableBeds} / {hospital.totalBedCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold">Duty Doctors</p>
                        <p className="font-bold text-slate-700">{hospital.activeDoctorCount} Active</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Rating: ⭐ {hospital.facilityRating.toFixed(1)}</span>
                      {isTopRec && <span className="font-semibold text-emerald-600">Score: {recommendedHospital.score}</span>}
                    </div>

                    {onBookAppointment && (
                      <button
                        onClick={() => onBookAppointment(hospital)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] py-1.5 px-2 rounded-lg mt-2.5 transition cursor-pointer text-center"
                      >
                        🎫 Book Digital Token
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 px-1 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Patient
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500"></span> Standard Facility
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-emerald-500 animate-pulse"></span> Best Recommended
          </span>
        </div>
      </div>
    </div>
  );
}
