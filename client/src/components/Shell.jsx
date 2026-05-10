import { motion } from 'framer-motion';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { tapScale } from '../motion.js';

export function Shell() {
  const { user, vulnerableMode, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 bg-vault-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow"
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
            <span className="font-semibold text-lg tracking-tight text-white group-hover:text-violet-200 transition-colors">
              SecureVault
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            {user ? (
              <>
                <NavLink
                  to="/app"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`
                  }
                >
                  Vault
                </NavLink>
                <span className="hidden sm:inline text-slate-500 max-w-[140px] truncate text-xs px-2">
                  {user.username}
                </span>
                <motion.button
                  type="button"
                  onClick={() => void onLogout()}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  {...tapScale}
                >
                  Sign out
                </motion.button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  Sign in
                </NavLink>
                <motion.div {...tapScale}>
                  <Link
                    to="/register"
                    className="inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium shadow-glow hover:opacity-95 transition-opacity"
                  >
                    Create account
                  </Link>
                </motion.div>
              </>
            )}
          </nav>
        </div>
        {vulnerableMode === true && (
          <div className="bg-amber-500/15 border-t border-amber-500/25 text-amber-200/95 text-xs text-center py-1.5 font-mono tracking-wide">
            VULNERABLE_MODE — educational build only · never deploy publicly
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <p>Built for secure software design coursework — intentional flaws are labeled in source.</p>
      </footer>
    </div>
  );
}
