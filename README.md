# TumbleTrack

[![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)](AI-USAGE.md)

**AI disclosure:** I used Claude heavily for planning, wireframes, the design system, most of the application code, and deployment troubleshooting. I supplied the requirements, rewrote and refactored the four page components, tested the results, and documented each use in [AI-USAGE.md](AI-USAGE.md).

TumbleTrack is a laundry tracker for students living in dorms, boarding houses, or shared apartments. It lets you log every laundry load and keep track of when special or delicate clothing was last washed, without creating an account.

* **Live application:** https://JerJers.github.io/TumbleTrack/
* **API liveness:** https://tumbletrack.onrender.com/healthz
* **Source code:** https://github.com/JerJers/TumbleTrack
* **Demo video:** [Watch the demo video on Google Drive](https://drive.google.com/file/d/1pKY-brGu_rabPanu4Ez-IIeLyASwaYGX/view?usp=sharing)

## 1. Project overview

TumbleTrack keeps a simple record of laundry activity: what was washed, how heavy it was, what it cost, and which special items were included. A dashboard turns that record into a quick weekly summary and flags tracked items that are overdue for a wash.

### Main features

* Log a laundry load with its date, load type, weight in kg, cost in pesos, and optional notes.
* Tag special or delicate clothing items on a load. Their last washed date updates to the load's date automatically.
* Track special or delicate clothing items (not your whole wardrobe) with a category and a last washed date.
* View a dashboard with loads in the last 7 days, total spent, clean items, overdue items, and the most recent loads.
* Browse the full laundry history and filter it by date range and load type.
* See a table on desktop and stacked cards on phones.
* Use the app without an account. Each browser gets a random device ID that keeps its data separate from everyone else's.
* Try the interface in demo mode, which needs no server or database.

## 2. Technology

| Part | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, plain CSS |
| Backend | Node.js 20 or newer, Express |
| Database | PostgreSQL (Neon) |
| Hosting | GitHub Pages (client), Render (API), Neon (database) |

### Architecture

The client is a React single page app hosted on GitHub Pages. It talks to an Express API on Render over HTTPS and sends an `Authorization` header (HTTP Basic Auth) and an `X-Device-Id` header with every request. The API checks the credentials, validates the request, and then reads or writes PostgreSQL on Neon. Every database query filters by the device ID, so one device never sees another device's rows. The client never connects to the database directly.

The client has one data interface with two implementations, chosen at build time by `VITE_USE_MOCK_API`. In demo mode (the default) a simulated backend stores everything in the visitor's own browser. When the variable is set to `false`, the client calls the real API at `VITE_API_BASE_URL`.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset or `true` | Demo mode. Data lives in the browser's `localStorage`. No server, no database, nothing shared. A "Demo mode" notice is shown on the Dashboard. |
| `false` | The client calls the Express API, which reads and writes PostgreSQL. |

Only the exact string `false` turns demo mode off, so a forgotten or mistyped variable keeps the safe simulated backend. The live site is deployed with `VITE_USE_MOCK_API=false`.

## 3. Run TumbleTrack locally

Follow these steps to set up a local development copy.

### Quick option: client only, in demo mode

No database is needed.

    git clone https://github.com/JerJers/TumbleTrack.git
    cd TumbleTrack/client
    npm install
    cp .env.example .env
    npm run dev

Open http://localhost:5173. Leave `VITE_USE_MOCK_API=true` in `client/.env`. Demo mode has no login window, and the sample data resets if you clear your browser data.

### Full option: client, API, and database

#### Step 1: Install the requirements

Install Git and Node.js 20 or newer with npm. You also need a PostgreSQL database. A free hosted database on Neon is the easiest choice.

#### Step 2: Clone the repository

    git clone https://github.com/JerJers/TumbleTrack.git
    cd TumbleTrack

#### Step 3: Install dependencies

    cd server
    npm install
    cd ../client
    npm install

#### Step 4: Create and configure the environment files

    cd ../server
    cp .env.example .env
    cd ../client
    cp .env.example .env

Fill in the values for your machine. The example files contain placeholders only.

| Variable | Where | Purpose | Local example |
| --- | --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string (contains a password) | `postgresql://user:pass@host.neon.tech/dbname?sslmode=require` |
| `CORS_ORIGINS` | server | Comma separated origins allowed to call the API | `http://localhost:5173` |
| `BASIC_AUTH_USER` | server | Username required for every route except `/healthz` | Set your own value |
| `BASIC_AUTH_PASS` | server | Password required for every route except `/healthz` | Set your own value |
| `NODE_ENV` | server | `development` locally, `production` on the host | `development` |
| `PORT` | server | Set by the host. Do not set it yourself | (leave unset, defaults to 3000) |
| `VITE_USE_MOCK_API` | client, build time | Only `false` turns demo mode off | `false` |
| `VITE_API_BASE_URL` | client, build time | The API's public URL, no trailing slash | `http://localhost:3000` |

Set both `BASIC_AUTH_USER` and `BASIC_AUTH_PASS`. If either is missing, every request is rejected with a 401.

Keep `.env` files private. Do not commit them to GitHub, include credentials in screenshots, or put secrets in a `VITE_` variable. Every `VITE_` value is compiled into the built JavaScript and is public.

#### Step 5: Prepare the database

The API connects to PostgreSQL with SSL turned on (see `server/db/pool.js`), so use a hosted database such as Neon. A local PostgreSQL server without SSL will refuse the connection unless you change that file.

Apply the schema once. It is safe to run more than once.

    cd server
    node --env-file=.env db/run-schema.js

You can also paste the contents of `server/db/schema.sql` into Neon's SQL editor.

#### Step 6: Start the API

    cd server
    npm run dev

The API runs at http://localhost:3000.

#### Step 7: Start the client

Open a second terminal.

    cd client
    npm run dev

Open http://localhost:5173. A Log in window asks for the `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` values from `server/.env`.

#### Step 8: Check the API health

Open http://localhost:3000/healthz to check that the web service is responding. This endpoint is public and does not check the database.

To check the database connection, call `/readyz` with your credentials:

    curl -u youruser:yourpass http://localhost:3000/readyz

It returns `{"ok":true,"db":"up"}` when the database is reachable. To test the data routes directly:

    curl -u youruser:yourpass http://localhost:3000/api/loads -H "X-Device-Id: test"

## 4. Use the application step by step

### Step 1: Open the app and log in

Open the live application. When the app is connected to the real API, a **Log in** window asks for the shared username and password. The credentials for the live deployment are shared with graders through a private channel, not in this repository. The browser remembers them. If they are wrong, the app forgets them and asks again on the next request. In demo mode there is no login window.

### Step 2: Add special or delicate clothing items

1. Open the **Clothing** screen.
2. Select **+ Add Clothing Item**.
3. Enter the item's name.
4. Choose a category: Delicate, Whites, Heavy Fabric, Lights, Darks, Lint Givers, or Heavily Soiled.
5. Optionally choose the last washed date. If you leave it blank, today's date is used.
6. Select **Save**.

Each item appears as a card with its name, a category badge, and its last washed date. This screen is for special or delicate items only, not your whole wardrobe.

### Step 3: Log a laundry load

1. Open the **Log load** screen.
2. Check the date. It starts as today.
3. Choose the load type: Machine wash, Hand wash, or Dry clean.
4. Enter the weight in kg and the cost in pesos.
5. Optionally add notes.
6. Optionally tick the tracked clothing items that were in the load.
7. Select **Save**.

The Save button stays disabled until the date, load type, weight, and cost are filled in, and while a save is in progress. After saving, the app returns to the Dashboard. Every ticked clothing item gets its last washed date set to the load's date.

### Step 4: Read the dashboard

Open the **Dashboard**. It shows four figures and the most recent loads:

* **Loads:** loads dated in the last 7 days.
* **Total Spent:** the total cost of all logged loads.
* **Clean items:** tracked clothing items that were washed within the last 7 days.
* **Overdue:** tracked clothing items last washed more than 7 days ago.
* **Recent loads:** the five newest loads in your history.

Use **+ Log Load** at the bottom to go straight to the form.

### Step 5: Browse and filter your history

1. Open the **History** screen.
2. Optionally set a **From** date, a **To** date, or a **Load type**.
3. The list narrows immediately. If nothing matches, a message says so.
4. Select **Clear Filter** to reset. The button only appears while a filter is active.

On desktop, the loads are shown in a table. On phones, they are shown as cards. Under 768 pixels wide, the navigation turns into a slide out menu opened with the menu button.

## 5. How the numbers are calculated

All figures are calculated in the browser from the loads and clothing items returned by the API.

| Figure | How it is worked out |
| --- | --- |
| Loads | Count of loads whose date is within the last 7 days |
| Total Spent | Sum of the cost of every logged load, not only this week |
| Overdue | Tracked items last washed more than 7 days ago (`OVERDUE_DAYS = 7`) |
| Clean items | Number of tracked items minus the overdue items |
| Recent loads | The first five loads in the list returned by the API |

The API returns loads newest first. Weight is always stored in kg and cost in pesos.

## 6. API overview

Every route except `/healthz` requires HTTP Basic Authentication. Data routes also require an `X-Device-Id` header of up to 100 characters, which the client generates and stores on first launch.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/healthz` | Public liveness check, returns no database details |
| GET | `/readyz` | Authenticated database connectivity check |
| GET | `/api/loads` | List this device's loads, newest first |
| POST | `/api/loads` | Create a load and update the last washed date of tagged clothing |
| DELETE | `/api/loads/:id` | Delete one of this device's loads |
| GET | `/api/clothing` | List this device's clothing items |
| POST | `/api/clothing` | Create a clothing item |
| DELETE | `/api/clothing/:id` | Delete one of this device's clothing items |

The server validates every write, because the client can be bypassed:

* **Loads:** `date` and `loadType` are required, `loadType` is at most 40 characters, `weight` must be greater than 0, `cost` must be 0 or more, and `notes` are at most 500 characters.
* **Clothing:** `name` is required and at most 120 characters, and `category` is at most 40 characters.
* **Requests:** JSON bodies are limited to 100 kb.

Errors return a JSON body with an `error` message. A missing or invalid device ID returns 400, wrong credentials return 401, and an unknown or foreign row returns 404 on delete. Refer to `server/server.js` for exact request fields and response shapes.

## 7. Project structure

    TumbleTrack/
    ├── .github/workflows/
    │   └── deploy-pages.yml     Builds and publishes the client to GitHub Pages
    ├── client/                  React front end, built by Vite
    │   ├── src/
    │   │   ├── api/             index.js (mock or real switch), httpApi.js, mockApi.js,
    │   │   │                    authCredentials.js, deviceId.js, seed.json
    │   │   ├── apiClient.js     Adapter so pages can call api.getLoads() and similar
    │   │   ├── components/
    │   │   │   ├── atoms/       Button, FormControl, Badge
    │   │   │   ├── molecules/   StatCard, LoadCard, ClothingCard
    │   │   │   ├── organisms/   NavBar, AuthModal
    │   │   │   └── DemoNotice.jsx
    │   │   ├── pages/           DashboardPage, LogLoadPage, ClothingPage, HistoryPage
    │   │   ├── App.jsx          Routes and layout
    │   │   └── styles.css       Design tokens and component styles
    │   ├── .env.example         Client environment template
    │   └── vite.config.js
    ├── server/                  Express API
    │   ├── server.js            Routes, CORS, Basic Auth, validation, error handling
    │   ├── loadsRepo.js         Data access for loads
    │   ├── clothingRepo.js      Data access for clothing
    │   ├── db/                  pool.js, schema.sql, run-schema.js, run.js
    │   ├── Dockerfile           Optional, for self hosting
    │   └── .env.example         Server environment template
    ├── docs/
    │   ├── assets/              Screenshots
    │   ├── 01-proposal.md
    │   ├── 02-mockup.md
    │   ├── 03-design-system.md
    │   ├── 04-weekly-reports.md
    │   ├── 05-demo-video.md
    │   └── 06-security-and-privacy.md
    ├── AI-USAGE.md              AI assistance record
    ├── LICENSE                  Project license
    └── README.md

## 8. Screenshots

These are screenshots of the running application. They are stored in `docs/assets/`.

### Desktop

![Dashboard](docs/assets/Dashboard.png)

![Log a load](docs/assets/logLoad.png)

![Clothing items](docs/assets/Clothing.png)

![Add clothing item](docs/assets/AddClothing.png)

![History with filters](docs/assets/History.png)

### Mobile

![Mobile dashboard](docs/assets/MobileDashboard.png)

![Mobile log a load](docs/assets/MobileLogLoad.png)

![Mobile Clothing](docs/assets/MobileClothing.png)

![Mobile Clothing](docs/assets/MobileAddClothing.png)

![Mobile history](docs/assets/MobileHistory.png)

Design references (mockups and the design system) are in `docs/02-mockup.md` and `docs/03-design-system.md`. The live application is the source of truth for the implemented interface.

## 9. Deployment notes

The live demo uses three services. Service availability and account settings can change, so verify each dashboard before relying on them.

**Database, on Neon.** Run `server/db/schema.sql` against the database once, before the API starts. Copy the connection string for `DATABASE_URL`.

**API, on Render.**

* **Root directory:** `server`
* **Build command:** `npm install`
* **Start command:** `npm start`
* **Node.js:** version 20 or newer
* **Environment variables:** `DATABASE_URL`, `CORS_ORIGINS`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`, `NODE_ENV=production`. The host provides `PORT`.
* **Health check:** `/healthz`

`CORS_ORIGINS` must contain the Pages origin only, such as `https://jerjers.github.io`, with no path and no trailing slash. It can only be set correctly after the Pages URL exists.

**Client, on GitHub Pages.** The workflow in `.github/workflows/deploy-pages.yml` builds the client and publishes it whenever changes under `client/` are pushed to `main`. Set these under **Settings > Secrets and variables > Actions > Variables** (variables, not secrets, because they end up in the public JavaScript):

| Variable | Value |
| --- | --- |
| `VITE_USE_MOCK_API` | `false` |
| `VITE_API_BASE_URL` | The Render API URL, with no trailing slash |

Also set **Settings > Pages > Build and deployment > Source** to **GitHub Actions**, and keep the repository public, because the free plan only publishes public repositories.

Recommended order: schema on Neon, then the API on Render, then note the API's URL, then set the GitHub variables, then deploy Pages, then return to Render and set `CORS_ORIGINS`. Set secrets through each host's environment settings, never in source code. Use HTTPS so Basic Auth credentials are protected in transit. If the API runs on a free Render plan, the first request after a quiet period can take a while while the service wakes up.

## 10. Security and privacy notes

* The app uses one shared HTTP Basic Auth login, not individual accounts. Every route except `/healthz` is gated, so a random visitor cannot read, write, or delete data.
* The device ID separates one browser's data from another's. It is not a password. Clearing your browser data creates a new device ID and you lose access to the old data.
* After you log in, the browser keeps the credentials in `localStorage` in encoded form (Base64), which is not encryption. Use a private device and the live site's HTTPS link.
* Credentials, database URLs, and other secrets live only in environment variables. They are never in the repository, and `.env` files are ignored by Git.
* Every `VITE_` value is public. Only the API address and the demo mode switch are set that way.
* CORS only allows the origins listed in `CORS_ORIGINS`.
* Database queries are parameterized and always filter by device ID.
* The server validates all input, because the client can be bypassed.
* The database connection uses SSL but does not verify the server certificate (`rejectUnauthorized: false`), which is a convenience for Neon in a course project.
* Use fictional data in demonstrations and course submissions.
* This is a course project and should not be treated as a fully audited system. See `docs/06-security-and-privacy.md` for the checklist I worked through.

## 11. Known limitations and future improvements

* There is no screen to edit or delete a logged load or a clothing item. The API already supports `DELETE`, but the interface does not use it yet.
* There are no user accounts. Data belongs to one browser, and everyone with the shared login uses the same login.
* The dashboard's Total Spent covers every logged load, not only the current week.
* On the Dashboard, Log load, and History screens, a failed data request is only written to the browser console and the screen shows its empty state. The Clothing screen shows no message if its list fails to load.
* There is no pagination for long histories, and there are no automated tests.
* Demo mode data lives in one browser and disappears when browsing data is cleared.

### What I would do next

* **Add edit and delete controls** to loads and clothing items using the existing `DELETE` routes.
* **Add real user accounts** so laundry history follows a person across devices instead of one browser.
* **Show clear error messages** on every screen and add automated tests for the filter, the overdue calculation, and the API routes.

## 12. Author and course

6APSI, Holy Angel University  
GitHub: [JerJers](https://github.com/JerJers)

## 13. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file.
