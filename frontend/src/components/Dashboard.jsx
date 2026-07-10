import { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import HospitalMap from './HospitalMap';
import TriageForm from './TriageForm';
import PatientVault from './PatientVault';
import AppointmentModal from './AppointmentModal';
import PhysicianPortal from './PhysicianPortal';

const TRIAGE_URL = 'http://localhost:5000/api/patients/triage/analyze';
const PRESCRIPTION_URL = 'http://localhost:5000/api/prescriptions/analyze';
const SAVE_VAULT_URL = 'http://localhost:5000/api/prescriptions/vault';
const APPOINTMENTS_ME_URL = 'http://localhost:5000/api/appointments/me';
const MOCK_COORDS = { lat: 17.385, lng: 78.4867 };
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function Dashboard() {
  // Load authenticated user profile
  const [user] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: 'Guest' };
  });

  if (user && user.role === 'DOCTOR') {
    return <PhysicianPortal user={user} />;
  }

  // Tab State: triage | ocr | vault | appointments
  const [activeTab, setActiveTab] = useState('triage');

  // Triage state
  const [symptoms, setSymptoms] = useState('');
  const [triageStatus, setTriageStatus] = useState('idle'); // idle | loading | success | error
  const [triageResult, setTriageResult] = useState(null);
  const [triageError, setTriageError] = useState('');

  // Prescription State
  const [prescFile, setPrescFile] = useState(null);
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle | loading | success | error
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState('');

  // Queue state
  const [queueToken, setQueueToken] = useState(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState('');

  // Save to vault state
  const [savingVault, setSavingVault] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // UHI Appointment State
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');

  // drag-and-drop reference
  const fileInputRef = useRef(null);

  // Fetch appointments for active tab
  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError('');
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(APPOINTMENTS_ME_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments.');
      }
    } catch (err) {
      console.error(err);
      setAppointmentsError(err.message || 'Error connecting to database.');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  
  const handleTriage = async (symptomsText, preference) => {
    setTriageStatus('loading');
    setTriageResult(null);
    setTriageError('');
    setQueueToken(null);
    setQueueError('');
    try {
      const res = await fetch(TRIAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symptoms: symptomsText.trim(), 
          lat: MOCK_COORDS.lat, 
          lng: MOCK_COORDS.lng,
          facilityPreference: preference
        }),
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

  const handlePrescriptionUpload = async () => {
    if (!prescFile) return;
    setOcrStatus('loading');
    setOcrResult(null);
    setOcrError('');
    try {
      const formData = new FormData();
      formData.append('file', prescFile);

      const res = await fetch(PRESCRIPTION_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Prescription analysis failed.');
      setOcrResult(data);
      setOcrStatus('success');
    } catch (err) {
      setOcrError(err.message || 'An unexpected error occurred.');
      setOcrStatus('error');
    }
  };

  const handleRegisterQueue = async () => {
    const recommendedHospital = triageResult?.routingPlan?.recommendedHospital;
    if (!recommendedHospital) return;
    setQueueLoading(true);
    setQueueError('');
    try {
      const res = await fetch('http://localhost:5000/api/queue/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name,
          division: triageResult?.clinicalPrediction?.recommendedDivision || 'GENERAL_MEDICINE',
          facilityId: recommendedHospital.facilityName,
          urgencyLevel: triageResult?.clinicalPrediction?.urgencyLevel || 'GREEN'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Queue registration failed.');
      setQueueToken(data.token);
    } catch (err) {
      console.error('[RegisterQueue]', err);
      setQueueError(err.message || 'Could not register for queue.');
      setQueueToken({
        id: 'mock-token-123',
        displayNumber: `${recommendedHospital.facilityName.substring(0, 3).toUpperCase()}-${(triageResult?.clinicalPrediction?.recommendedDivision || 'GEN').substring(0, 3).toUpperCase()}-05`,
        urgencyLevel: triageResult?.clinicalPrediction?.urgencyLevel || 'GREEN',
        state: 'ACTIVE_WAITING',
        computedDelay: triageResult?.clinicalPrediction?.urgencyLevel === 'RED' ? 5 : 30,
        sequenceRank: 3,
        registeredAt: new Date(),
        doctor: { doctorName: 'Dr. Meera Pillai' },
        facilityName: recommendedHospital.facilityName
      });
    } finally {
      setQueueLoading(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!ocrResult) return;
    setSavingVault(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(SAVE_VAULT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ocrText: ocrResult.ocr?.rawText || '',
          extractedJSON: ocrResult
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to save prescription.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not connect to prescription vault.');
    } finally {
      setSavingVault(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      setPrescFile(file);
    } else {
      alert('Unsupported file type. Please upload an image.');
    }
  };

  const clearPrescription = () => {
    setPrescFile(null);
    setOcrStatus('idle');
    setOcrResult(null);
    setOcrError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleOpenBooking = (hospital) => {
    setSelectedHospital(hospital);
    setIsModalOpen(true);
  };

  const recommendedHospital = triageResult?.routingPlan?.recommendedHospital;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* ── Dashboard Header ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-35 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩺</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Welcome, {user.name}
              </h1>
              {user.abhaId && (
                <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">
                  ABHA ID: {user.abhaId.replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
              Digital India Ideathon Portal
            </span>
            <button 
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-red-500 transition cursor-pointer border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-xl bg-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs Navigator ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex border-b border-slate-200 font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('triage')}
            className={`py-3 px-6 text-sm border-b-2 cursor-pointer transition ${
              activeTab === 'triage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            🚨 Clinical Triage & Map
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`py-3 px-6 text-sm border-b-2 cursor-pointer transition ${
              activeTab === 'ocr'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            🔬 Prescription OCR Scan
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-3 px-6 text-sm border-b-2 cursor-pointer transition ${
              activeTab === 'vault'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            🗄️ ABHA Digital Vault
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-3 px-6 text-sm border-b-2 cursor-pointer transition ${
              activeTab === 'appointments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            🎫 UHI Booking Tokens
          </button>
        </div>
      </div>

      {/* ── Tab Layout Render ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* TAB 1: Triage and Map */}
        {activeTab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-5 lg:col-span-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">⚡ AI Symptom Triage Classifier</h2>
                <p className="text-xs text-slate-500 mt-1">Describe symptoms and specify preferences to instantly predict clinic routing, severity, and ABDM spots.</p>
              </div>

              <TriageForm
                symptoms={symptoms}
                setSymptoms={setSymptoms}
                triageStatus={triageStatus}
                onSubmitTriage={handleTriage}
              />

              {triageStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-4">
                  <p className="font-semibold">Triage Failed</p>
                  <p className="opacity-80 mt-0.5">{triageError}</p>
                </div>
              )}

              {triageStatus === 'success' && triageResult && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-slate-400 font-semibold uppercase">Division</p>
                      <p className="text-slate-900 font-bold mt-0.5">{triageResult.clinicalPrediction.recommendedDivision}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-slate-400 font-semibold uppercase">Urgency Rank</p>
                      <p className="text-slate-900 font-bold mt-0.5">{triageResult.clinicalPrediction.urgencyLevel}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-slate-400 font-semibold uppercase">Equipment Needed</p>
                      <p className="text-slate-900 font-bold mt-0.5">{triageResult.clinicalPrediction.suggestedEquipment}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-slate-400 font-semibold uppercase">Required Bed</p>
                      <p className="text-slate-900 font-bold mt-0.5">{triageResult.clinicalPrediction.requiredBedType}</p>
                    </div>
                  </div>

                  {triageResult.clinicalPrediction.confidenceScores && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classification Confidence</h4>
                      <div className="space-y-2">
                        {Object.entries(triageResult.clinicalPrediction.confidenceScores)
                          .sort((a, b) => b[1] - a[1])
                          .map(([dept, pct]) => {
                            const isSelected = dept === triageResult.clinicalPrediction.recommendedDivision;
                            return (
                              <div key={dept} className="text-xs flex items-center justify-between gap-3">
                                <span className={`font-semibold ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                                  {dept.replace('_', ' ')}
                                </span>
                                <div className="flex items-center gap-2 flex-1 max-w-[150px] justify-end">
                                  <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} 
                                      style={{ width: `${pct}%` }} 
                                    />
                                  </div>
                                  <span className={`font-mono w-8 text-right text-[10px] ${isSelected ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                                    {Math.round(pct)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Hospital Routing & Queue Section */}
                  {recommendedHospital && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 pt-3 mt-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            ABDM Top Recommended Facility
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            Score: {recommendedHospital.score}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5">
                          {recommendedHospital.facilityName}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {recommendedHospital.physicalStreet}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div className="bg-white border border-slate-200 rounded p-2">
                          <p className="text-slate-400">Available Beds</p>
                          <p className="font-bold text-slate-800 mt-0.5">{recommendedHospital.availableBeds} / {recommendedHospital.totalBedCount}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded p-2">
                          <p className="text-slate-400">Active Doctors</p>
                          <p className="font-bold text-slate-800 mt-0.5">{recommendedHospital.activeDoctorCount} Docs</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded p-2">
                          <p className="text-slate-400">Rating</p>
                          <p className="font-bold text-slate-800 mt-0.5">⭐ {recommendedHospital.facilityRating.toFixed(1)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {!queueToken ? (
                          <button
                            onClick={handleRegisterQueue}
                            disabled={queueLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            {queueLoading ? 'Booking spot...' : `🎫 Register Spot (${recommendedHospital.hospitalType === 'GOVERNMENT' ? 'Gov' : 'Pvt'})`}
                          </button>
                        ) : (
                          <div className="bg-white border border-indigo-100 rounded-xl p-3.5 space-y-3 shadow-sm sm:col-span-2">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <div>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Lobby Ticket</p>
                                <p className="text-xl font-black text-slate-900 tracking-tight font-mono">{queueToken.displayNumber}</p>
                              </div>
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                Active
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div className="bg-slate-50 rounded p-2">
                                <p className="text-slate-400">Wait Estimate</p>
                                <p className="text-slate-800 font-bold mt-0.5">{queueToken.computedDelay} mins</p>
                              </div>
                              <div className="bg-slate-50 rounded p-2">
                                <p className="text-slate-400">Position Ahead</p>
                                <p className="text-slate-800 font-bold mt-0.5">{queueToken.sequenceRank} patients</p>
                              </div>
                            </div>

                            <div className="text-[9px] text-slate-500 leading-relaxed pt-1 flex justify-between items-center border-t border-slate-100">
                              <span>Doctor: {queueToken.doctor?.doctorName || 'Duty Doctor'}</span>
                              <span className="font-semibold text-indigo-600">Patient: {user.name}</span>
                            </div>
                          </div>
                        )}

                        {!queueToken && (
                          <button
                            onClick={() => handleOpenBooking(recommendedHospital)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            📅 Schedule Time Slot (UHI)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4 lg:col-span-1">
              <HospitalMap 
                recommendedHospital={recommendedHospital}
                patientLocation={MOCK_COORDS} 
                onBookAppointment={handleOpenBooking}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Prescription OCR Upload */}
        {activeTab === 'ocr' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-5 lg:col-span-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">🔬 Prescription OCR Digitizer</h2>
                <p className="text-xs text-slate-500 mt-1">Upload a prescription scan to extract medication names and check drug-to-drug interactions.</p>
              </div>

              {!prescFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-8 text-center cursor-pointer transition"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept={ACCEPTED_TYPES.join(',')} 
                    className="hidden" 
                  />
                  <span className="text-3xl">📋</span>
                  <p className="text-xs font-semibold text-slate-700 mt-2">Select Prescription Image</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WebP · Max 10MB</p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{prescFile.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{(prescFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button 
                    onClick={clearPrescription}
                    className="text-slate-400 hover:text-red-500 font-bold text-lg cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              <button
                onClick={handlePrescriptionUpload}
                disabled={!prescFile || ocrStatus === 'loading'}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                {ocrStatus === 'loading' ? <><Spinner /> Digitizing...</> : 'Analyze Prescription'}
              </button>

              {ocrStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-4">
                  <p className="font-semibold">Analysis Failed</p>
                  <p className="opacity-80 mt-0.5">{ocrError}</p>
                </div>
              )}

              {ocrStatus === 'success' && ocrResult && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Analysis Results</h3>
                    <button
                      onClick={handleSaveToVault}
                      disabled={savingVault || saveSuccess}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                        saveSuccess 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {savingVault ? (
                        <><Spinner /> Saving...</>
                      ) : saveSuccess ? (
                        '✅ Saved to Vault'
                      ) : (
                        '💾 Save to ABHA Vault'
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detected Drugs</h4>
                    {ocrResult.detectedDrugs.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {ocrResult.detectedDrugs.map((drug, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full text-xs font-medium">
                            💊 {drug}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1">No candidates identified.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Drug Interactions</h4>
                    {ocrResult.interactions?.warnings.length > 0 ? (
                      <div className="space-y-2">
                        {ocrResult.interactions.warnings.map((w, i) => (
                          <div key={i} className={`p-3 rounded-lg border text-xs ${
                            w.severity === 'HIGH RISK' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                          }`}>
                            <p className="font-bold flex gap-1 items-center">
                              <span>🚨</span> {w.pair.join(' + ')} ({w.severity})
                            </p>
                            <p className="mt-1 opacity-90">{w.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-3 flex gap-2">
                        <span>✅</span>
                        <p>No dangerous drug-to-drug interactions detected.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-4 lg:col-span-1">
              <div>
                <h3 className="text-sm font-bold text-slate-900">ABHA Digital Health Record</h3>
                <p className="text-xs text-slate-500 mt-1">Your scanned prescriptions are securely linked to your 14-digit ABHA ID under the Digital India Mission.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="text-base">🔐</span>
                  <p><strong>Secure Encrypted Vault</strong>: Records are encrypted and tied strictly to your registered UUID.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-base">🧑‍⚕️</span>
                  <p><strong>Clinical Auditing</strong>: Interactions warnings cross-check active clinical databases to flag dangerous side-effects.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-base">🎫</span>
                  <p><strong>Lobby Sync</strong>: Presenting your digital token at the physical counter fetches your vault files automatically.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ABHA Digital Prescription Vault Logs */}
        {activeTab === 'vault' && (
          <div className="max-w-4xl mx-auto">
            <PatientVault />
          </div>
        )}

        {/* TAB 4: UHI Appointment Booking Digital Tokens */}
        {activeTab === 'appointments' && (
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">🎫 Unified Health Interface (UHI) Booking Tokens</h2>
              <p className="text-xs text-slate-500 mt-1">Manage your active digital tokens generated through the National Health Stack registry.</p>
            </div>

            {appointmentsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                <Spinner />
                <span className="text-xs">Fetching active appointments...</span>
              </div>
            ) : appointmentsError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-4">
                ⚠️ {appointmentsError}
              </div>
            ) : appointments.length === 0 ? (
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-12 text-center">
                <span className="text-4xl">🎫</span>
                <h3 className="font-bold text-slate-700 mt-3 text-sm">No Active Booking Tokens</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Go to the Map tab, click on any hospital marker, and click "Book Digital Token" to schedule your time slot.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((appt) => (
                  <div 
                    key={appt.id}
                    className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition flex flex-col bg-white"
                  >
                    <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-indigo-100">
                          {appt.facility.hospitalType} Facility
                        </span>
                        <h4 className="font-black text-slate-800 text-xs mt-1 truncate max-w-[180px]">
                          {appt.facility.facilityName}
                        </h4>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {appt.status}
                      </span>
                    </div>

                    <div className="p-4 flex gap-4 items-center justify-between flex-1">
                      <div className="space-y-3 flex-1">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div>
                            <p className="text-slate-400 font-semibold uppercase text-[9px]">DATE & TIME</p>
                            <p className="font-bold text-slate-800 mt-0.5">
                              {new Date(appt.appointmentDate).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-semibold uppercase text-[9px]">UHI DIGITAL TOKEN</p>
                            <p className="font-mono font-bold text-indigo-600 mt-0.5">{appt.digitalToken}</p>
                          </div>
                        </div>
                      </div>

                      {/* Scannable QR Code Render */}
                      <div className="flex-shrink-0 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <QRCode 
                          value={appt.digitalToken} 
                          size={70} 
                          style={{ height: "auto", maxWidth: "100%", width: "70px" }} 
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>ABHA Registered Patient</span>
                      <span className="font-bold text-slate-700">{user.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hospital={selectedHospital}
        onBookSuccess={() => {
          fetchAppointments();
          setActiveTab('appointments');
        }}
      />
    </div>
  );
}
