import { useState } from 'react';

const EXAMPLE_SYMPTOMS = [
  'I have severe chest pain and cannot breathe',
  'I was in a car accident and my leg is bleeding badly',
  'I have had a fever, cough, and headache for 3 days',
];

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function TriageForm({ 
  symptoms, 
  setSymptoms, 
  triageStatus, 
  onSubmitTriage 
}) {
  const [preference, setPreference] = useState('ANY'); // ANY | GOVERNMENT | PRIVATE

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    onSubmitTriage(symptoms.trim(), preference);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="symptoms-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Describe Your Symptoms
        </label>
        <textarea
          id="symptoms-input"
          rows={4}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe what you are feeling in detail..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none transition"
        />
      </div>

      {/* Facility Preference Toggle Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Facility Preference
        </label>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setPreference('ANY')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              preference === 'ANY' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Any Facility
          </button>
          <button
            type="button"
            onClick={() => setPreference('GOVERNMENT')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              preference === 'GOVERNMENT' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Gov Only
          </button>
          <button
            type="button"
            onClick={() => setPreference('PRIVATE')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              preference === 'PRIVATE' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Private Only
          </button>
        </div>
      </div>

      {/* Symptom quick chips */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_SYMPTOMS.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSymptoms(ex)}
            className="text-xs text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 transition cursor-pointer"
          >
            {ex.slice(0, 36)}...
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={!symptoms.trim() || triageStatus === 'loading'}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
      >
        {triageStatus === 'loading' ? (
          <>
            <Spinner /> Analyzing Symptoms...
          </>
        ) : (
          'Run AI Triage'
        )}
      </button>
    </form>
  );
}
