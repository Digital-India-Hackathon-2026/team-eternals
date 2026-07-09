import {
  FaHospital,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaRoute,
  FaStethoscope,
} from "react-icons/fa";

function HospitalCard({ report }) {
  if (!report) return null;

  const openMaps = () => {
    const hospital = encodeURIComponent(report.hospital);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${hospital}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          🏥 Recommended Hospital
        </h2>

        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          AI Recommendation
        </span>
      </div>

      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <FaHospital className="text-blue-600 text-xl" />
          <span className="font-semibold">{report.hospital}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaStethoscope className="text-green-600" />
          <span>{report.department}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-orange-500" />
          <span>{report.waitTime || "15 Minutes"}</span>
        </div>

        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-red-500" />
          <span>Hyderabad</span>
        </div>

      </div>

      <div className="flex gap-4 mt-8">

        <button
          onClick={openMaps}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex justify-center items-center gap-2"
        >
          <FaRoute />
          Navigate
        </button>

        <button
          onClick={() => window.open("tel:108")}
          className="flex-1 border py-4 rounded-xl flex justify-center items-center gap-2"
        >
          <FaPhoneAlt />
          Emergency
        </button>

      </div>
    </div>
  );
}

export default HospitalCard;