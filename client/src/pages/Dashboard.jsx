import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { pageTransition, staggerContainer, staggerItem, tapScale } from '../motion.js';

export function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 flex justify-center">
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
      </div>
    );
  }
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const d = await api.listNotes();
    setNotes(d.notes || []);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    void load().catch(() => setNotes([]));
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    setErr('');
    setBusy(true);
    try {
      await api.createNote({ title: title.trim(), body });
      setTitle('');
      setBody('');
      await load();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div className="max-w-5xl mx-auto px-4 sm:px-6 py-10" {...pageTransition}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your vault</h1>
          <p className="text-slate-500 mt-1">Private notes, scoped to your session.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.form
          onSubmit={(e) => void create(e)}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-vault-850/50 p-6 h-fit backdrop-blur-sm"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">New note</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="note-title" className="text-xs text-slate-400 font-medium">
                Title
              </label>
              <input
                id="note-title"
                className="mt-1 w-full rounded-xl bg-vault-950 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meeting ideas…"
              />
            </div>
            <div>
              <label htmlFor="note-body" className="text-xs text-slate-400 font-medium">
                Body
              </label>
              <textarea
                id="note-body"
                className="mt-1 w-full min-h-[120px] rounded-xl bg-vault-950 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-y"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write freely — the fixed UI escapes HTML."
              />
            </div>
            {err && <p className="text-sm text-rose-300">{err}</p>}
            <motion.button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium disabled:opacity-50 transition-colors"
              {...tapScale}
            >
              {busy ? 'Saving…' : 'Save note'}
            </motion.button>
          </div>
        </motion.form>

        <div className="lg:col-span-3">
          <motion.ul
            className="space-y-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {notes.length === 0 ? (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-white/15 bg-vault-900/30 px-6 py-16 text-center text-slate-500"
                >
                  No notes yet — add your first secret on the left.
                </motion.li>
              ) : (
                notes.map((n) => (
                  <motion.li
                    key={n.id}
                    layout
                    variants={staggerItem}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group rounded-2xl border border-white/10 bg-vault-850/40 hover:border-violet-500/30 hover:shadow-glow/20 transition-all"
                  >
                    <Link to={`/app/notes/${n.id}`} className="block p-5">
                      <div className="flex justify-between gap-3">
                        <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                          {n.title}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono shrink-0">#{n.id}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 whitespace-pre-wrap">{n.body}</p>
                    </Link>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </motion.div>
  );
}
