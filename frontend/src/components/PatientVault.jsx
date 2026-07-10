import { useState, useEffect } from 'react';

const VAULT_URL = 'http://localhost:5000/api/prescriptions/vault';

export default function PatientVault() {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVault, setSelectedVault] = useState(null);

  const fetchVault = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view your vault.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(VAULT_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVaults(data.vaults);
      } else {
        throw new Error(data.message || 'Failed to fetch vault items.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">🛡️ ABHA Digital Prescription Vault</h2>
          <p className="text-xs text-slate-500 mt-1">Access your securely saved clinical scans and drug interaction logs.</p>
        </div>
        <button 
          onClick={fetchVault}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer flex items-center gap-1.5"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-xs font-medium">Loading vault logs...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-4">
          ⚠️ {error}
        </div>
      ) : vaults.length === 0 ? (
        <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-12 text-center">
          <span className="text-4xl">🗄️</span>
          <h3 className="font-bold text-slate-700 mt-3 text-sm">Your Vault is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Upload a prescription in the OCR Digitizer tab and click "Save to Vault" to see your logs here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaults.map((vault) => {
            const drugs = vault.extractedJSON?.detectedDrugs || [];
            const warnings = vault.extractedJSON?.interactions?.warnings || [];
            const risk = vault.extractedJSON?.interactions?.overallRisk || 'NONE';

            return (
              <div 
                key={vault.id}
                className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition flex flex-col space-y-3 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
                      📅 {formatDate(vault.timestamp)}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs mt-0.5 truncate max-w-[220px]">
                      Record #{vault.id.substring(0, 8).toUpperCase()}
                    </h4>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    risk === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                    risk === 'MODERATE' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}>
                    Risk: {risk}
                  </span>
                </div>

                {/* Drugs list */}
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Drugs Extracted</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {drugs.map((drug, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200/50 px-2 py-0.5 rounded text-[10px] font-medium">
                        💊 {drug}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Warnings preview */}
                {warnings.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-1">
                    <p className="text-[9px] text-red-600 font-bold uppercase flex items-center gap-1">
                      <span>🚨</span> {warnings.length} Interaction Warning(s)
                    </p>
                    <p className="text-[10px] text-slate-600 truncate">
                      {warnings[0].pair.join(' + ')}: {warnings[0].message}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedVault(vault)}
                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                  >
                    🔍 View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedVault && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">ABHA Vault Log Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scanned on {formatDate(selectedVault.timestamp)}</p>
              </div>
              <button 
                onClick={() => setSelectedVault(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Extracted Drugs */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detected Medications</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedVault.extractedJSON?.detectedDrugs || []).map((drug, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full text-xs font-medium">
                    💊 {drug}
                  </span>
                ))}
              </div>
            </div>

            {/* Interaction Warnings */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pairwise Interactions</h4>
              {(selectedVault.extractedJSON?.interactions?.warnings || []).length > 0 ? (
                <div className="space-y-2">
                  {(selectedVault.extractedJSON.interactions.warnings).map((w, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-xs ${
                      w.severity === 'HIGH RISK' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}>
                      <p className="font-bold">🚨 {w.pair.join(' + ')} ({w.severity})</p>
                      <p className="mt-1 opacity-90">{w.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-3 flex gap-2">
                  <span>✅</span>
                  <p>No dangerous drug interactions identified.</p>
                </div>
              )}
            </div>

            {/* Raw OCR Text */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Raw Transcription Text</h4>
              <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[10px] text-slate-600 font-mono overflow-x-auto whitespace-pre-wrap max-h-40">
                {selectedVault.ocrText || '(No transcription found)'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
