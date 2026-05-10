import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransition, tapScale } from '../motion.js';

export function Landing() {
  return (
    <motion.div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24" {...pageTransition}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-vault-850/80 shadow-card">
        <div
          className="absolute inset-0 bg-grid-slate bg-grid opacity-40 pointer-events-none"
          aria-hidden
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl" />

        <div className="relative px-6 sm:px-14 py-14 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-violet-200/90 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
            Defense in depth · sessions · ownership checks
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-gradient">Notes that stay yours.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            SecureVault is a compact vault for personal snippets — with a deliberate vulnerable mode for
            teaching injection, access control, and XSS fixes side by side.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.45 }}
          >
            <motion.div {...tapScale}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-glow text-lg"
              >
                Open your vault
              </Link>
            </motion.div>
            <Link
              to="/login"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium underline-offset-4 hover:underline"
            >
              Already have an account?
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-16 grid sm:grid-cols-3 gap-6"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        {[
          { t: 'Parameterized auth', d: 'Prepared statements and bcrypt on the fixed path.' },
          { t: 'Tenant isolation', d: 'Every note read checks ownership in the fixed API.' },
          { t: 'Safe rendering', d: 'React escaping blocks stored HTML execution by default.' },
        ].map((c) => (
          <motion.div
            key={c.t}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="rounded-2xl border border-white/5 bg-vault-900/40 p-6 hover:border-violet-500/25 transition-colors"
          >
            <h3 className="font-semibold text-white mb-2">{c.t}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{c.d}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
