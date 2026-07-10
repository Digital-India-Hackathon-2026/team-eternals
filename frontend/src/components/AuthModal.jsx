import { useState } from 'react';

const LOGIN_URL = 'http://localhost:5000/api/auth/login';
const SIGNUP_URL = 'http://localhost:5000/api/auth/signup';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isLogin ? LOGIN_URL : SIGNUP_URL;
    const body = isLogin 
      ? { email, password }
      : { email, password, role: 'PATIENT', fullname, contactPhone: phone, dob };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed.');
      }

      // Store token and call callback
      localStorage.setItem('parchi_token', data.token);
      localStorage.setItem('parchi_user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      console.error('[AuthError]', err);
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login bypass to ensure the demo never crashes
    const mockUser = {
      email: 'rakesh@parchi.ai',
      role: 'PATIENT',
      fullname: 'Rakesh',
      patientProfile: {
        fullname: 'Rakesh',
        contactPhone: '9876543210',
        dob: '1998-05-15'
      }
    };
    const mockToken = 'mock-jwt-token-string';
    localStorage.setItem('parchi_token', mockToken);
    localStorage.setItem('parchi_user', JSON.stringify(mockUser));
    onAuthSuccess(mockUser, mockToken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isLogin ? 'Sign In to Parchi-AI' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-lg"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl p-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                  Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="e.g. Rakesh"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                    Contact Phone
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9999999999"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                    Date of Birth
                  </label>
                  <input 
                    type="date" 
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
              Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rakesh@parchi.ai"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2">
          <button 
            onClick={handleDemoLogin}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-300 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
          >
            ⚡ Quick Demo Login as Rakesh
          </button>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-center text-xs text-slate-400 hover:text-white transition mt-2"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
