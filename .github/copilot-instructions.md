## PhotoRate — Copilot instructions (concise)

Summary
- PhotoRate is a small Node.js + Express backend serving a static frontend in `public/` and reading photos/ratings from a MySQL database.
- Key runtime entry: `src/server.js`. DB pool lives in `src/database.js` (mysql2 promise pool).

Quick start (developer workflows)
- Install: `npm install`
- Dev server: `npm run dev` (uses `npx nodemon src/server.js`)
- Prod run: `npm start` (runs `node src/server.js`)
- Quick DB check: `node src/dbTest.js` (reads `src/database.js` connection settings)

Environment & DB notes
- Uses dotenv; drop a `.env` file in project root or set env vars.
- Important env vars (used in `src/database.js`): `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT`, `DB_SSL`, `DB_CA_PATH`, `DB_CONNECT_TIMEOUT`.
- `DB_SSL=true` will enable SSL options. If `DB_CA_PATH` is provided the CA is read; otherwise code falls back to `rejectUnauthorized: false` for self-signed/dev setups.

Architecture & file map (what to read first)
- `src/server.js` — mounts routes and static `public/` files. Example routes mounted:
  - `/api/photos` -> `src/routes/photoEndpointsAPI.js`
  - `/api/comments` -> `src/routes/commentRateEndpointsAPI.js`
- `src/routes/*.js` — contain the express route handlers that call `require('../database')` to run queries. Read these to learn endpoint shapes.
- `src/database.js` — central mysql2 pool and `testConnection()` helper. Modify here for MySQL 8 auth/ssl tuning.
- `public/index.html`, `public/style.css`, `public/script.js` — simple client; `script.js` calls `/api/photos/count`, `/api/photos/:id`, and `POST /api/comments`.

Patterns & conventions for code edits
- CommonJS only (use `require` / `module.exports`). Keep path imports relative to `src/` files (e.g., routes use `require('../database')`).
- SQL is executed via `pool.query(sql, params)` and expects mysql2 promise pool return shape: `[rows]`.
- Routes return JSON and follow simple status codes: 200, 201, 404, 500. Keep messages consistent with existing handlers.

Common gotchas (what breaks locally)
- Wrong require paths: moving files requires updating relative imports (e.g., `../database`). If Node reports "Cannot find module './database'", check the module path relative to the requiring file.
- DB connection failures: verify `.env` values and use `node src/dbTest.js` to get a clearer diagnostic (the DB helper attaches a `.diag` object for errors).
- If switching to SSL for MySQL 8, provide a valid CA file via `DB_CA_PATH` or set `DB_SSL=false` for local testing.

Examples (copyable snippets)
- Mounting routes in `src/server.js` (already used):
  app.use('/api/photos', require('./routes/photoEndpointsAPI'))

- Basic query pattern in route handler (see `src/routes/photoEndpointsAPI.js`):
  const [rows] = await pool.query('SELECT COUNT(photo_id) AS total_photos FROM Photos')
  res.json({ total_photos: rows[0].total_photos })

Where to make changes for MySQL 8
- Edit `src/database.js` to change connect options, enable native auth plugins, or provide SSL CA. `src/dbTest.js` helps verify.

If you add files
- Follow existing CommonJS style and keep route handlers under `src/routes/`.
- If you introduce controllers/services, keep route files minimal and delegate logic out of route handlers.

When in doubt
- Run `npm run dev` and read nodemon/Node stack traces. If an import error occurs, inspect the first file in the `Require stack:` — that is the import site that failed.

Please review and tell me any missing project conventions or scripts to include; I will iterate.
