import {
  FaHospital,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaPhoneAlt,
  FaRoute,
  FaBed,
  FaUsers,
} from "react-icons/fa";

function HospitalCard({ report }) {
  if (!report) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          🏥 Recommended Hospital
        </h2>

        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          Best Match
        </span>
      </div>

      <div className="border rounded-2xl p-6">

        <div className="flex justify-between items-start">

          <div>

            <h3 className="text-2xl font-bold">
              {report.hospital}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-slate-500">
              <FaMapMarkerAlt />
              Jubilee Hills, Hyderabad
            </div>

          </div>

          <div className="flex items-center gap-2 text-yellow-500">

            <FaStar />

            <span className="font-bold text-black">
              4.8
            </span>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">

          <div className="bg-slate-100 rounded-xl p-4">

            <div className="flex items-center gap-2 text-blue-600">
              <FaClock />
              ETA
            </div>

            <h3 className="text-2xl font-bold mt-2">
              12 min
            </h3>

          </div>

          <div className="bg-slate-100 rounded-xl p-4">

            <div className="flex items-center gap-2 text-green-600">
              <FaUsers />
              Queue
            </div>

            <h3 className="text-2xl font-bold mt-2">
              14
            </h3>

          </div>

          <div className="bg-slate-100 rounded-xl p-4">

            <div className="flex items-center gap-2 text-red-500">
              <FaBed />
              Beds
            </div>

            <h3 className="text-2xl font-bold mt-2">
              8 Available
            </h3>

          </div>

          <div className="bg-slate-100 rounded-xl p-4">

            <div className="flex items-center gap-2 text-purple-600">
              <FaHospital />
              Department
            </div>

            <h3 className="text-lg font-bold mt-2">
              {report.department}
            </h3>

          </div>

        </div>

        <div className="flex gap-4 mt-8">

          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-2">

            <FaRoute />

            Navigate

          </button>

          <button className="flex-1 border border-slate-300 hover:bg-slate-100 py-4 rounded-xl font-semibold flex justify-center items-center gap-2">

            <FaPhoneAlt />

            Call

          </button>

        </div>

      </div>

    </div>
  );
}

export default HospitalCard;