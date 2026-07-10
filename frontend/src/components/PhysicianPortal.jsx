import { useState, useEffect } from 'react';

const SEARCH_URL = 'http://localhost:5000/api/physician/patients';
const VAULT_URL = (id) => `http://localhost:5000/api/physician/patient/${id}/vault`;
const NOTES_URL = (id) => `http://localhost:5000/api/physician/patient/${id}/notes`;

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function PhysicianPortal({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Selected Patient details
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vaultLogs, setVaultLogs] = useState([]);
  const [vaultLoading, setVaultLoading] = useState(false);

  // Consultation Notes
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Modal view for a specific prescription scan
  const [selectedScan, setSelectedScan] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(searchQuery.trim())}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.patients);
      }
    } catch (err) {
      console.error('[EHR Search] Error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setVaultLogs([]);
    setClinicalNotes([]);
    setNewNote('');

    const token = localStorage.getItem('token');
    
    // 1. Fetch prescription vault logs
    setVaultLoading(true);
    try {
      const res = await fetch(VAULT_URL(patient.id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVaultLogs(data.vaults);
      }
    } catch (err) {
      console.error('[EHR Vault] Error:', err);
    } finally {
      setVaultLoading(false);
    }

    // 2. Fetch historical clinical notes
    setNotesLoading(true);
    try {
      const res = await fetch(NOTES_URL(patient.id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setClinicalNotes(data.notes);
      }
    } catch (err) {
      console.error('[EHR Notes] Error:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedPatient) return;

    setSavingNote(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(NOTES_URL(selectedPatient.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: newNote.trim() })
      });
      const data = await res.json();

      if (data.success) {
        // Prepend new note to timeline
        setClinicalNotes([data.clinicalNote, ...clinicalNotes]);
        setNewNote('');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('[EHR Save Note]', err);
      alert(err.message || 'Error saving notes.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* ── EHR Header ──────────────────────────────────────────────────────── */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩺</span>
            <div>
              <h1 className="text-lg font-bold text-slate-100 leading-tight">
                Physician EHR Portal
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Dr. {user.name} · Clinic Auditor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-950 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-900">
              National Health Stack compliant
            </span>
            <button 
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-400 hover:text-red-400 transition cursor-pointer border border-slate-800 hover:border-red-900 px-3 py-1.5 rounded-xl bg-slate-950"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Search & Patients list */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-200">🔍 Patient Lookup</h2>
            
            <form onSubmit={handleSearch} className="space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or ABHA ID..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
              />
              <button
                type="submit"
                disabled={searching}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {searching ? <Spinner /> : 'Search Registry'}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-850 space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Search Results</p>
              
              {searchResults.length === 0 ? (
                <p className="text-xs text-slate-600 py-4 text-center">No patients searched.</p>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {searchResults.map((p) => {
                    const isSelected = selectedPatient && selectedPatient.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          isSelected 
                            ? 'bg-indigo-950/40 border-indigo-600 text-indigo-300' 
                            : 'bg-slate-900 border-slate-850 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <p className="font-bold">{p.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{p.email}</p>
                        {p.abhaId && (
                          <p className="text-[9px] text-emerald-500 font-mono mt-0.5">
                            ABHA: {p.abhaId.replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4')}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right Split: Audit Prescription & Notes */}
        <div className="lg:col-span-3">
          {!selectedPatient ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center min-h-[450px]">
              <span className="text-5xl">📁</span>
              <h3 className="font-bold text-slate-300 mt-4 text-base">Select a Patient to Audit</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm">Use the left sidebar search panel to retrieve a patient file from the national registry registry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Historical Notes & Add consultation note */}
              <div className="space-y-6">
                
                {/* Consultation Notes Form */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">✍️ Log Clinical Consultation</h3>
                  
                  <form onSubmit={handleSaveNote} className="space-y-3">
                    <textarea
                      rows={5}
                      required
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Write patient diagnosis, medication details, and clinical directives..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 resize-none transition"
                    />
                    <button
                      type="submit"
                      disabled={savingNote || !newNote.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-650 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {savingNote ? <Spinner /> : 'Save Visit Summary'}
                    </button>
                  </form>
                </div>

                {/* Consultation Timeline */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">📜 Historical Notes Timeline</h3>
                  
                  {notesLoading ? (
                    <div className="flex justify-center py-6">
                      <Spinner />
                    </div>
                  ) : clinicalNotes.length === 0 ? (
                    <p className="text-xs text-slate-600 py-6 text-center">No past visits recorded.</p>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                      {clinicalNotes.map((note) => (
                        <div key={note.id} className="bg-slate-900 border border-slate-850 rounded-xl p-3.5 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-500 font-bold">📅 {formatDate(note.createdAt)}</span>
                            <span className="text-indigo-400 font-semibold">Dr. {note.doctor?.name || 'Physician'}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{note.notes}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: ABHA Prescription Scans */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">🛡️ ABHA Prescription Audits</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Digitized prescription history and scanned drug interaction records.</p>
                </div>

                {vaultLoading ? (
                  <div className="flex justify-center py-12 flex-1 items-center">
                    <Spinner />
                  </div>
                ) : vaultLogs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 py-16">
                    <span className="text-3xl">🗄️</span>
                    <p className="text-xs mt-2 font-medium">Vault Empty</p>
                    <p className="text-[10px] text-slate-700 mt-0.5">This patient has no uploaded prescription scans.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 flex-1">
                    {vaultLogs.map((log) => {
                      const drugs = log.extractedJSON?.detectedDrugs || [];
                      const warnings = log.extractedJSON?.interactions?.warnings || [];
                      const risk = log.extractedJSON?.interactions?.overallRisk || 'NONE';

                      return (
                        <div key={log.id} className="bg-slate-900 border border-slate-850 rounded-xl p-3.5 space-y-3 relative group">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] text-slate-500 font-bold uppercase">📅 {formatDate(log.timestamp)}</span>
                              <h5 className="font-mono text-[9px] text-slate-400 mt-0.5">LOG #{log.id.substring(0, 8).toUpperCase()}</h5>
                            </div>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              risk === 'HIGH' ? 'bg-red-950/40 text-red-400 border-red-900/60' :
                              risk === 'MODERATE' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-900/60' :
                              'bg-emerald-950/40 text-emerald-400 border-emerald-900/60'
                            }`}>
                              Risk: {risk}
                            </span>
                          </div>

                          <div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">Drugs Found</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {drugs.map((drug, idx) => (
                                <span key={idx} className="bg-slate-850 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded text-[9px] font-medium">
                                  💊 {drug}
                                </span>
                              ))}
                            </div>
                          </div>

                          {warnings.length > 0 && (
                            <div className="bg-slate-950 border border-slate-850 rounded p-2 text-[9px] text-red-400 space-y-0.5">
                              <p className="font-bold">🚨 {warnings.length} Active Warnings</p>
                              <p className="text-slate-500 truncate">{warnings[0].message}</p>
                            </div>
                          )}

                          <button
                            onClick={() => setSelectedScan(log)}
                            className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                          >
                            🔍 Review Raw Text
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>
          )}
        </div>

      </main>

      {/* Raw Scan Modal */}
      {selectedScan && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto text-slate-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-100 text-base">Vault Prescription Log Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Scanned on {formatDate(selectedScan.timestamp)}</p>
              </div>
              <button 
                onClick={() => setSelectedScan(null)}
                className="text-slate-400 hover:text-slate-200 font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Detected Medications</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedScan.extractedJSON?.detectedDrugs || []).map((drug, i) => (
                  <span key={i} className="bg-indigo-950 text-indigo-300 border border-indigo-900 px-2.5 py-1 rounded-full text-xs font-medium">
                    💊 {drug}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pairwise Warnings</h4>
              {(selectedScan.extractedJSON?.interactions?.warnings || []).length > 0 ? (
                <div className="space-y-2">
                  {(selectedScan.extractedJSON.interactions.warnings).map((w, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-xs ${
                      w.severity === 'HIGH RISK' ? 'bg-red-950/30 border-red-900/60 text-red-300' : 'bg-yellow-950/30 border-yellow-900/60 text-yellow-300'
                    }`}>
                      <p className="font-bold">🚨 {w.pair.join(' + ')} ({w.severity})</p>
                      <p className="mt-1 opacity-90">{w.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-950/30 border border-emerald-900/60 text-emerald-300 text-xs rounded-xl p-3 flex gap-2">
                  <span>✅</span>
                  <p>No dangerous drug interactions identified.</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tesseract OCR Raw Text</h4>
              <pre className="bg-slate-950 border border-slate-850 rounded-lg p-3 text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-40">
                {selectedScan.ocrText || '(No transcription found)'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
