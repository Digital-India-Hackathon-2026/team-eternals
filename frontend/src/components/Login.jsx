import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LOGIN_URL = 'http://localhost:5000/api/auth/login';

export default function Login() {
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

      // Block Admins from logging into Patient portal
      if (data.user.role === 'ADMIN') {
        throw new Error('Please use the Facility Staff Portal.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    const demoUser = { id: 'demo-123', name: 'Rakesh', email: 'rakesh@parchi.ai', role: 'PATIENT' };
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl">🩺</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Patient & Citizen Portal</h2>
          <p className="text-xs text-slate-500">Access your Ayushman Bharat Digital Mission (ABDM) portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Citizen Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition shadow-sm disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <button 
            onClick={handleDemoBypass}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs py-2.5 rounded-xl border border-indigo-100 transition cursor-pointer"
          >
            ⚡ Quick Demo Login as Rakesh (Patient)
          </button>

          <div className="flex flex-col gap-1.5 text-center text-xs mt-2">
            <p className="text-slate-500">
              New to Parchi-AI?{' '}
              <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
                Create an account
              </Link>
            </p>
            <p className="text-slate-500">
              Are you Hospital Staff?{' '}
              <Link to="/admin/login" className="text-indigo-600 hover:underline font-semibold">
                Staff Gateway Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
