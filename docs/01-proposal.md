# TumbleTrack — App Proposal
 
**App Name:** TumbleTrack — Laundry Tracker
 
**Status:** Live since **September 28, 2026**. Demo mode is **off**: the client is built with `VITE_USE_MOCK_API=false` and talks to the real API and database. Details in Section 9.
 
---
 
## 1. App Purpose
 
A laundry tracker that helps students living away from home log each laundry load they do and keep tabs on when special or delicate items (the ones they don't want to over-wash or forget when they were last washed) were last cleaned, enabling them to plan wash days and monitor their laundry spending.
 
---
 
## 2. Target Audience
 
* **Target Users:** Students living in dorms, boarding houses, or shared apartments who manage their own laundry without relying on a household routine.
* **User Context & Pain Points:** Upon opening the app, users are either preparing to log a new load (recording date, type, cost, and notes) or trying to remember whether specific items are clean, overdue for washing, or sitting in a dirty pile.
---
 
## 3. App Structure & Routes
 
* **Dashboard (`/`):** The primary view displaying weekly statistics (loads completed, total spend, clean items, overdue items) and recent load history.
* **Log Load (`/log`):** Form interface to register new laundry loads with fields for date, load type, weight, cost, notes, and optional clothing item tags.
* **Clothing (`/clothing`):** Inventory view to browse and manage delicate or special clothing items by category and last-washed date, with an option to add new items.
* **History (`/history`):** Complete historical record of all past laundry loads, filterable by date and load type to track overall spending and washing frequency.
---
 
## 4. Core Features and Stretch Goals
 
### Core features (shipped)
 
* **Log a load:** date, load type (Machine wash, Hand wash, Dry clean), weight in kg, cost in ₱, and optional notes. The Save button stays disabled until the required fields are filled in.
* **Tag special clothing in a load (optional):** tagging an item sets its last-washed date to the load's date.
* **Track special and delicate clothing:** name, category, and last-washed date, added through a modal (bottom sheet on a phone, centered dialog on desktop).
* **Weekly dashboard:** loads this week, total spent, clean items, and overdue items (more than 7 days since last washed), plus recent loads.
* **History with filters:** a table on desktop and stacked cards on a phone, filterable by date range and load type.
* **Data separation without accounts:** a random device ID per browser, sent as `X-Device-Id`, scopes every database row and query.
* **Access gate:** one shared HTTP Basic Auth login in front of every API route except `/healthz`, required because the app has no user accounts and a public, writable API.
* **Responsive layout:** sidebar navigation on desktop and a slide-out menu drawer on a phone.
* **Demo mode:** a browser-only simulated backend, kept in the code so the interface still works if the API is unavailable (off in the live deployment).
### Stretch goals (cut or deferred, and why)
 
| Item | Status | Why it was cut or deferred |
| :--- | :--- | :--- |
| Photo for each clothing item | Cut | Needs file upload and image storage outside Postgres. It does not change what the app does, so it was the first thing to drop. |
| Number of clothes per load | Replaced by weight | Item count was not a useful unit. Weight is easier to enter and matches how laundromats price a load. |
| Tracking the whole wardrobe | Cut | Maintaining every garment is a chore users would abandon. Clothing is scoped to special and delicate items only, which is also why tagging items in a load is optional. |
| Individual user accounts (signup, login) | Cut | More than the project's scope needs. Replaced by device-ID data separation behind one shared Basic Auth login. |
| Editing an existing load or clothing item | Not built | Listed as "added/edited" in the original state table, but only creating and listing were built. Needs a PATCH route, a repo function, a client function, and a pre-filled form for each entity. |
| Date and load-type filter on History | Deferred, then built | Left out of the first design pass to protect the schedule, then added in September 2026. It is now a core feature. |
| Offline mode with an on-device database | Cut | Needs sync and conflict handling, which is far more complexity than a laundry log needs. |
| Pagination on History | Not built | Fine for a small personal log. Every load is fetched at once. |
| Saving a load and updating wash dates atomically (transaction), with tagged clothing in its own join table | Not built | Today the load is inserted first and the wash dates are updated second, so a failure in between leaves stale dates. Documented as a known limitation. |
| Automated tests | Not built | Testing was manual, on desktop and on a real phone. |
| Cloudflare Zero Trust as the access gate | Not used | Needs a domain in my own Cloudflare account. The `github.io` and `onrender.com` addresses cannot carry an Access policy, so shared Basic Auth was used instead. |
 
### Changes from the original plan
 
These are differences between the sections of this proposal and what shipped.
 
* **Clothing categories:** the starter list in Section 7 (Shirts, Pants, Underwear, Bedding, Towels, Delicates) became Delicate, Whites, Heavy Fabric, Lights, Darks, Lint Givers, and Heavily Soiled. The shipped categories describe how an item should be washed, which is what the app is meant to help with.
* **Dashboard stat grid:** it shows four figures (loads this week, total spent, clean items, overdue items), not three.
* **Seed data:** sample loads and clothing exist only in demo mode. The live database starts empty.
---
 
## 5. App State & Data Architecture
 
| Data State | Shape | Owner / Source | Trigger / Change Event |
| :--- | :--- | :--- | :--- |
| **`loads`** | `[{ id, date, loadType, weight, weightUnit, cost, notes, clothingIds? }]` | Dashboard Page | User logs a new load via the Log Load page. |
| **`stats`** | `{ loadsThisWeek, totalSpent, overdueCount }` | Dashboard Page (computed from `loads` & `clothing`) | Updates when `loads` or `clothing` entries change. |
| **`clothing`** | `[{ id, name, category, lastWashedDate }]` | Dashboard Page (fetched via API, shared with Clothing screen) | Updates when a load tags an item or when an item is added/edited. |
 
---
 
## 6. Screen Specifications
 
### Screen 1: Dashboard
* **Block 1: Stat Grid** — Displays current week metrics: loads this week, total amount spent, and overdue items count.
* **Block 2: Recent Loads List** — Displays the most recent laundry entries from `loads`.
* **Block 3: Quick Action** — "Log a load" button linking directly to the Log Load page.
### Screen 2: Log Load
* **Block 1: Load Details Form** — Input fields for Date, Load Type, Weight (kg), Cost (₱), and optional Notes.
* **Block 2: Clothing Item Tagging** — Optional checkboxes linked to items from the Clothing page.
* **Block 3: Form Action** — "Save" button to validate and record the load entry.
### Screen 3: Clothing Inventory
* **Block 1: Header Action** — "Add Clothing Item" button triggering the entry modal.
* **Block 2: Entry Modal** — Popup modal with fields for Name, Category select, and optional Last-Washed Date, with "Save" and "Cancel" buttons.
* **Block 3: Clothing Cards Grid** — Card components displaying Item Name, Category badge, and Last-Washed Date.
### Screen 4: History
* **Block 1: Filter Bar** — Filter inputs to sort/search past loads by date range or load type.
* **Block 2: Load Log Display** — Responsive data table for desktop (Date, Load Type, Weight, Cost, Notes) and stacked Load Cards for mobile devices.
---
 
## 7. Content & Visual Assets
 
* **App Branding & Logo:** Official app logo representing TumbleTrack's core laundry-tracking functionality (integrated into the navigation header and documentation assets in `docs/assets/`).
* **Starter Categories:** Pre-defined clothing categories for dropdown selects (e.g., Shirts, Pants, Underwear, Bedding, Towels, Delicates). *Changed in the shipped app; see "Changes from the original plan" in Section 4.*
* **Overdue Threshold:** Default 7-day threshold for "last washed" status to calculate overdue items on the Dashboard.
* **Seed Data:** Pre-populated sample loads and clothing items for testing the UI before live API data is connected.
---
 
## 8. Where Each Piece Is Hosted
 
| Piece | Host | Address | The free tier's catch |
| :--- | :--- | :--- | :--- |
| **Client** (React, built by Vite) | GitHub Pages | https://JerJers.github.io/TumbleTrack/ | The repository must be public to publish on a free account, and Pages serves static files only, so nothing server-side can run there. A project page is served from a subfolder (`/TumbleTrack/`), which is why the build sets `VITE_BASE_PATH`. |
| **API** (Express) | Render (web service) | https://tumbletrack.onrender.com | A free web service spins down after a period of inactivity, and the first request afterward can take up to a minute while it wakes. |
| **Database** (PostgreSQL) | Neon, AWS Asia Pacific 1 (Singapore) | Private connection string, stored only in Render's environment settings | Free compute scales to zero after a few minutes of inactivity, so the first query after a quiet period is slower. Storage and compute allowances are capped and can change, so they are checked in the Neon dashboard rather than assumed. |
 
The two sleeping services stack: after a quiet period, the first request can wake both Render and Neon.
 
**Access gate:** the API is protected by one shared HTTP Basic Auth login (`BASIC_AUTH_USER` and `BASIC_AUTH_PASS`, set in Render's environment settings and never committed). The credentials are shared with graders through a private channel, not through this repository.
 
### Host changes
 
| Date | Change | Reason |
| :--- | :--- | :--- |
| September 2026 (before launch) | Database: in-memory storage in the API process, then Neon PostgreSQL | The first build skipped the database so the interface could be finished first. Real persistence was needed before going public, and in-memory data is lost on every restart or sleep. |
| September 2026 (before launch) | Considered dropping Render and using only Neon, then kept Render | Neon is only a database and cannot run an Express server, so the API still needs a host. Nothing changed. |
| September 28, 2026 | Went live | None. No host has changed since launch. |
 
---
 
## 9. Demo Mode
 
* **Went live and demo mode turned off:** **September 28, 2026.**
* **Current status:** **OFF.** The live site is built with `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` pointing at the Render API, and it reads and writes the Neon database.
* **How to confirm:** open the live site in a private window. There should be no "Demo mode" banner, and the app should ask for the shared username and password before showing data.
* **Why this matters:** demo mode is the default. Only the exact value `false` turns it off, so if that variable is ever deleted or mistyped, the live site silently falls back to the simulated backend and shows the banner. Check the GitHub Actions variables first if the banner ever returns.
---
 
## 10. Technical Risks
 
### Original risk
 
* **Risk:** Device-ID-based data separation (no account login; each device only accesses its own local data).
* **Mitigation Strategy:** Ensure the generated device identifier reliably persists in browser local storage across sessions and is attached to every API request header, preventing cross-device data leaks or unexpected data loss.
### What happened to it
 
| Risk | Outcome | What happened |
| :--- | :--- | :--- |
| Device-ID separation might fail to persist or leak data | **Shrank** | The ID is generated once, kept in `localStorage`, sent on every request, and every query filters by `device_id`. What remains is an accepted trade-off: clearing site data or switching browsers starts a blank history. The ID also is not authentication, which is why the Basic Auth gate exists. |
| A public API with no login could have its data written or deleted by anyone | **Grew into a new problem, then shrank** | Fixed with shared Basic Auth. It then turned out the browser's native login popup does not reliably appear on phones for cross-origin requests, so the app now asks for credentials itself and attaches an `Authorization` header to every request. Remaining weakness: one shared password, kept in the browser's `localStorage`. |
| Free tiers sleep when idle | **Grew** | Not in the original proposal. Both Render and Neon sleep, so the first request after a quiet period is slow. Accepted for a course project. |
| Saving a load is two separate steps | **Appeared, still open** | Inserting the load and updating the tagged clothing's wash dates are not in one transaction, so a failure in between leaves stale dates. Logged as a known limitation and a stretch goal. |
| Build and deploy mismatches | **Appeared, resolved** | A `package-lock.json` that did not match `package.json` broke `npm ci` in GitHub Actions, and the health check endpoint rejected requests that carried no device ID. Both were fixed. |
| Cross-origin requests from GitHub Pages blocked by CORS | **Turned out to be nothing** | Once `CORS_ORIGINS` was set to the Pages origin, requests went through. The phone test returned the server's own "Authentication required" message, which shows cross-origin responses were reaching the app. |
| Neon's SSL-mode warning in the Render logs | **Turned out to be nothing** | An advisory from the `pg` driver about a future change. The app was never affected. |
| Building a scaffold before checking the course template | **Grew into rework** | The first scaffold used my own folder structure, and a large part had to be re-adapted into the template's repo pattern and demo/live switch. |
