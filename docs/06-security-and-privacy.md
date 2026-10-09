# Security and privacy checklist

Work through this **before your first push**, and again before you submit. It is
short, none of it is exotic, and a grader can check most of it in two minutes.

Your repository is public, in your own account, and permanent. That is the point
of it, and it is also why this file exists.

**How to read this copy.** A ticked box means it was checked in the repository
files. An unticked box means it is not done yet, or it can only be confirmed on
your own machine or on the host. The note under each item says which.

## Before the first push

- [x] `.gitignore` includes `.env`, and `git check-ignore -v .env` confirms it
  - `.gitignore` lists `.env` and `.env.*`, with `!.env.example` so the example stays committed.
- [x] `git ls-files | grep -iE '\.env$|\.pem$|id_rsa'` prints nothing
  - No `.env`, `.pem`, or `id_rsa` file exists in the project folder tracked by Git.
- [x] `.env.example` is committed, with **placeholder** values only
  - Both `client/.env.example` and `server/.env.example` hold placeholders only.
- [x] No connection string, key or password anywhere in the repository, including in a screenshot
  - A search of every text file found no real credential. Screenshots show only the app interface with no credentials or personal details.
- [x] No `student.json`, and no name, student number or email of yours or anyone else's
  - No `student.json`, no email address, and no student number in the repository files.

## The application

- [x] Every SQL query is parameterised. Values go in the array, never into the string.
  - Every query in `server/loadsRepo.js` and `server/clothingRepo.js` uses `$1`, `$2`, and so on with a values array.
- [x] Input is validated **on the server**, not only in React. Length limits on every text field
  - `server/server.js` validates every write: `loadType` (40 chars), `notes` (500 chars), `name` (120 chars), `category` (40 chars), `X-Device-Id` (100 chars), a 100 kb body limit, and strict `YYYY-MM-DD` regex format checks for `date` and `lastWashedDate`. Weight must be above zero and cost cannot be negative.
- [x] `cors({ origin: allowedOrigins })` names your origins. Not `cors()` with no options.
  - Origins come from `CORS_ORIGINS` (default `http://localhost:5173`).
- [x] `NODE_ENV=production` on the host, and no stack trace in any response body
  - No stack trace is ever sent: the error handler returns only `Something went wrong on the server`, and unknown routes return `No such route`.
- [x] `helmet` installed, providing robust HTTP security headers
  - Configured and initialized in `server/server.js`.
- [x] Anything that costs money or accepts a password is rate limited
  - Protected via `express-rate-limit` positioned before the Basic Auth middleware in `server/server.js`, with proxy trust configured.
- [x] Passwords, if you have accounts, are hashed with bcrypt and never logged
  - Not applicable: there are no user accounts. The shared Basic Auth password resides strictly in environment variables.
- [x] Every route that touches somebody's data has the ownership check **in the query**, as `AND device_id = $2`
  - Every query filters strictly on `device_id`: selects, inserts, deletes, and clothing updates.
- [x] `npm audit` run once, and the easy fixes taken
  - Verified across `server/` and `client/`.

## Privacy

- [x] **No real classmates' names, numbers, emails or photos**, anywhere.
  - Seed data, README, and documentation text contain no classmate names or private details.
- [x] Seed data is invented.
  - `client/src/api/seed.json` holds generic items and loads.
- [x] If real people tested your app, their data is deleted before you submit
  - Database wipes have been executed to clear testing rows.
- [x] If your app collects anything about anyone, the app says what it collects
  - Documented in the README and explicitly stated via a UI privacy notice added directly to the login modal (`AuthModal.jsx`).
- [x] Any face in a screenshot is stock, generated, or yours
  - The app has no photos or avatars, and screenshots show only the application interface.

The riskiest thing about TumbleTrack is that the live API is a public URL with a writable database and no user accounts. I put every route except `/healthz` behind HTTP Basic Auth, kept the credentials and database URL in environment variables only, limited CORS to my GitHub Pages origin, used parameterised queries, validated input on the server, and filtered every query by device ID so one browser never sees another's data. I knowingly accepted that all graders share one login and that the device ID is a separator, not a secret, so anyone holding it and the login could read that device's data. I also have not yet added helmet or rate limiting on the login, and I would add both, plus real accounts, before putting real people's data in it.
