# SecureVault

SecureVault is a small full-stack **notes vault** used to demonstrate **secure software design** alongside three **intentionally vulnerable** code paths. The same automated test suite **passes on the fixed build** and **fails on the vulnerable build**.

## Stack

- **API:** Node.js, Express, SQLite (`better-sqlite3`), `express-session`, `bcryptjs`
- **UI:** React (Vite), Tailwind CSS, Framer Motion
- **Tests:** Vitest + Supertest (SQLi, IDOR), Playwright (stored XSS)

## Quick start

```bash
npm install
npx playwright install chromium
npm run dev
```

Open **http://127.0.0.1:5173** — the API is proxied from the Vite dev server to port **3001**.

### Vulnerable vs fixed mode

| Mode        | Command |
|------------|---------|
| **Fixed** (default) | `npm run dev` — leave `VULNERABLE_MODE` unset or set it to `false`. |
| **Vulnerable** (local lab only) | `cross-env VULNERABLE_MODE=true npm run dev` |

> **Never** deploy the vulnerable configuration to the public internet.

## Automated security tests

```bash
npm test
```

Runs API tests and the XSS Playwright spec with **fixed** defaults (`VULNERABLE_MODE=false`).

```bash
npm run test:vulnerable
```

Runs the **same** tests with `VULNERABLE_MODE=true` — **expect a non-zero exit code** (all three suites should fail, which proves the defects are reachable). Do not run `npm test` and `npm run test:vulnerable` at the same time, because both start a dev server on port **5173**.

### One test per vulnerability

| File | Vulnerability |
|------|----------------|
| `server/tests/sql-injection.test.js` | SQL injection in login (`INTENTIONAL_VULN_SQLI_LOGIN`) |
| `server/tests/idor.test.js` | Insecure direct object reference on note read (`INTENTIONAL_VULN_IDOR`) |
| `e2e/xss.spec.js` | Stored XSS via unsafe HTML rendering (`INTENTIONAL_VULN_XSS`; Playwright asserts the payload stays visible as literal text) |

## Where the flaws live (and fixes)

1. **SQL injection (login)** — `server/src/app.js`  
   - *Vulnerable:* string-concatenated `SELECT` with plaintext passwords in the `password_hash` column.  
   - *Fixed:* prepared statement + `bcryptjs` verification.

2. **IDOR (note read)** — `server/src/app.js` (`GET /api/notes/:id`)  
   - *Vulnerable:* loads any note by id without checking `user_id`.  
   - *Fixed:* `WHERE id = ? AND user_id = ?`.

3. **Stored XSS (note body)** — `client/src/components/NoteBody.jsx`  
   - *Vulnerable:* `dangerouslySetInnerHTML` when `/api/health` reports `vulnerableMode: true` (same `VULNERABLE_MODE` flag as the server).  
   - *Fixed:* render body as React text (escaped).

Session cookies are also weakened in vulnerable mode (`httpOnly: false`) to mirror unsafe defaults — the graded tests focus on the three items above.

## Production build

```bash
npm run build
npm run start
```

Serves the built client (preview) and the API together via the root `start` script.

## Ethics & coursework use

This repository exists for **education**. The vulnerable mode is for **controlled demonstrations** (local machine, coursework video). Do not reuse vulnerable patterns in real applications.

## Demo video (your deliverable)

Record **localhost** only: for each vulnerability, show the attack against the vulnerable dev server, then show the fix in source/tests and re-run with the fixed configuration. Keep runtime under **4 minutes** as required by your brief.

## GitHub

Push this folder to a new GitHub repository and submit that URL with your video link (YouTube/Drive) per assignment instructions.
