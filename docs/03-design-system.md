# Design system

The rules the TumbleTrack interface follows, written down so that screen four looks like screen one.

The visual part of this document is the design system board. The tables below record the exact values and states behind it.

![TumbleTrack design system board](assets/TumbleTrack%20Design%20System.png)
![TumbleTrack Accessibility Checklist](assets/Accessibility%20Checklist.png)

## Colour

Every colour has a hex value and the name used in code. Core colours are CSS custom properties in the `:root` selector of `client/src/styles.css`.

| Name in code | Hex | Used for |
| --- | --- | --- |
| `--color-primary` | `#177E5E` | Navigation links and active tab, primary buttons, focus ring |
| `--color-bg` | `#FAFAF8` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels, form fields, modals, secondary buttons, "Whites" badge |
| `--color-ink` | `#2C2C2A` | Body text, "Whites" badge text |
| `--color-border` | `#D8D8D4` | Borders on cards, inputs, tables, and navigation |

Secondary text is the body colour at 70 percent opacity, `rgba(44, 44, 42, 0.7)`, used for form labels, captions, stat labels, table headers, and empty states. Never go below 0.7, because at 0.6 the contrast drops under 4.5 to 1.

### Category badge colours

Each clothing category has its own badge. These are class names in `styles.css` (not `:root` variables).

| Category | Class | Background | Text | Contrast |
| --- | --- | --- | --- | --- |
| Whites | `.badge-whites` | `#FFFFFF` with `--color-border` outline | `#2C2C2A` | 13.99 |
| Delicate | `.badge-delicate` | `#EDE3F7` | `#6B4C93` | 5.50 |
| Heavy Fabric | `.badge-heavy-fabric` | `#DCEBFA` | `#1B4E82` | 7.04 |
| Lights | `.badge-lights` | `#FFF6D2` | `#8A6D1F` | 4.52 |
| Darks | `.badge-darks` | `#3A3A40` | `#FFFFFF` | 11.30 |
| Lint Givers | `.badge-lint-givers` | `#FDE9DA` | `#9F591A` | 4.55 |
| Heavily Soiled | `.badge-heavily-soiled` | `#FBDADA` | `#B23B3B` | 4.51 |
| Any other category | `.badge-default` | `#FAFAF8` with `--color-border` outline | `#2C2C2A` | 13.39 |

### Status colours

| Purpose | Value | Notes |
| --- | --- | --- |
| Error text | `#B42318` | Form errors, 13px. Written inline in the pages |
| Demo mode notice | Background `#FFF6DD`, border `#E0BF6A`, text `--color-ink` | Contrast 12.98 |
| Backdrop behind modal and phone menu | `rgba(0, 0, 0, 0.45)` | |

### Contrast check

The WCAG minimum for normal text is 4.5 to 1. Values were calculated from the hex colours.

| Text on background | Ratio | Result |
| --- | --- | --- |
| Body text on page background | 13.39 | Pass |
| Body text on card surface | 13.99 | Pass |
| White on primary (button text) | 5.02 | Pass |
| Primary on page background (active nav link) | 4.80 | Pass |
| Muted text on page background | 5.19 | Pass |
| Muted text on card surface | 5.33 | Pass |
| Error text on white | 6.57 | Pass |
| All badges | 4.51 to 13.99 | Pass |

Disabled buttons use 45 percent opacity and are exempt from the contrast rule.

## Type

The family is the system font stack: `system-ui, -apple-system, "Segoe UI", sans-serif`. Body line height is 1.5.

| Name in code | Size | Weight | Used for |
| --- | --- | --- | --- |
| `--font-heading` | 22px | Bold (700) | Screen titles (`h1`) |
| `--font-body` | 16px | Regular | Paragraphs, list items, form field text |
| `--font-small` | 13px | Regular (600 on buttons, badges, active nav link) | Captions, labels, nav links, buttons, table text |

The stat card number is the one extra size: 20px bold (`.stat-value`).

## Spacing

One scale, used everywhere.

| Name in code | Value | Used for |
| --- | --- | --- |
| `--space-0` | 4px | Gap between a label and its field, badge vertical padding |
| `--space-1` | 8px | Tight spacing: button vertical padding, grid gaps, table cells |
| `--space-2` | 16px | Card padding, gaps between blocks, screen edge on phone |
| `--space-3` | 24px | Screen edge on desktop |
| `--space-4` | 32px | |
| `--space-5` | 40px | |

| Rule | Value |
| --- | --- |
| Tight spacing | 8px (`--space-1`) |
| Standard spacing | 24px (`--space-3`) |
| Screen edge spacing | 16px on phone, 24px on desktop (768px and above) |

Corner radius also comes from tokens: `--radius-md` 8px (buttons, fields), `--radius-lg` 12px (cards, modals), `--radius-pill` 999px (badges).

## Components

Each reusable piece, and how it behaves in each state. The app has one global focus rule, `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`, so every button, link, and field shows a visible outline when reached by keyboard. No outline is ever removed.

### Button (atom)

Props: `variant` (`primary` or `secondary`), `type`, `disabled`, `onClick`, `children`.

| State | What it looks like |
| --- | --- |
| Normal, primary | Green `--color-primary` background, white 13px bold text, 8px radius |
| Normal, secondary | White surface background, ink text, 1px `--color-border` outline |
| Hover | Pointer cursor. No colour change is defined yet |
| Focused | 2px primary outline with 2px offset |
| Disabled | 45 percent opacity and a not allowed cursor. Used until the form is valid |
| Loading | The label changes to "Saving..." and the button is disabled |

### Form control (molecule)

Props: `type` (text, number, date, select, textarea), `label`, `value`, `onChange`, `options` for selects. Every field has a `<label>` linked with `htmlFor`.

| State | What it looks like |
| --- | --- |
| Normal | 13px muted label above a white field with a 1px `--color-border` outline and 8px radius |
| Hover | No change defined |
| Focused | 2px primary outline with 2px offset |
| Disabled | Not used in the app |
| Error | The message is shown in `#B42318` 13px text below the form, not on the field |

### Badge (atom)

Prop: `label`. The colour is chosen from the category name using the table above, and unknown categories use the default style. A badge is not interactive, so it has no hover, focus, disabled, or loading state.

### Stat card (molecule)

Props: `label`, `value`. A card with a 13px muted label above a 20px bold number. Not interactive. The Dashboard shows four: Loads, Total Spent, Overdue, and Clean items.

### Load card (molecule)

Props: `date`, `loadType`, `weight`, `weightUnit`, `cost`, `notes`. A card with the date in semibold, then load type, weight, and cost in muted text, and notes when present. Used on phones in History and in the Dashboard's recent loads list. Not interactive.

### Clothing card (molecule)

Props: `name`, `category`, `lastWashedDate`. A card with the item name in semibold, the category badge, and "Last washed" in muted text. Not interactive.

### Navigation bar (organism)

| State | What it looks like |
| --- | --- |
| Normal, desktop | Left sidebar, 160px wide, with links in 13px muted text |
| Active link | Primary colour and semibold |
| Hover | Pointer cursor. No colour change is defined yet |
| Focused | 2px primary outline with 2px offset |
| Phone, closed | Only the 40px menu button is shown. The drawer is hidden with `visibility: hidden`, so Tab skips its links |
| Phone, open | A 240px drawer slides in over a dimmed backdrop, and the backdrop closes it |

### Modal (organism)

Used for Add clothing item and the Log in window. A white sheet on a dimmed backdrop: a bottom sheet on phones and a centered 320px panel on desktop. Contains form controls, then a secondary "Cancel" button and a primary "Save" button, which shows "Saving..." while the request runs.

## States

Loading, empty, error, and data are four different screens. This is how each one looks, decided once.

| Screen | Loading | Empty | Error | Data |
| --- | --- | --- | --- | --- |
| Dashboard | "Loading..." text in place of the stats and recent loads | "No laundry logged yet." in muted text | A failed load is only logged to the browser console | Stat grid and up to five recent load cards |
| Log load | Save button shows "Saving..." and is disabled | "No tracked clothing items yet." in place of the tag checkboxes | Message in `#B42318` text above the Save button | Form with tag checkboxes |
| Clothing | Save button in the pop up shows "Saving..." | No special message (an empty grid) | Message in `#B42318` text inside the pop up | Grid of clothing cards |
| History | None shown | "No laundry logged yet." with no loads, "No loads match this filter." when a filter hides everything | A failed load is only logged to the browser console | Table on desktop, cards on phone |

When the app runs in demo mode, a yellow notice at the top of the Dashboard says the data is simulated in the browser.

## Layout

The layout switches at 768px. Below it, the app shows the slide out menu, two stat columns, one clothing column, and load cards. At 768px and above, it shows the sidebar, four stat columns, three clothing columns, and the history table.

## In code

* **Tokens:** CSS custom properties in the `:root` selector of `client/src/styles.css` (colours, spacing, radius, font sizes). Plain CSS was chosen over Tailwind or a component library so the tokens live in one readable file and there is nothing extra to configure.
* **Components:** React components in `client/src/components/`, grouped as `atoms` (Button, FormControl, Badge), `molecules` (StatCard, LoadCard, ClothingCard), and `organisms` (NavBar, AuthModal). Each uses the token variables and shared classes (`.btn`, `.card`, `.badge`, `.form-control`) instead of repeating raw values.
* **Pages:** `client/src/pages/` holds the four screens, which assemble the components.
* **Not tokens:** the badge colours, the error red, and the demo notice colours are plain values in `styles.css` or inline in the pages.

## Accessibility check

| Check | Result |
| --- | --- |
| Every text on background pair passes 4.5 to 1 contrast | Pass, see the contrast table |
| Uses `<header>`, `<nav>`, `<main>`, and real `<button>` elements, not `<div onClick>` | Pass |
| Meaningful images have alt text, decorative icons are hidden | Pass. The app has no images, and the menu icons have text labels |
| Every form input has a matching `<label htmlFor>` | Pass |
| Every link and button is reachable with Tab and visibly focusable | Pass. Global focus outline, and the closed phone menu is hidden from Tab |

## Known gaps

* Hover states are not styled. Only the pointer cursor shows.
* Input borders (`#D8D8D4` on white) are about 1.4 to 1, below the 3 to 1 guideline for the edges of form fields.
* Failed data loads on the Dashboard, Log load, and History screens are only logged to the console. The user sees the empty state.
* The Clothing screen has no empty state message.
