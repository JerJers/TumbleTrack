# TumbleTrack

A laundry tracker for students living in dorms, boarding houses, or shared
apartments — log every laundry load, and keep tabs on when special or
delicate items were last washed, without needing to create an account.

**Live site:** <https://JerJers.github.io/TumbleTrack/>
**API:** <https://tumbletrack.onrender.com>
**Demo video:** (link)

## What it does

- Log a laundry load — date, load type, weight, cost, and optional notes
- Optionally tag special/delicate clothing items included in a load, which
  updates their last-washed date automatically
- Track special/delicate clothing items (not your whole wardrobe) with their
  category and last-washed date
- See a weekly dashboard: loads logged, amount spent, and which tracked
  items are overdue for a wash
- Browse full laundry history — a table on desktop, stacked cards on phone

No login required — each browser is given a random device ID (stored in
`localStorage`) that scopes all of its data on the server, so one person's
laundry never mixes with another's.

## Built with

React and Vite on the front end (plain CSS, no framework), Express and
PostgreSQL on the back end. The client is on GitHub Pages, the API on
Render, the database on Neon.

## Demo mode

This repository can run two ways, chosen by one environment variable at **build** time.

**Demo mode is the default.** Only the exact string `false` turns it off, so a
forgotten or mistyped variable leaves you on the simulated backend with a visible
notice rather than on a silently broken build.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset, or `true` | The client answers its own requests from `localStorage`. No server, no database, nothing shared between visitors. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes real PostgreSQL on Neon. |

The live site above is deployed with `VITE_USE_MOCK_API=false` — it talks to
the real API and a real database, not the simulated backend.

GitHub Pages serves files and cannot run Node, so the API and the database
live elsewhere:

| Piece | Host |
| --- | --- |
| **API** | Render |
| **Database** | Neon (PostgreSQL) |

The app also has no login, so every route except `/healthz` is gated with
HTTP Basic Auth (see [Environment variables](#environment-variables) below) —
without it, any visitor to the live API could write or delete data.
Credentials for the live deployment are shared with graders through a
private channel, not this repository.

## Running it yourself

**The client only, in demo mode.** No database needed.

```
cd client
npm install
cp .env.example .env        # VITE_USE_MOCK_API stays true
npm run dev                 # http://localhost:5173
```

**The whole stack.** Needs a PostgreSQL database, either local or hosted (e.g. Neon).

```
# 1. the API
cd server
npm install
cp .env.example .env        # fill in DATABASE_URL, BASIC_AUTH_USER/PASS
# run server/db/schema.sql once against your database (Neon's SQL editor,
# or: psql "$DATABASE_URL" -f db/schema.sql)
npm run dev                 # http://localhost:3000

# 2. the client, in another terminal
cd client
npm install
cp .env.example .env
# set VITE_USE_MOCK_API=false and VITE_API_BASE_URL=http://localhost:3000
npm run dev
```

Check the API on its own before you blame the client:

```
curl.exe https://tumbletrack.onrender.com/healthz
curl.exe -u youruser:yourpass https://tumbletrack.onrender.com/api/loads -H "X-Device-Id: test"
```

## Environment variables

None of these are committed. `.env.example` in each folder lists them with
placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | Neon PostgreSQL connection string. Contains a password |
| `CORS_ORIGINS` | server | comma-separated origins allowed to call the API |
| `BASIC_AUTH_USER` | server | username required to access any route (except `/healthz`) |
| `BASIC_AUTH_PASS` | server | password required to access any route (except `/healthz`) |
| `NODE_ENV` | server | `production` on the host |
| `PORT` | server | **set by the host**, do not set it yourself |
| `VITE_USE_MOCK_API` | client, at build time | only `false` turns demo mode off; unset means on |
| `VITE_API_BASE_URL` | client, at build time | the API's public URL, no trailing slash |

Every `VITE_` value is compiled into the built JavaScript and is **public**.
Never put a key, a password, or a connection string in one.

## Deploying

**Client, to GitHub Pages.** Wired up in `.github/workflows/deploy-pages.yml`,
triggered on pushes to `client/**`. `VITE_USE_MOCK_API` and
`VITE_API_BASE_URL` are set under **Settings > Secrets and variables >
Actions > Variables** (not Secrets — these end up in the public JS bundle
regardless). Pages source is **Settings > Pages > Build and deployment >
Source: GitHub Actions**.

**API, to Render.** Root directory `server`, build `npm install`, start
`npm start`. `DATABASE_URL`, `CORS_ORIGINS`, `BASIC_AUTH_USER`,
`BASIC_AUTH_PASS`, and `NODE_ENV` are set in Render's dashboard.

**Database, on Neon.** `server/db/schema.sql` has already been run against
it (see [Environment variables](#environment-variables) above for what
Render needs to connect to it).

## Project structure

```
client/                       React front end, built by Vite
  src/api/                    ONE interface, two implementations (mock/real), chosen by a variable
  src/apiClient.js            adapter so pages can call api.getLoads() etc.
  src/components/
    atoms/                    Button, FormControl, Badge
    molecules/                StatCard, LoadCard, ClothingCard
    organisms/                NavBar (sidebar on desktop, slide-out drawer on phone)
  src/pages/                  DashboardPage, LogLoadPage, ClothingPage, HistoryPage
  src/styles.css               design tokens (colors, spacing, type) + component styles
server/                       Express API
  server.js                   routes, CORS, Basic Auth, validation, error handling
  loadsRepo.js                 data-access functions for loads
  clothingRepo.js              data-access functions for clothing
  db/                          pool.js, schema.sql
docs/                          proposal, wireframes, design system, weekly reports
```

## Architecture

The client (GitHub Pages) talks to the Express API (Render) over HTTPS,
sending an `X-Device-Id` header with every request so the API can scope data
per device without requiring accounts. The API is gated with HTTP Basic Auth
in front of every route. The API is the only thing that
talks to PostgreSQL (Neon) — the client never connects to the database
directly.

## What I would do next

- Add real user accounts so laundry history follows a person across devices
  instead of being tied to one browser's `localStorage`
- Add the date/load-type filter on the History screen (designed, not yet built)
- Let a user edit or delete a logged load or clothing item from the UI
  (the API already supports `DELETE`, the interface doesn't use it yet)

## Author

Jeremiah — Computer Science student, Holy Angel University.

## AI use

Built with heavy AI assistance (Claude) across planning, wireframing, the
design system, and most of the application code. See
[AI-USAGE.md](./AI-USAGE.md) for the full account.

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

## Licence

MIT, see [LICENSE](./LICENSE).
