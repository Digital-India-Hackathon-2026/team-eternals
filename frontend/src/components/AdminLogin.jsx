import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LOGIN_URL = 'http://localhost:5000/api/auth/login';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // Role check: Only permit ADMINs
      if (data.user.role !== 'ADMIN') {
        throw new Error('Unauthorized. Facility Staff access only.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    // Quick bypass as Admin for testing
    const demoAdmin = { id: 'admin-123', name: 'Rakesh (Admin)', email: 'a@gmail.com', role: 'ADMIN' };
    localStorage.setItem('token', 'mock-admin-jwt-token');
    localStorage.setItem('user', JSON.stringify(demoAdmin));
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl">🏢</span>
          <h2 className="text-2xl font-bold tracking-tight text-white">Facility Staff Gateway</h2>
          <p className="text-xs text-slate-500">Authorized Clinical Administrator Portal</p>
          <div className="inline-flex items-center gap-1.5 bg-indigo-950 text-indigo-300 border border-indigo-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
            <span>🛡️</span> Secure EHR Registry
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/60 text-red-300 text-xs rounded-xl p-3.5">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Staff Email ID</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.gov.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Access Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition shadow-md disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
          >
            {loading ? 'Validating Credentials...' : 'Authenticate Access'}
          </button>
        </form>

        <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
          <button 
            onClick={handleDemoBypass}
            className="w-full bg-slate-800 hover:bg-slate-755 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            ⚡ Quick Demo Login as Admin
          </button>

          <p className="text-center text-xs text-slate-500 mt-2">
            Are you a Patient?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
              Go to Patient Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
