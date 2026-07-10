import { useState, useEffect } from 'react';

const UPDATE_STATUS_URL = 'http://localhost:5000/api/queue/update-status';
const DASHBOARD_URL = 'http://localhost:5000/api/queue/dashboard';

const INITIAL_MOCK_QUEUE = [
  { id: 'tok-1', name: 'Rakesh', symptoms: 'Severe chest pain and palpitations', urgency: 'RED', token: 'KIM-CAR-01', state: 'ACTIVE_WAITING' },
  { id: 'tok-2', name: 'Suresh Kumar', symptoms: 'Shortness of breath, mild pressure', urgency: 'YELLOW', token: 'KIM-CAR-02', state: 'ACTIVE_WAITING' },
  { id: 'tok-3', name: 'Anitha Rao', symptoms: 'Chronic heart arrhythmia checkup', urgency: 'GREEN', token: 'KIM-CAR-03', state: 'ACTIVE_WAITING' }
];

export default function DoctorConsole() {
  const [queue, setQueue] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadQueue() {
      try {
        const res = await fetch(DASHBOARD_URL);
        const data = await res.json();
        
        // In this doctor console, we represent KIMS Cardiology (Dr. Anil Reddy)
        // Extract cardiology queue from dashboard
        const cardiologyQueue = data.divisions?.CARDIOLOGY || [];
        
        if (cardiologyQueue.length === 0) {
          throw new Error('No DB patients');
        }

        // Map DB results to console structure
        const mappedQueue = cardiologyQueue.map((t, idx) => ({
          id: t.id || `db-tok-${idx}`,
          name: t.patientName || (idx === 0 ? 'Rakesh' : `Patient #${idx + 1}`),
          symptoms: t.symptoms || 'Cardiac consultation',
          urgency: t.urgencyLevel || 'YELLOW',
          token: t.displayNumber,
          state: t.state
        }));

        const calledIn = mappedQueue.find(p => p.state === 'CALLED_IN');
        const waiting = mappedQueue.filter(p => p.state === 'ACTIVE_WAITING');
        
        if (calledIn) setActivePatient(calledIn);
        setQueue(waiting);
      } catch (err) {
        // Load initial mock queue if DB is empty or fails
        setActivePatient(null);
        setQueue(INITIAL_MOCK_QUEUE);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, []);

  const handleCallPatient = async (patient) => {
    setActionLoading(true);
    try {
      await fetch(UPDATE_STATUS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: patient.id, status: 'CALLED_IN' })
      });
      
      // Update local state
      const updated = { ...patient, state: 'CALLED_IN' };
      setActivePatient(updated);
      setQueue(prev => prev.filter(p => p.id !== patient.id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConclude = async () => {
    if (!activePatient) return;
    setActionLoading(true);
    try {
      await fetch(UPDATE_STATUS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: activePatient.id, status: 'CONCLUDED' })
      });
      
      // Add to completed list
      setCompletedPatients(prev => [activePatient, ...prev]);
      setActivePatient(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCallNext = () => {
    if (queue.length > 0) {
      const next = queue[0];
      handleCallPatient(next);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans py-12">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-widest uppercase">
              👨‍⚕️ Doctor Console
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Dr. Anil Reddy
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              KIMS Hospitals · Cardiology Division (Live Queue Feed)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Active Duty</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading live clinical feeds...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Active Patient & Queue */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Active Patient Card */}
              <div className="bg-gradient-to-r from-indigo-950/20 to-slate-900/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
                
                <h3 className="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-4">
                  Current Active Consultation
                </h3>

                {activePatient ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black text-white">{activePatient.name}</h2>
                        <p className="text-xs text-slate-400 mt-1 font-mono">{activePatient.token}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase 
                        ${activePatient.urgency === 'RED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          activePatient.urgency === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                               'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                        {activePatient.urgency}
                      </span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300">
                      <p className="font-semibold text-slate-400 text-xs uppercase tracking-wider mb-1">Chief Complaint:</p>
                      "{activePatient.symptoms}"
                    </div>

                    <button
                      onClick={handleConclude}
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 cursor-pointer"
                    >
                      {actionLoading ? 'Saving...' : '✅ Conclude Consultation & Discharge'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">No patient is currently in the examination room.</p>
                    <button
                      onClick={handleCallNext}
                      disabled={queue.length === 0 || actionLoading}
                      className="mt-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs py-2.5 px-6 rounded-xl transition cursor-pointer disabled:opacity-40"
                    >
                      📢 Call Next Patient
                    </button>
                  </div>
                )}
              </div>

              {/* Waiting Patients List */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">
                  Waiting Queue ({queue.length})
                </h3>

                {queue.length === 0 ? (
                  <p className="text-center py-8 text-slate-600 text-sm">No patients waiting in queue.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {queue.map((patient, index) => (
                      <div key={patient.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-indigo-300">{patient.token}</span>
                            <span className="font-bold text-white text-sm truncate">{patient.name}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 truncate">"{patient.symptoms}"</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider
                            ${patient.urgency === 'RED' ? 'bg-red-500/20 text-red-300' :
                              patient.urgency === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-300' :
                                                           'bg-emerald-500/20 text-emerald-300'}`}>
                            {patient.urgency}
                          </span>
                          <button
                            onClick={() => handleCallPatient(patient)}
                            disabled={!!activePatient || actionLoading}
                            className="bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-indigo-300 transition cursor-pointer disabled:opacity-30"
                          >
                            Call In
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: History & Live Stats */}
            <div className="space-y-6">
              
              {/* Daily Statistics */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-xl">
                <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">
                  Live Stats
                </h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-500 text-[10px] uppercase">Waiting</p>
                    <p className="text-white text-2xl font-black mt-0.5">{queue.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-500 text-[10px] uppercase">Completed</p>
                    <p className="text-white text-2xl font-black mt-0.5">{completedPatients.length}</p>
                  </div>
                </div>
              </div>

              {/* Completed Consultations */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-xl">
                <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">
                  Completed Today
                </h3>
                
                {completedPatients.length === 0 ? (
                  <p className="text-slate-600 text-xs text-center py-6">No patients completed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {completedPatients.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white/5 rounded-xl p-3 border border-white/5">
                        <div>
                          <p className="font-bold text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{p.token}</p>
                        </div>
                        <span className="text-emerald-400 font-semibold">Concluded</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
