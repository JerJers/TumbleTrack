![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

This project was built with heavy AI assistance (Claude, Anthropic) across
planning, design, the application build, and deployment troubleshooting.

### How I used AI

#### 2026-09-25 - React + Express application build (core)

- **Tool:** Claude
- **What I asked for:** A working React (Vite) client and Express API matching
  the wireframes and design system.
- **What it gave back:** A component tree using atomic design
  (atoms/molecules/organisms), four page components, an Express API, and a
  per-device ID scheme (`X-Device-Id` header) so one browser's data never
  mixes with another's, with no accounts needed.
- **What I kept, what I changed, and why:** Kept the device-ID approach as
  the app's entire data-separation model.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/a43400bddf1a59578a5e1daad218d8c2ae5a5b90

#### 2026-09-25 - Adapting the app to the course starter template (server files)

- **Tool:** Claude
- **What I asked for:** Move the working app into the HAU-6APSI final-project
  template, replacing its example "ghost sightings" entity with `loads` and
  `clothing`, while keeping the template's mock/live API switch
  (`VITE_USE_MOCK_API`).
- **What it gave back:** `loadsRepo.js` and `clothingRepo.js` following the
  template's repo pattern, updated `server.js` routes, and an `apiClient.js`
  adapter so existing pages could call the template's `api/index.js` without
  a full rewrite.
- **What I kept, what I changed, and why:** Kept the template's `DemoNotice`
  banner and mock/live switch, since they were better than what I had. Used
  an adapter file instead of rewriting every page, to keep the diff small.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/8a3325cf76e07c0d7cea602b3d99db82117ab636

#### 2026-09-26 - Lock file sync (react-router-dom)

- **Tool:** Claude
- **What I asked for:** Help after `npm ci` failed on Render/GitHub Actions
  with a lock-file mismatch for `react-router-dom`.
- **What it gave back:** Instructions to run `npm install` locally to
  regenerate `package-lock.json` so it matched `package.json`, then commit
  both together.
- **What I kept, what I changed, and why:** Committed the regenerated lock
  file as instructed — `npm ci` passed afterward.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/2cc084cd6258a2812666d072dacb326b8d83887b

#### 2026-09-27 - Main page change

- **Tool:** Claude
- **What I asked for:** An update to the main/landing page after testing the
  routed version.
- **What it gave back:** Adjustments to the Dashboard page.
- **What I kept, what I changed, and why:** Kept the change after confirming
  it in the running app.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/83ee853dd9198a6fc227672c4569f1b63e86698e

#### 2026-09-25 - HTTP Basic Auth: initial middleware

- **Tool:** Claude
- **What I asked for:** After a course reminder about public repos with a
  live database and no login, help implementing "Option B" (HTTP Basic Auth
  middleware), since I don't have a custom domain for Cloudflare Zero Trust.
- **What it gave back:** Express middleware that decodes the `Authorization`
  header and compares it to `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`
  environment variables, gating every route except `/healthz`.
- **What I kept, what I changed, and why:** Chose Option B myself based on my
  constraints, and set the credentials as environment variables.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/8a3325cf76e07c0d7cea602b3d99db82117ab636

#### 2026-09-27 - Filter feature for History/Clothing views

- **Tool:** Claude
- **What I asked for:** A filter feature for the History/Clothing views, so
  I could narrow down loads by date range or load type instead of scrolling
  through everything.
- **What it gave back:** Filter logic and UI — date range and load-type
  controls that narrow the displayed list.
- **What I kept, what I changed, and why:** Kept it after testing it in the
  running app.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/026e2865b7dd0f8ec9d85c5dced7d68c01e9588a

#### 2026-09-27 - Error handling for failed API calls (part 1)

- **Tool:** Claude
- **What I asked for:** Proper error handling for failed API calls, instead
  of requests failing silently with nothing shown to the user.
- **What it gave back:** Error states surfaced in the UI when a request
  fails, instead of the page just doing nothing.
- **What I kept, what I changed, and why:** Kept the changes after testing
  failure cases in the running app.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/74e9edca9a24f0451cc71d389c1143b7412ba960

#### 2026-09-27 - Error handling for failed API calls (part 2)

- **Tool:** Claude
- **What I asked for:** A follow-up fix after the first error-handling pass
  didn't cover every case.
- **What it gave back:** Additional error-state handling.
- **What I kept, what I changed, and why:** Kept it after confirming the
  remaining failure case was covered.
- **Commit:** [74e71b2]https://github.com/JerJers/TumbleTrack/commit/74e71b26cc55e175dbcc1e50e27814272197346f

#### 2026-09-27 - Render health check fix

- **Tool:** Claude
- **What I asked for:** See Case below — Render's own health check was
  failing against `/healthz`.
- **What it gave back:** The fix described in the Case below.
- **What I kept, what I changed, and why:** Kept the fix after confirming
  `/healthz` worked with no credentials.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/dec02f532fbe4e6852d0bfd235b323a3011114c0

#### 2026-09-29 - HTTP Basic Auth: follow-up fix

- **Tool:** Claude
- **What I asked for:** A fix after testing the initial Basic Auth middleware.
- **What it gave back:** An adjustment to the middleware's behavior.
- **What I kept, what I changed, and why:** Kept it after re-testing.
- **Commit:** 
    - https://github.com/JerJers/TumbleTrack/commit/8bb4895d172c631fd7c330ec2a748adef8d542e8
    - https://github.com/JerJers/TumbleTrack/commit/355c46c8db5963d449edc7e29c0702dba8eff5cb 
    - https://github.com/JerJers/TumbleTrack/commit/e5674bac932328358348e86262082fd8035b808d 
    - https://github.com/JerJers/TumbleTrack/commit/60dd25db4906a8029958882ca64998cd930e37ef
    - https://github.com/JerJers/TumbleTrack/commit/12726bb7f5058d69b3883467f192ddee5056151d


#### 2026-09-29 - HTTP Basic Auth: switch to app-managed credentials

- **Tool:** Claude
- **What I asked for:** The browser's native login popup
  wasn't working reliably, so this commit is where that got fixed.
- **What it gave back:** The app asking for credentials itself instead of
  relying on the browser's native popup.
- **What I kept, what I changed, and why:** Kept this as the final working
  approach.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/263cbb0dc96ce0cb66f2af575638000fa5f4ec26

---

### Where the AI got it wrong

#### Case - Native Basic Auth popup doesn't work cross-origin on mobile
 
- **What it gave me:** `credentials: 'include'` on client `fetch()` calls and
  `credentials: true` in the CORS config, relying on the browser's native
  login popup appearing after a 401 response.
- **What was wrong with it:** It worked locally (desktop Chrome, same-origin
  during dev), but on a real phone hitting the deployed GitHub Pages +
  Render setup, no popup ever appeared. The raw 401 error text
  ("Authentication required") rendered inline on the page instead, because
  mobile browsers frequently don't show that native popup for cross-origin
  `fetch()` requests at all — it's not standardized behavior.
- **What I did instead:** Replaced the browser-native-popup approach
  entirely: the app now asks for credentials itself via `window.prompt()`,
  stores them in `localStorage`, and attaches an `Authorization` header to
  every request manually (`authCredentials.js`). This works identically on
  every browser and device, since it no longer depends on inconsistent
  native popup behavior. Confirmed working by testing on an actual phone
  after the fix, not just locally.
- **Commits (same fix, spread across several commits as I tested and
  adjusted it — I don't have distinct diffs for each one, so I'm not
  claiming a different sub-problem per commit):**
  - https://github.com/JerJers/TumbleTrack/commit/263cbb0dc96ce0cb66f2af575638000fa5f4ec26
  - https://github.com/JerJers/TumbleTrack/commit/12726bb7f5058d69b3883467f192ddee5056151d
  - https://github.com/JerJers/TumbleTrack/commit/7fa8cfdf9745e7c6e4793640b94b3274dc24fcd0
  - https://github.com/JerJers/TumbleTrack/commit/60dd25db4906a8029958882ca64998cd930e37ef
  - https://github.com/JerJers/TumbleTrack/commit/355c46c8db5963d449edc7e29c0702dba8eff5cb
  - https://github.com/JerJers/TumbleTrack/commit/8bb4895d172c631fd7c330ec2a748adef8d542e8

#### Case - Built a whole scaffold before checking the course template (server files)
 
- **What it gave me:** A complete React/Express app in a folder structure it
  invented, before the real course template's conventions (repo pattern,
  mock/live API switch, security checklist, Pages workflow) were part of the
  conversation.
- **What was wrong with it:** A large part had to be re-adapted once I
  uploaded the template: different folder names and a different data-access
  pattern.
- **What I did instead:** Ported the server logic into the real template
  instead of keeping two diverging codebases.
- **Commit:** [2b84c3a](../../commit/2b84c3a)

#### Case - package-lock.json didn't match package.json, breaking npm ci
 
- **What it gave me:** `react-router-dom` added to `client/package.json` as a
  new dependency.
- **What was wrong with it:** `package-lock.json` was never regenerated to
  match — It only edited `package.json` by hand. `npm install` would have
  silently fixed this locally, but GitHub Actions/Render run `npm ci`, which
  deliberately refuses to install anything when the two files disagree,
  rather than guessing. The build failed with
  `Missing: react-router-dom@6.30.6 from lock file`.
- **What I did instead:** Ran `npm install` locally to regenerate
  `package-lock.json` so it actually matched `package.json`, then committed
  both files together in the same commit — `npm ci` passed after that.
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/2cc084cd6258a2812666d072dacb326b8d83887b

#### Case - /healthz returned 400 instead of working with no credentials

- **What it gave me:** Basic Auth middleware that correctly skipped
  `/healthz`, but an older middleware requiring `X-Device-Id` on every request
  was never taught to skip it too.
- **What was wrong with it:** A plain `curl` to `/healthz` (which Render's
  health check does, with no headers) got `400 Missing or invalid X-Device-Id
  header`, the opposite of what a health check should do.
- **What I did instead:** Reported the exact PowerShell error output; the fix
  was adding the same `/healthz` (and `/readyz`) exemption to the device-ID
  middleware.
- **Commit:** [dec02f5](../../commit/dec02f5)

---

## Who wrote what

### Written by me

- **File:** client/src/pages/Dashboard.jsx
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/86d371916d9bc7c3429a00ece4f354884cb6bbad
- **What it does and why it is built this way:** This page serves as main home screen of the app, that shows the summary of your laundry loads in a week,
When the user opens the app, it gets the loads and clothing list at the same time, so the app doesn't need to wait for one before starting the other.
It also counts how many loads were done in the last 7 days, totals the cost of all the loads, and counts the clothing items that were washed more than 7 days ago.
In this page it only shows the 5 most recent loads, so the page stays short, clean, and easier to read.

- **File:** client/src/pages/LogLoadPage.jsx
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/86d371916d9bc7c3429a00ece4f354884cb6bbad
- **What it does and why it is built this way:** This page serves as the form for logging a new laundry load that the user finished.
All the fields (date, loadType, weight, cost, notes) are kept together in one object, which begins from a default set of values.
The save button stays disabled until the form is completely filled up correctly, and it is also disabled in saving, so the user can't submit the same load twice.
When you select a clothing item, its ID is added to or removed from a list by making a new cop of the list instead of editing the old one.
When the form is complete, the user can now press save, the weight and cost are turned into numbers and sent to the API, and an error message will show if it fails.

- **File:** client/src/pages/ClothingPage.jsx
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/86d371916d9bc7c3429a00ece4f354884cb6bbad
- **What it does and why it is built this way:** This page serves as the list for the special or delicate clothing items.
it gets the clothing list by itself, when the user open the page. 
The "Add clothing item" button opens a pop-up modal where the user can enter the name, category, and last washed date.
After the user save, the pop-up closest and the list is refreshed.
The last washed date is also what the dashboard page uses to count how many items are overdue for washing.


- **File:** client/src/pages/HistoryPage.jsx
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/86d371916d9bc7c3429a00ece4f354884cb6bbad
- **What it does and why it is built this way:** This page is where the app shows every load that was logged.
It gets the loads once, then filters them in the browser by start date, end date, and load type, so changing a filter updates the list right away.
There is also a "Clear filter" button that only appears when at least one of the filter is set. 
If no load matches, this page show a message instead of an empty list.
The result are shows as cards on the phone viewport and as a table on larger screens

### The AI-written part I understand best

- **File:** client/src/api/deviceId.js
- **Commit:** https://github.com/JerJers/TumbleTrack/commit/a43400bddf1a59578a5e1daad218d8c2ae5a5b90
- **What it does and why we kept it:** 
    The first time that a browser calls getDeviceId(), it finds nothing stored under the key 'tumbletrack:device-id' in localStorage, so it generates a random UUID on the spot using the browser's built-in crypto.randomUUID() — since this happens entirely client-side, there's no server round-trip or coordination needed. After that, it immediately saves the UUID to localStorage, so this generation step only happens once per browser, unless the browser's site data is cleared, in which case access to previous logs is lost.

    To record the generated ID, httpApi.js calls getDeviceId() on every single API request and attaches it as an X-Device-Id header. server.js reads that header into request.deviceId, and every query in loadsRepo.js/clothingRepo.js includes a WHERE device_id = $1 clause, so Neon's loads and clothing tables carry a device_id column on every row, and no query ever runs without that filter.

    This approach was kept because, during the planning of the app, I had to decide whether to rely on a full account/login feature or find a lighter alternative to keep users' data separate, and I chose device ID as the simpler fit for a class project's scope, with the trade-off that switching browsers starts with a blank slate. It stayed in place even after Basic Auth was added, since Basic Auth is one shared lock on the app's front door for any visitor, while device ID is what actually keeps each browser's laundry data separate from everyone else who has the same shared password.
