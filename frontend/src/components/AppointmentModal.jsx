import { useState } from 'react';
import QRCode from 'react-qr-code';

const BOOK_URL = 'http://localhost:5000/api/appointments/book';

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function AppointmentModal({ isOpen, onClose, hospital, onBookSuccess }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenResult, setTokenResult] = useState(null);

  if (!isOpen || !hospital) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to book an appointment.');
      setLoading(false);
      return;
    }

    try {
      const dateTimeString = `${date}T${time}:00`;
      const res = await fetch(BOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          facilityId: hospital.id,
          appointmentDate: dateTimeString
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Appointment booking failed.');
      }

      setTokenResult(data.appointment);
      if (onBookSuccess) onBookSuccess(data.appointment);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error booking slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900 text-base">UHI Fulfillment Booking</h3>
            <p className="text-xs text-slate-500 mt-0.5">{hospital.facilityName}</p>
          </div>
          <button 
            onClick={() => {
              setTokenResult(null);
              setError('');
              setDate('');
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
            ⚠️ {error}
          </div>
        )}

        {!tokenResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select Date</label>
              <input 
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select Time Slot</label>
              <select 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="09:00">09:00 AM - Morning Slot</option>
                <option value="10:30">10:30 AM - Morning Slot</option>
                <option value="12:00">12:00 PM - Midday Slot</option>
                <option value="14:00">02:00 PM - Afternoon Slot</option>
                <option value="15:30">03:30 PM - Afternoon Slot</option>
                <option value="17:00">05:00 PM - Evening Slot</option>
              </select>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-800">
              ℹ️ Available beds capacity: <strong>{hospital.availableBeds} beds</strong> remaining. Slot capacity is updated in real-time.
            </div>

            <button 
              type="submit"
              disabled={loading || hospital.availableBeds <= 0}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-3 rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? <><Spinner /> Reserving Slot...</> : 'Confirm Slot & Get Token'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
              <span className="text-3xl">🎫</span>
              <h4 className="font-bold text-emerald-800 text-sm mt-2">Appointment Confirmed!</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">Your UHI Digital Token has been generated successfully.</p>
            </div>

            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 space-y-4 font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">UHI DIGITAL TOKEN</span>
                <span className="text-sm font-black text-indigo-600">{tokenResult.digitalToken}</span>
              </div>

              {/* Secure QR Code Representation */}
              <div className="flex justify-center p-2 bg-white border border-slate-200 rounded-xl max-w-[120px] mx-auto">
                <QRCode 
                  value={tokenResult.digitalToken} 
                  size={100} 
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-1 border-t border-slate-200/50">
                <div>
                  <p className="text-slate-400 font-semibold uppercase">Facility</p>
                  <p className="font-bold mt-0.5 truncate">{tokenResult.facility.facilityName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase">Date/Time</p>
                  <p className="font-bold mt-0.5">
                    {new Date(tokenResult.appointmentDate).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setTokenResult(null);
                setError('');
                setDate('');
                onClose();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
