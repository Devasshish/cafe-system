import React, { useState } from 'react';
import { Coffee, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(username.trim(), password);
    if (!res.success) {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-xl p-8 text-[#2e1c14]">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Recharge Café"
            className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-[#e5d5c5] shadow-sm"
          />
          <h2 className="font-serif font-bold text-2xl text-[#2e1c14]">
            <span className="text-[#3e2318]">Recharge</span> <span className="text-[#f26522]">Café</span>
          </h2>
          <p className="text-xs text-[#7d5f4c] mt-1">
            Sign in to access order management and menu controls.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4a3325] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#c86227]" />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a3325] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#c86227]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-[#c86227] hover:bg-[#b0531e] text-white font-semibold text-sm transition shadow-md shadow-[#c86227]/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#f4ebe1] text-center">
          <p className="text-[11px] text-[#8c6b53]">
            Default dev credentials: <span className="font-mono bg-[#f4ebe1] px-1.5 py-0.5 rounded text-[#2e1c14]">admin</span> / <span className="font-mono bg-[#f4ebe1] px-1.5 py-0.5 rounded text-[#2e1c14]">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

