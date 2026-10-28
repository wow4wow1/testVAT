# Rejestry i VAT — test task

Interactive demo of the "Rejestry i VAT" screen: a redesigned VAT register (sales and purchases) with login, dark theme and a document feed instead of a table.
Plain HTML, CSS and JavaScript — no build step, no dependencies. Deploys to Vercel as a static site.

## Run locally

Open `index.html` in a browser (or serve the folder with any static server).

## Demo account

Use **"Wejdź na konto demo"** on the login screen, or register a new account (NIP checksum is validated, e.g. `5260250274`). Accounts live only in the browser (`localStorage`); this is a front-end prototype, there is no backend.

## What it does

- **Summary hero** with gross / net / VAT, VAT-rate breakdown, and a day chart that filters the feed by day.
- **Document feed** grouped by day (timeline), multi-select with live sum, CSV export of the selection, copy of document numbers.
- **Smart search**: `ksef:brak`, `ksef:tak`, `>1000`, `<500`, `23%`, `8%`, `np`, `kor`, `jpk:gtu_06` combined with free text.
- **Quick filters** with counts, full filters dialog (year, month, operation type, JPK V7 code, document series).
- **Detail drawer** with all fields, copy on click, prev/next navigation.
- **Visible fields** settings, print, CSV export, labels (placeholder).
- **States**: data, empty and error (switch with the pill at the bottom), loading skeleton.
- **Light / dark theme** (follows system, remembered), **login / registration** with validation.
- **Keyboard**: `/` search, `j` `k` move, `x` select, `←` `→` in the drawer, `Esc` clears selection.
- Responsive: desktop to iPhone SE, bottom-sheet dialogs on mobile.

## Project structure

```
index.html                  page markup only
css/
  base/base.css             design tokens, reset, shared components (buttons, selects, toast)
  layout/layout.css         header, menu, page grid, toolbar, pagination
  features/summary.css      totals hero card and day chart
  features/feed.css         timeline, document cards, quick filters, selection bar, states
  features/dialogs.css      filters, visible fields, detail drawer
  auth/auth.css             login / registration screen
  media/media.css           responsive and print rules
  themes/dark.css           dark theme overrides
js/
  theme/theme-init.js       applies saved theme before first paint
  theme/theme.js            light / dark toggle
  core/utils.js             helpers: selectors, money format, toast, NIP check
  core/store.js             demo dataset, VAT math and UI state
  features/filters.js       filter pipeline, quick filters, smart-search parser
  features/selection.js     multi-select, CSV export, saved view preferences
  features/render.js        summary, day chart, feed, pagination
  features/detail.js        document detail drawer
  auth/auth.js              login and registration
  app/events.js             event wiring and keyboard shortcuts
  app/main.js               bootstrap
```

Scripts are plain (non-module) files loaded in the order listed in `index.html`, so the app also works when opened directly from disk.

## Deploy

1. Push this folder to a GitHub repository.
2. In Vercel: Add New → Project → import the repository → Deploy (no settings needed).
