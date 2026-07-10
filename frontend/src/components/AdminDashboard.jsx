import { useState, useEffect } from 'react';

const HOSPITALS_URL = 'http://localhost:5000/api/hospitals';
const UPDATE_METRICS_URL = (id) => `http://localhost:5000/api/hospitals/${id}`;
const QUEUE_DASHBOARD_URL = 'http://localhost:5000/api/queue/dashboard';

const INITIAL_MOCK_DASHBOARD = {
  activeWaitingCount: 14,
  calledInCount: 3,
  divisions: {
    GENERAL_MEDICINE: [
      { id: '1', patientName: 'Nikhil Sen', symptoms: 'Fever and cold', urgencyLevel: 'GREEN', displayNumber: 'APO-GEN-05', state: 'CALLED_IN' },
      { id: '2', patientName: 'Harish V', symptoms: 'Severe stomach ache', urgencyLevel: 'YELLOW', displayNumber: 'APO-GEN-06', state: 'ACTIVE_WAITING' }
    ],
    CARDIOLOGY: [
      { id: '3', patientName: 'Rakesh', symptoms: 'Severe chest pain and palpitations', urgencyLevel: 'RED', displayNumber: 'KIM-CAR-01', state: 'ACTIVE_WAITING' },
      { id: '4', patientName: 'Suresh Kumar', symptoms: 'Shortness of breath', urgencyLevel: 'YELLOW', displayNumber: 'KIM-CAR-02', state: 'ACTIVE_WAITING' }
    ],
    TRAUMA: [
      { id: '5', patientName: 'Aditya Gupta', symptoms: 'Fractured wrist', urgencyLevel: 'YELLOW', displayNumber: 'YAS-TRA-01', state: 'CALLED_IN' }
    ]
  }
};

export default function AdminDashboard() {
  const [user] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: 'Admin' };
  });

  // Hospitals Capacity State
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bedsInput, setBedsInput] = useState(0);
  const [docsInput, setDocsInput] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Queue Live Feed State
  const [stats, setStats] = useState({ waiting: 0, active: 0 });
  const [divisions, setDivisions] = useState({});
  const [queueLoading, setQueueLoading] = useState(true);

  // Load hospitals
  const loadHospitals = async () => {
    try {
      const res = await fetch(HOSPITALS_URL);
      const data = await res.json();
      if (data.success) {
        setHospitals(data.hospitals);
        if (data.hospitals.length > 0) {
          // Select first hospital by default
          setSelectedHospital(data.hospitals[0]);
          setBedsInput(data.hospitals[0].availableBeds);
          setDocsInput(data.hospitals[0].activeDoctorCount);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Load hospitals error:', err);
    }
  };

  // Load Queue dashboard feed
  const loadQueueData = async () => {
    try {
      const res = await fetch(QUEUE_DASHBOARD_URL);
      const data = await res.json();
      if (data.success && data.source !== 'mock_fallback') {
        setStats({
          waiting: data.activeWaitingCount,
          active: data.calledInCount
        });
        setDivisions(data.divisions || {});
      } else {
        throw new Error('Using fallback');
      }
    } catch (err) {
      setStats({
        waiting: INITIAL_MOCK_DASHBOARD.activeWaitingCount,
        active: INITIAL_MOCK_DASHBOARD.calledInCount
      });
      setDivisions(INITIAL_MOCK_DASHBOARD.divisions);
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
    loadQueueData();
    const interval = setInterval(loadQueueData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setBedsInput(hospital.availableBeds);
    setDocsInput(hospital.activeDoctorCount);
    setMessage('');
  };

  const handleUpdateMetrics = async (e) => {
    e.preventDefault();
    if (!selectedHospital) return;

    setUpdating(true);
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(UPDATE_METRICS_URL(selectedHospital.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          availableBeds: bedsInput,
          activeDoctorCount: docsInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Registry capacities updated successfully!');
        // Update local hospitals list state
        setHospitals(hospitals.map(h => h.id === selectedHospital.id ? { 
          ...h, 
          availableBeds: parseInt(bedsInput, 10), 
          activeDoctorCount: parseInt(docsInput, 10) 
        } : h));
      } else {
        throw new Error(data.message || 'Metrics update failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  // Compile queue list across divisions
  const allTokens = [];
  Object.entries(divisions).forEach(([divName, list]) => {
    list.forEach(item => {
      allTokens.push({ ...item, division: divName });
    });
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* ── Admin Dashboard Header ─────────────────────────────────────────── */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <div>
              <h1 className="text-lg font-bold text-slate-100 leading-tight">
                Hospital Registry Controller
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Admin: {user.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-900">
              ABDM Registry Administrator
            </span>
            <button 
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-400 hover:text-red-400 transition cursor-pointer border border-slate-850 hover:border-red-900 px-3 py-1.5 rounded-xl bg-slate-950"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Panel Grid ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Hospital Selection & Capacity Metrics Panel */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Select Hospital */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Medical Facility</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {hospitals.map(h => (
                <button
                  key={h.id}
                  onClick={() => handleSelectHospital(h)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                    selectedHospital && selectedHospital.id === h.id
                      ? 'bg-indigo-950/40 border-indigo-600 text-indigo-300'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-750'
                  }`}
                >
                  <p className="font-bold">{h.facilityName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{h.physicalStreet}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Metrics Form */}
          {selectedHospital && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">📊 Registry Capacity Controls</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Edit available slots matching the ABHA directory</p>
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-xs border ${
                  message.startsWith('✅') ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' : 'bg-red-950/40 border-red-900/60 text-red-300'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleUpdateMetrics} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Available Beds</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={bedsInput}
                    onChange={(e) => setBedsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Active Doctor Registry Count</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={docsInput}
                    onChange={(e) => setDocsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-600 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {updating ? 'Updating Supabase...' : 'Save Metrics Changes'}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right 2 Columns: Lobby Monitor Queue Live Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span className="animate-pulse h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                🏢 Lobby Feed Monitor
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time outpatient lobby registry flow and queue division loads.</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] shrink-0 font-semibold bg-slate-950 p-1 rounded-xl border border-slate-855">
              <div className="px-3.5 py-1 bg-slate-900 rounded-lg">
                <span className="text-slate-500 block">Waiting</span>
                <span className="text-slate-200 font-bold text-xs">{stats.waiting}</span>
              </div>
              <div className="px-3.5 py-1 bg-slate-900 rounded-lg">
                <span className="text-slate-500 block">Active</span>
                <span className="text-indigo-400 font-bold text-xs">{stats.active}</span>
              </div>
              <div className="px-3.5 py-1 bg-slate-900 rounded-lg">
                <span className="text-slate-500 block">Total</span>
                <span className="text-slate-200 font-bold text-xs">{stats.waiting + stats.active}</span>
              </div>
            </div>
          </div>

          {queueLoading ? (
            <div className="flex justify-center items-center py-20 flex-1">
              <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : allTokens.length === 0 ? (
            <div className="py-20 text-center text-slate-600 flex-1 flex flex-col justify-center items-center">
              <span className="text-4xl">📋</span>
              <p className="text-xs mt-2 font-medium">Lobby Empty</p>
              <p className="text-[10px] text-slate-700 mt-0.5">No outpatient tickets currently active.</p>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Token</th>
                    <th className="pb-3 px-2">Patient</th>
                    <th className="pb-3 px-2">Division</th>
                    <th className="pb-3 px-2">Triage</th>
                    <th className="pb-3 pl-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {allTokens.map((t, idx) => (
                    <tr key={t.id || idx} className="hover:bg-slate-950/30 transition">
                      <td className="py-3 pr-2 font-mono text-indigo-400 font-bold">{t.displayNumber}</td>
                      <td className="py-3 px-2 font-semibold text-slate-200">{t.patientName || 'Anonymous'}</td>
                      <td className="py-3 px-2 text-slate-400 font-medium">{t.division.replace('_', ' ')}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase
                          ${t.urgencyLevel === 'RED' ? 'bg-red-950/40 text-red-400 border border-red-900/40' :
                            t.urgencyLevel === 'YELLOW' ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/40' :
                                                         'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'}`}>
                          {t.urgencyLevel || 'GREEN'}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase
                          ${t.state === 'CALLED_IN' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-850 text-slate-500'}`}>
                          {t.state === 'CALLED_IN' ? 'Exam Room' : 'Waiting'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
