import { useState, useEffect } from 'react';

const DASHBOARD_URL = 'http://localhost:5000/api/queue/dashboard';

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
    ],
    NEUROLOGY: [],
    EMERGENCY: [],
    ORTHOPEDICS: []
  }
};

export default function ReceptionistConsole() {
  const [stats, setStats] = useState({ waiting: 0, active: 0 });
  const [divisions, setDivisions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(DASHBOARD_URL);
        const data = await res.json();
        
        if (!data.success || data.source === 'mock_fallback') {
          throw new Error('Using fallback');
        }

        setStats({
          waiting: data.activeWaitingCount,
          active: data.calledInCount
        });
        setDivisions(data.divisions || {});
      } catch (err) {
        // Load fallback static data
        setStats({
          waiting: INITIAL_MOCK_DASHBOARD.activeWaitingCount,
          active: INITIAL_MOCK_DASHBOARD.calledInCount
        });
        setDivisions(INITIAL_MOCK_DASHBOARD.divisions);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5s for real-time live updates!
    return () => clearInterval(interval);
  }, []);

  // Gather all tokens across all departments to show a unified log list
  const allTokens = [];
  Object.entries(divisions).forEach(([divName, list]) => {
    list.forEach(item => {
      allTokens.push({
        ...item,
        division: divName
      });
    });
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans py-12">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-widest uppercase">
              🏢 Reception Live Feed
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Central Hospital Lobby Feed
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live outpatient token flow, triage division routing, and status registry.
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LOBBY MONITOR ACTIVE
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Syncing lobby queue ticket registries...
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Live Metrics Header Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Lobby Waiting</p>
                <p className="text-4xl font-black text-white mt-1">{stats.waiting}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active In Consultation</p>
                <p className="text-4xl font-black text-indigo-300 mt-1">{stats.active}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Lobby Load</p>
                <p className="text-4xl font-black text-white mt-1">{stats.waiting + stats.active}</p>
              </div>
            </div>

            {/* Lobby List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left 2 Columns: Lobby Registry */}
              <div className="md:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📋</span> Active Queue Tickets
                </h2>
                
                {allTokens.length === 0 ? (
                  <p className="text-center py-10 text-slate-500 text-sm">No outpatient tickets currently active.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="pb-3 pr-2">Token</th>
                          <th className="pb-3 px-2">Patient</th>
                          <th className="pb-3 px-2">Division</th>
                          <th className="pb-3 px-2">Triage</th>
                          <th className="pb-3 pl-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allTokens.map((t, idx) => (
                          <tr key={t.id || idx} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 pr-2 font-mono text-indigo-300 font-bold">{t.displayNumber}</td>
                            <td className="py-3 px-2 font-semibold text-white">{t.patientName || 'Anonymous'}</td>
                            <td className="py-3 px-2 text-slate-400 font-medium">{t.division.replace('_', ' ')}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase
                                ${t.urgencyLevel === 'RED' ? 'bg-red-500/20 text-red-300' :
                                  t.urgencyLevel === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-300' :
                                                               'bg-emerald-500/20 text-emerald-300'}`}>
                                {t.urgencyLevel || 'GREEN'}
                              </span>
                            </td>
                            <td className="py-3 pl-2 text-right">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase
                                ${t.state === 'CALLED_IN' ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
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

              {/* Right Column: Division Load Breakdown */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📊</span> Division Load
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(divisions).map(([divName, list]) => {
                    const count = list.length;
                    const calledIn = list.filter(t => t.state === 'CALLED_IN').length;
                    return (
                      <div key={divName} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                        <div>
                          <p className="font-bold text-white tracking-wider">{divName.replace('_', ' ')}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{calledIn} in-consultation</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-white">{count}</span>
                          <span className="text-[10px] text-slate-500 block">tickets</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
