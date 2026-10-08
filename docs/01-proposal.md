# TumbleTrack — App Proposal

**App Name:** TumbleTrack — Laundry Tracker

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

## 4. App State & Data Architecture

| Data State | Shape | Owner / Source | Trigger / Change Event |
| :--- | :--- | :--- | :--- |
| **`loads`** | `[{ id, date, loadType, weight, weightUnit, cost, notes, clothingIds? }]` | Dashboard Page | User logs a new load via the Log Load page. |
| **`stats`** | `{ loadsThisWeek, totalSpent, overdueCount }` | Dashboard Page (computed from `loads` & `clothing`) | Updates when `loads` or `clothing` entries change. |
| **`clothing`** | `[{ id, name, category, lastWashedDate }]` | Dashboard Page (fetched via API, shared with Clothing screen) | Updates when a load tags an item or when an item is added/edited. |

---

## 5. Screen Specifications

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

## 6. Content & Visual Assets

* **App Branding & Logo:** Official app logo representing TumbleTrack's core laundry-tracking functionality (integrated into the navigation header and documentation assets in `docs/assets/`).
* **Starter Categories:** Pre-defined clothing categories for dropdown selects (e.g., Shirts, Pants, Underwear, Bedding, Towels, Delicates).
* **Overdue Threshold:** Default 7-day threshold for "last washed" status to calculate overdue items on the Dashboard.
* **Seed Data:** Pre-populated sample loads and clothing items for testing the UI before live API data is connected.

---

## 7. Technical Risk & Mitigation

* **Risk:** Device-ID-based data separation (no account login; each device only accesses its own local data).
* **Mitigation Strategy:** Ensure the generated device identifier reliably persists in browser local storage across sessions and is attached to every API request header, preventing cross-device data leaks or unexpected data loss.
