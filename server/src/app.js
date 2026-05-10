import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { createDatabase } from './db.js';

const isVulnerable = () => process.env.VULNERABLE_MODE === 'true';

/**
 * @param {{ dbPath: string }} opts
 */
export function createApp(opts) {
  const db = createDatabase(opts.dbPath);
  const app = express();

  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '512kb' }));

  const sessionMiddleware = session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev-only-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: isVulnerable()
      ? {
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }
      : {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
  });
  app.use(sessionMiddleware);

  /** @param {import('express').Request} req */
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      vulnerableMode: isVulnerable(),
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const username = String(req.body?.username || '').trim().slice(0, 64);
    const password = String(req.body?.password || '').slice(0, 128);
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    try {
      if (isVulnerable()) {
        // INTENTIONAL_VULN_SQLI_REGISTER: concatenated SQL + plaintext password column (educational only)
        db.exec(
          `INSERT INTO users (username, password_hash) VALUES ('${username}', '${password}')`,
        );
      } else {
        const hash = bcrypt.hashSync(password, 12);
        db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
      }
    } catch {
      return res.status(409).json({ error: 'Username taken' });
    }
    res.status(201).json({ ok: true });
  });

  app.post('/api/auth/login', (req, res) => {
    const username = String(req.body?.username || '');
    const password = String(req.body?.password || '');

    let user;
    if (isVulnerable()) {
      // INTENTIONAL_VULN_SQLI_LOGIN: concatenated SQL — educational only
      const sql = `SELECT * FROM users WHERE username = '${username}' AND password_hash = '${password}'`;
      user = db.prepare(sql).get();
    } else {
      user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ ok: true, user: { id: user.id, username: user.username } });
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('sid');
      res.json({ ok: true });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({
      user: { id: req.session.userId, username: req.session.username },
    });
  });

  app.get('/api/notes', requireAuth, (req, res) => {
    const rows = db
      .prepare('SELECT id, title, body, created_at FROM notes WHERE user_id = ? ORDER BY id DESC')
      .all(req.session.userId);
    res.json({ notes: rows });
  });

  app.post('/api/notes', requireAuth, (req, res) => {
    const title = String(req.body?.title || '').slice(0, 200);
    const body = String(req.body?.body || '').slice(0, 50_000);
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }
    const info = db
      .prepare('INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)')
      .run(req.session.userId, title, body);
    res.status(201).json({
      note: {
        id: info.lastInsertRowid,
        title,
        body,
        created_at: new Date().toISOString(),
      },
    });
  });

  app.get('/api/notes/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    let row;
    if (isVulnerable()) {
      // INTENTIONAL_VULN_IDOR: no ownership check
      row = db.prepare('SELECT id, user_id, title, body, created_at FROM notes WHERE id = ?').get(id);
    } else {
      row = db
        .prepare(
          'SELECT id, user_id, title, body, created_at FROM notes WHERE id = ? AND user_id = ?',
        )
        .get(id, req.session.userId);
    }
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ note: row });
  });

  app.delete('/api/notes/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    if (isVulnerable()) {
      const row = db.prepare('SELECT id FROM notes WHERE id = ?').get(id);
      if (!row) {
        return res.status(404).json({ error: 'Not found' });
      }
      db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    } else {
      const r = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(id, req.session.userId);
      if (r.changes === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
    }
    res.json({ ok: true });
  });

  return app;
}
