import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { pageTransition, tapScale } from '../motion.js';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await register({ username, password });
      navigate('/app');
    } catch (e2) {
      setErr(e2.message || 'Could not register');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div className="max-w-md mx-auto px-4 py-16" {...pageTransition}>
      <div className="rounded-2xl border border-white/10 bg-vault-850/70 p-8 shadow-card backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Create your vault</h1>
        <p className="text-slate-500 text-sm mb-8">Pick a username and a strong passphrase.</p>

        <form onSubmit={(e) => void submit(e)} className="space-y-5">
          <div>
            <label htmlFor="reg-username" className="block text-xs font-medium text-slate-400 mb-1.5">
              Username
            </label>
            <input
              id="reg-username"
              className="w-full rounded-xl bg-vault-950 border border-white/10 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-shadow"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className="w-full rounded-xl bg-vault-950 border border-white/10 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={4}
            />
          </div>
          {err && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2"
            >
              {err}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold disabled:opacity-50 shadow-glow"
            {...tapScale}
          >
            {busy ? 'Creating…' : 'Create account'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Have an account?{' '}
          <Link to="/login" className="text-violet-300 hover:text-violet-200 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
