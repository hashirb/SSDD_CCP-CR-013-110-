import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { NoteBody } from '../components/NoteBody.jsx';
import { pageTransition, tapScale } from '../motion.js';

export function NotePage() {
  const { id } = useParams();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 flex justify-center">
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
      </div>
    );
  }
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || !id) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const d = await api.getNote(id);
        if (!cancelled) {
          setNote(d.note);
          setNotFound(false);
        }
      } catch {
        if (!cancelled) {
          setNote(null);
          setNotFound(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  const del = async () => {
    if (!note || !window.confirm('Delete this note permanently?')) {
      return;
    }
    setBusy(true);
    try {
      await api.deleteNote(note.id);
      navigate('/app');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div className="max-w-3xl mx-auto px-4 sm:px-6 py-10" {...pageTransition}>
      <Link
        to="/app"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-300 mb-8 transition-colors"
      >
        <span aria-hidden>←</span> Back to vault
      </Link>

      {notFound && (
        <div className="rounded-2xl border border-white/10 bg-vault-850/50 p-10 text-center text-slate-400">
          Note not found or you do not have access.
        </div>
      )}

      {note && (
        <article className="rounded-2xl border border-white/10 bg-vault-850/50 overflow-hidden shadow-card">
          <div className="p-8 sm:p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-violet-300/80 mb-2">NOTE #{note.id}</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">{note.title}</h1>
              <p className="text-xs text-slate-500 mt-2 font-mono">{note.created_at}</p>
            </div>
            <motion.button
              type="button"
              onClick={() => void del()}
              disabled={busy}
              className="shrink-0 px-4 py-2 rounded-xl border border-rose-500/30 text-rose-200 hover:bg-rose-500/10 text-sm font-medium disabled:opacity-50"
              {...tapScale}
            >
              Delete
            </motion.button>
          </div>
          <div className="p-8 sm:p-10 text-slate-300 leading-relaxed">
            <NoteBody body={note.body} className="text-base" />
          </div>
        </article>
      )}
    </motion.div>
  );
}
