import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@siwiglobal.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.adminLogin(email, password);
      localStorage.setItem('siwi_admin_token', data.token);
      localStorage.setItem('siwi_admin_user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-lg p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3">
            <img src="/assets/images/siwi-logo.png" alt="SIWI Logo" className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(198,154,69,0.3)]" />
          </div>
          <span className="font-serif text-3xl font-medium tracking-wider text-neutral-100 block">
            SIWI
          </span>
          <span className="text-[10px] tracking-[0.24em] font-mono uppercase text-brand-gold font-semibold block mt-1">
            Global Ventures · Management Console
          </span>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-500/10 border border-red-500/30 text-xs text-red-400 rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
              Operator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@siwiglobal.com"
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-100 focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
              Secure Key / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-100 focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-gold text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-500">
            Authorised company operators only.
            <br />
            Pre-configured demo access: <code className="text-neutral-300">admin@siwiglobal.com</code> / <code className="text-neutral-300">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
