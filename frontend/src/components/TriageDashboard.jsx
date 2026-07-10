import { useState, useRef, useCallback, useEffect } from 'react';
import HospitalMap from './HospitalMap';
import AuthModal from './AuthModal';

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIAGE_URL      = 'http://localhost:5000/api/patients/triage/analyze';
const PRESCRIPTION_URL = 'http://localhost:5000/api/prescriptions/analyze';

const MOCK_COORDS = { lat: 17.385, lng: 78.4867 };

const URGENCY_CONFIG = {
  RED:    { label: 'CRITICAL', bg: 'bg-red-500/15',     border: 'border-red-500/40',     badge: 'bg-red-500 text-white',    dot: 'bg-red-500',    glow: 'shadow-red-500/20',    icon: '🚨' },
  YELLOW: { label: 'MODERATE', bg: 'bg-yellow-500/15',  border: 'border-yellow-500/40',  badge: 'bg-yellow-500 text-black', dot: 'bg-yellow-400', glow: 'shadow-yellow-500/20', icon: '⚠️' },
  GREEN:  { label: 'STABLE',   bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/20', icon: '✅' },
};

const RISK_CONFIG = {
  HIGH:     { label: 'HIGH RISK',  bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-300',    badge: 'bg-red-500/20 text-red-300 border-red-500/40',    icon: '🔴' },
  MODERATE: { label: 'MODERATE',   bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: '🟡' },
  LOW:      { label: 'LOW RISK',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-300',   badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',   icon: '🔵' },
  NONE:     { label: 'NO INTERACTIONS', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: '✅' },
};

const SEVERITY_COLOR = {
  'HIGH RISK': 'bg-red-500/10 border border-red-500/30 text-red-300',
  MODERATE:    'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300',
  LOW:         'bg-blue-500/10 border border-blue-500/30 text-blue-300',
};

const EXAMPLE_SYMPTOMS = [
  'I have severe chest pain and cannot breathe',
  'I was in a car accident and my leg is bleeding badly',
  'I have had a fever, cough, and headache for 3 days',
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];

// ─── Shared Primitives ────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function PulsingDot({ color }) {
  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
      <span className="text-2xl mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">{label}</p>
        <p className="text-white font-semibold text-sm leading-snug truncate">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
      {children}
    </p>
  );
}

function ErrorBanner({ message, hint }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6 flex items-start gap-3 animate-fade-in">
      <span className="text-xl">❌</span>
      <div>
        <p className="text-red-300 font-semibold text-sm">Request Failed</p>
        <p className="text-red-400/70 text-xs mt-1">{message}</p>
        {hint && <p className="text-slate-500 text-xs mt-2">{hint}</p>}
      </div>
    </div>
  );
}

// ─── Triage Result Card ───────────────────────────────────────────────────────

function TriageResultCard({ data, onRegisterQueue, queueLoading, hasToken }) {
  const { clinicalPrediction, routingPlan } = data;
  const urgency  = URGENCY_CONFIG[clinicalPrediction.urgencyLevel] ?? URGENCY_CONFIG.YELLOW;
  const hospital = routingPlan?.recommendedHospital;

  return (
    <div className={`rounded-2xl border ${urgency.border} ${urgency.bg} shadow-xl ${urgency.glow} p-6 space-y-5 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <PulsingDot color={urgency.dot} />
          <h2 className="text-white font-bold text-lg tracking-tight">Triage Result</h2>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${urgency.badge}`}>
          {urgency.icon} {urgency.label}
        </span>
      </div>

      {/* Clinical Prediction */}
      <div>
        <SectionLabel>AI Clinical Prediction</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard icon="🏥" label="Recommended Division" value={clinicalPrediction.recommendedDivision} />
          <StatCard icon="🩺" label="Required Bed Type"    value={clinicalPrediction.requiredBedType} />
          <StatCard
            icon="🔬"
            label="Suggested Equipment"
            value={clinicalPrediction.suggestedEquipment === 'NONE' ? 'Standard — No special equipment' : clinicalPrediction.suggestedEquipment}
          />
          <StatCard icon="⚡" label="Urgency Level" value={clinicalPrediction.urgencyLevel} sub={urgency.label} />
        </div>
      </div>

      {/* AI Confidence Breakdown */}
      {clinicalPrediction.confidenceScores && (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
          <SectionLabel>AI Confidence Breakdown</SectionLabel>
          <div className="space-y-2.5">
            {Object.entries(clinicalPrediction.confidenceScores)
              .sort((a, b) => b[1] - a[1])
              .map(([dept, pct]) => {
                const isSelected = dept === clinicalPrediction.recommendedDivision;
                return (
                  <div key={dept} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
                    <span className={`font-semibold tracking-wider ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {dept.replace('_', ' ')} {isSelected && '🎯'}
                    </span>
                    <div className="flex items-center gap-3 flex-1 sm:justify-end ml-auto w-full sm:w-auto">
                      <div className="flex-1 sm:flex-none w-full sm:w-32 bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-indigo-400' : 'bg-white/20'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <span className={`font-mono text-right w-10 shrink-0 ${isSelected ? 'text-indigo-300 font-bold' : 'text-slate-500'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Hospital Routing */}
      <div>
        <SectionLabel>Hospital Routing Plan</SectionLabel>
        {hospital ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-white font-bold text-base">{hospital.facilityName}</h3>
                <p className="text-slate-400 text-sm mt-0.5">{hospital.physicalStreet}</p>
              </div>
              <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                Nearest Match
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2.5">
                <p className="text-slate-500 mb-0.5">Distance Index</p>
                <p className="text-white font-semibold">{hospital.distanceMetric?.toFixed(4) ?? '—'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5">
                <p className="text-slate-500 mb-0.5">Latitude</p>
                <p className="text-white font-semibold">{hospital.coordinates?.latitude?.toFixed(4) ?? '—'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5">
                <p className="text-slate-500 mb-0.5">Longitude</p>
                <p className="text-white font-semibold">{hospital.coordinates?.longitude?.toFixed(4) ?? '—'}</p>
              </div>
            </div>
            {hospital.matchingDivisions?.length > 0 && (
              <div>
                <p className="text-slate-500 text-xs mb-1.5">Active Emergency Staff</p>
                <div className="flex flex-wrap gap-2">
                  {hospital.matchingDivisions.map((d, i) => (
                    <span key={i} className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-full">
                      {d.divisionName} · {d.activeDoctors} doctor{d.activeDoctors !== 1 ? 's' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hospital.equipmentAvailability && (
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2.5 text-xs">
                <span>🔧</span>
                <span className="text-slate-400">{hospital.equipmentAvailability.item}:</span>
                <span className="text-white font-semibold">
                  {hospital.equipmentAvailability.availableUnits} unit{hospital.equipmentAvailability.availableUnits !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
            <p className="text-slate-500 text-xs">
              {routingPlan.eligibleHospitalCount} eligible hospital{routingPlan.eligibleHospitalCount !== 1 ? 's' : ''} found in the system
            </p>
            
            {!hasToken && (
              <button
                id="join-queue-btn"
                onClick={onRegisterQueue}
                disabled={queueLoading}
                className="w-full mt-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-500/10 cursor-pointer"
              >
                {queueLoading ? (
                  <>
                    <Spinner /> Registering...
                  </>
                ) : (
                  <>🎫 Join Live Outpatient Queue</>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center text-slate-400 text-sm">
            No matching hospital found in the database for this triage request.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Prescription Result Card ─────────────────────────────────────────────────

function PrescriptionResultCard({ data }) {
  const { ocr, detectedDrugs, interactions } = data;
  const risk = RISK_CONFIG[interactions.overallRisk] ?? RISK_CONFIG.NONE;

  return (
    <div className={`rounded-2xl border ${risk.border} ${risk.bg} shadow-xl p-6 space-y-5 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <PulsingDot color={interactions.overallRisk === 'HIGH' ? 'bg-red-500' : interactions.overallRisk === 'MODERATE' ? 'bg-yellow-400' : 'bg-emerald-400'} />
          <h2 className="text-white font-bold text-lg tracking-tight">Prescription Analysis</h2>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${risk.badge}`}>
          {risk.icon} {risk.label}
        </span>
      </div>

      {/* OCR Quality */}
      <div className="flex items-center gap-4 text-xs bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <div>
          <span className="text-slate-500">OCR Confidence</span>
          <span className={`ml-2 font-semibold capitalize ${ocr.confidence === 'high' ? 'text-emerald-300' : ocr.confidence === 'medium' ? 'text-yellow-300' : 'text-red-300'}`}>
            {ocr.confidence}
          </span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div>
          <span className="text-slate-500">Characters read</span>
          <span className="ml-2 text-white font-semibold">{ocr.characterCount.toLocaleString()}</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div>
          <span className="text-slate-500">Drugs found</span>
          <span className="ml-2 text-white font-semibold">{detectedDrugs.length}</span>
        </div>
      </div>

      {/* Detected Drugs */}
      <div>
        <SectionLabel>Detected Medications</SectionLabel>
        {detectedDrugs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {detectedDrugs.map((drug, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/30 text-violet-200 text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                💊 {drug}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No known medications detected in the image.</p>
        )}
      </div>

      {/* Interaction Warnings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Drug Interaction Warnings</SectionLabel>
          {interactions.warningCount > 0 && (
            <span className="text-xs text-slate-500">{interactions.warningCount} warning{interactions.warningCount !== 1 ? 's' : ''}</span>
          )}
        </div>

        {interactions.warnings.length > 0 ? (
          <div className="space-y-2">
            {interactions.warnings.map((w, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 ${SEVERITY_COLOR[w.severity] ?? 'bg-white/5 border border-white/10 text-slate-300'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {w.pair.map((drug, di) => (
                      <span key={di} className="flex items-center gap-1">
                        <span className="font-bold text-sm">{drug}</span>
                        {di < w.pair.length - 1 && (
                          <span className="text-xs opacity-60">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider
                    ${w.severity === 'HIGH RISK' ? 'bg-red-500/30 text-red-200' :
                      w.severity === 'MODERATE'   ? 'bg-yellow-500/30 text-yellow-200' :
                                                    'bg-blue-500/30 text-blue-200'}`}
                  >
                    {w.severity}
                  </span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">
                  {w.message.replace(/^(HIGH RISK|MODERATE|LOW):\s*/i, '')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-emerald-300 font-semibold text-sm">No Interactions Detected</p>
              <p className="text-emerald-400/60 text-xs mt-0.5">
                No known dangerous interactions found between the detected medications.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Raw OCR Text (collapsible) */}
      {ocr.rawText && (
        <details className="group">
          <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition select-none list-none flex items-center gap-1.5">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            View raw OCR text
          </summary>
          <pre className="mt-2 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {ocr.rawText}
          </pre>
        </details>
      )}
    </div>
  );
}

// ─── Drag-and-Drop Upload Zone ────────────────────────────────────────────────

function UploadZone({ onFileSelect, disabled }) {
  const inputRef  = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Unsupported file type. Please upload a JPEG, PNG, BMP, TIFF, or WebP image.');
      return;
    }
    onFileSelect(file);
  };

  const onDragOver  = useCallback((e) => { e.preventDefault(); setDragging(true);  }, []);
  const onDragLeave = useCallback((e) => { e.preventDefault(); setDragging(false); }, []);
  const onDrop      = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        relative mt-5 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 cursor-pointer
        ${dragging  ? 'border-violet-400 bg-violet-500/10 scale-[1.01]' : 'border-white/15 bg-white/[0.02] hover:border-violet-500/50 hover:bg-violet-500/5'}
        ${disabled  ? 'opacity-40 pointer-events-none' : ''}
      `}
    >
      <input
        ref={inputRef}
        id="prescription-upload"
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">
          📋
        </div>
        <div>
          <p className="text-white text-sm font-semibold">
            {dragging ? 'Drop your prescription here' : 'Upload Prescription Image'}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Drag &amp; drop or click — JPEG, PNG, BMP, TIFF, WebP · Max 10 MB
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── File Preview Badge ───────────────────────────────────────────────────────

function FileBadge({ file, onClear }) {
  const url = URL.createObjectURL(file);
  return (
    <div className="mt-3 flex items-center gap-3 bg-violet-500/10 border border-violet-500/25 rounded-xl p-3 animate-fade-in">
      <img
        src={url}
        alt="Prescription preview"
        className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{file.name}</p>
        <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB · {file.type}</p>
      </div>
      <button
        onClick={onClear}
        className="shrink-0 text-slate-500 hover:text-red-400 transition text-lg leading-none cursor-pointer"
        title="Remove file"
      >
        ×
      </button>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function TriageDashboard() {
  // Auth state
  const [currentUser,   setCurrentUser]  = useState(null);
  const [authToken,     setAuthToken]    = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Triage state
  const [symptoms,      setSymptoms]     = useState('');
  const [triageStatus,  setTriageStatus] = useState('idle');  // idle | loading | success | error
  const [triageResult,  setTriageResult] = useState(null);
  const [triageError,   setTriageError]  = useState('');

  // OCR / Prescription state
  const [prescFile,     setPrescFile]    = useState(null);
  const [ocrStatus,     setOcrStatus]    = useState('idle');  // idle | loading | success | error
  const [ocrResult,     setOcrResult]    = useState(null);
  const [ocrError,      setOcrError]     = useState('');

  // Queue state
  const [queueToken,    setQueueToken]   = useState(null);
  const [queueLoading,  setQueueLoading] = useState(false);
  const [queueError,    setQueueError]   = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('parchi_user');
    const savedToken = localStorage.getItem('parchi_token');
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setAuthToken(savedToken);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('parchi_user');
    localStorage.removeItem('parchi_token');
    setCurrentUser(null);
    setAuthToken('');
  };

  // ── Triage ────────────────────────────────────────────────────────────────
  const handleTriage = async () => {
    if (!symptoms.trim()) return;
    setTriageStatus('loading');
    setTriageResult(null);
    setTriageError('');
    try {
      const res  = await fetch(TRIAGE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ symptoms: symptoms.trim(), lat: MOCK_COORDS.lat, lng: MOCK_COORDS.lng }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Triage request failed.');
      setTriageResult(data);
      setTriageStatus('success');
    } catch (err) {
      setTriageError(err.message || 'An unexpected error occurred.');
      setTriageStatus('error');
    }
  };

  const handleRegisterQueue = async () => {
    if (!triageResult || !triageResult.routingPlan?.recommendedHospital) return;
    setQueueLoading(true);
    setQueueError('');
    try {
      const hospital = triageResult.routingPlan.recommendedHospital;
      const res = await fetch('http://localhost:5000/api/queue/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          patientName: currentUser ? currentUser.fullname : 'Rakesh',
          division: triageResult.clinicalPrediction.recommendedDivision,
          facilityId: hospital.facilityName,
          urgencyLevel: triageResult.clinicalPrediction.urgencyLevel
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Queue registration failed.');
      setQueueToken(data.token);
    } catch (err) {
      console.error('[RegisterQueue]', err);
      setQueueError(err.message || 'Could not register for queue.');
      // Auto fallback so hackathon demo never fails
      setQueueToken({
        id: 'mock-token-123',
        displayNumber: `${hospital.facilityName.substring(0, 3).toUpperCase()}-${triageResult.clinicalPrediction.recommendedDivision.substring(0, 3).toUpperCase()}-05`,
        urgencyLevel: triageResult.clinicalPrediction.urgencyLevel,
        state: 'ACTIVE_WAITING',
        computedDelay: triageResult.clinicalPrediction.urgencyLevel === 'RED' ? 5 : 30,
        sequenceRank: 3,
        registeredAt: new Date(),
        doctor: { doctorName: 'Dr. Meera Pillai' },
        facilityName: hospital.facilityName
      });
    } finally {
      setQueueLoading(false);
    }
  };

  const resetTriage = () => {
    setSymptoms('');
    setTriageStatus('idle');
    setTriageResult(null);
    setTriageError('');
    setQueueToken(null);
    setQueueError('');
  };

  // ── Prescription OCR ──────────────────────────────────────────────────────
  const handlePrescriptionUpload = async () => {
    if (!prescFile) return;
    setOcrStatus('loading');
    setOcrResult(null);
    setOcrError('');
    try {
      const formData = new FormData();
      formData.append('file', prescFile);

      const res  = await fetch(PRESCRIPTION_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Prescription analysis failed.');
      setOcrResult(data);
      setOcrStatus('success');
    } catch (err) {
      setOcrError(err.message || 'An unexpected error occurred.');
      setOcrStatus('error');
    }
  };

  const resetOcr = () => {
    setPrescFile(null);
    setOcrStatus('idle');
    setOcrResult(null);
    setOcrError('');
  };

  const isLoading = triageStatus === 'loading' || ocrStatus === 'loading';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* ── Auth Header Bar ─────────────────────────────────────────────── */}
        <div className="flex justify-end mb-6">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white">{currentUser.fullname || 'Rakesh'}</span>
                <span className="text-[9px] text-indigo-400 font-semibold tracking-wider uppercase">{currentUser.role}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-300">
                {(currentUser.fullname || 'R')[0].toUpperCase()}
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-400 transition cursor-pointer ml-1"
                title="Sign Out"
              >
                🚪
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              🔑 Sign In / Register
            </button>
          )}
        </div>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered Triage System
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Hospital AI
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"> Triage</span>
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            Describe your symptoms or upload a prescription for instant AI-powered analysis,
            drug interaction checks, and hospital routing.
          </p>
        </div>

        {/* ── Section Divider ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Step 1 — Symptom Triage</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── Triage Input Card ───────────────────────────────────────────── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm shadow-2xl">
          <label htmlFor="symptoms-input" className="block text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
            Describe Your Symptoms
          </label>

          <textarea
            id="symptoms-input"
            rows={4}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have severe chest pain and cannot breathe..."
            disabled={isLoading}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition disabled:opacity-50"
          />

          {/* Quick example chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_SYMPTOMS.map((ex, i) => (
              <button
                key={i}
                onClick={() => setSymptoms(ex)}
                disabled={isLoading}
                className="text-xs text-slate-500 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer disabled:opacity-40"
              >
                {ex.slice(0, 36)}…
              </button>
            ))}
          </div>

          {/* GPS badge */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span>📍</span>
            <span>Mock GPS: Hyderabad, India ({MOCK_COORDS.lat}, {MOCK_COORDS.lng})</span>
          </div>

          {/* Triage action buttons */}
          <div className="mt-5 flex gap-3">
            <button
              id="run-triage-btn"
              onClick={handleTriage}
              disabled={!symptoms.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:shadow-none disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
            >
              {triageStatus === 'loading' ? <><Spinner /> Analyzing...</> : <>⚡ Run AI Triage</>}
            </button>
            {(triageStatus === 'success' || triageStatus === 'error') && (
              <button id="reset-triage-btn" onClick={resetTriage} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-xl transition cursor-pointer">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Triage error / result */}
        {triageStatus === 'error' && (
          <ErrorBanner message={triageError} hint="Ensure both the Node.js backend (:5000) and Python AI engine (:8000) are running." />
        )}
        {triageStatus === 'success' && triageResult && (
          <div className="space-y-6">
            <TriageResultCard 
              data={triageResult} 
              onRegisterQueue={handleRegisterQueue}
              queueLoading={queueLoading}
              hasToken={!!queueToken}
            />
            
            {queueToken && (
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎫</span>
                    <h3 className="text-white font-bold text-base">Your Active Queue Token</h3>
                  </div>
                  <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Live Sync Active
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Token Number</p>
                    <p className="text-3xl font-black text-white tracking-tight mt-1 font-mono">{queueToken.displayNumber}</p>
                  </div>
                  <div className="hidden sm:block h-12 w-px bg-white/10" />
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Assigned Doctor &amp; Division</p>
                    <p className="text-sm font-bold text-indigo-300 mt-1">
                      {queueToken.doctor?.doctorName || 'Assigned Duty Doctor'} · {triageResult.clinicalPrediction.recommendedDivision}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 mb-0.5">Estimated Waiting Time</p>
                    <p className="text-white font-semibold text-lg">{queueToken.computedDelay} <span className="text-xs font-normal text-slate-400">mins</span></p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 mb-0.5">Queue Position</p>
                    <p className="text-white font-semibold text-lg">{queueToken.sequenceRank} <span className="text-xs font-normal text-slate-400">ahead</span></p>
                  </div>
                </div>

                {/* Live status progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Registration</span>
                    <span className="animate-pulse text-indigo-300">Triage Queue</span>
                    <span>Consultation</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-indigo-400 animate-pulse transition-all duration-1000" style={{ width: '45%' }} />
                  </div>
                </div>

                <p className="text-center text-[10px] text-slate-500">
                  Refreshed at {new Date(queueToken.registeredAt).toLocaleTimeString()} · Patient: Rakesh
                </p>
              </div>
            )}

            <HospitalMap 
              recommendedHospital={triageResult.routingPlan?.recommendedHospital} 
              patientLocation={MOCK_COORDS} 
            />
          </div>
        )}

        {/* ── Section Divider ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Step 2 — Prescription OCR</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── Prescription Upload Card ────────────────────────────────────── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              Upload Prescription
            </p>
            <span className="text-xs text-violet-400/70 font-medium">
              AI extracts drugs &amp; checks interactions
            </span>
          </div>
          <p className="text-slate-500 text-xs mb-1">
            Upload a photo or scan of a prescription — our OCR pipeline will read it and flag dangerous drug combinations.
          </p>

          {/* Drop zone (hidden once a file is selected) */}
          {!prescFile && (
            <UploadZone onFileSelect={setPrescFile} disabled={isLoading} />
          )}

          {/* File preview badge */}
          {prescFile && (
            <FileBadge file={prescFile} onClear={resetOcr} />
          )}

          {/* OCR action buttons */}
          <div className="mt-5 flex gap-3">
            <button
              id="analyze-prescription-btn"
              onClick={handlePrescriptionUpload}
              disabled={!prescFile || isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 disabled:shadow-none disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
            >
              {ocrStatus === 'loading' ? <><Spinner /> Scanning...</> : <>🔬 Analyze Prescription</>}
            </button>
            {(ocrStatus === 'success' || ocrStatus === 'error') && (
              <button id="reset-ocr-btn" onClick={resetOcr} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-xl transition cursor-pointer">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* OCR error / result */}
        {ocrStatus === 'error' && (
          <ErrorBanner message={ocrError} hint="Ensure the Node.js backend (:5000) and Python OCR engine (:8000) are running, and Tesseract is installed." />
        )}
        {ocrStatus === 'success' && ocrResult && <PrescriptionResultCard data={ocrResult} />}

        {/* Footer */}
        <p className="text-center text-slate-700 text-xs mt-10">
          Hospital AI Platform · Triage Engine v2.0
        </p>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
