# Trip Tracking App — Migration to React + Vite

## Objective
Migrate the quarry trip load/unload tracking app from a single vanilla HTML/JS file (`D:\html\pagina.html`) to a React + Vite application with Firebase Realtime Database as mandatory persistence, deployed on Firebase Hosting, and published to GitHub.

## Problem / Why
The original app is a single HTML file with inline JS (`pagina.html`). It works but is not maintainable: no build tooling, no componentization, jQuery-free DOM spaghetti, Firebase config was a placeholder so it only worked locally. The user wants a proper React + Vite app with real Firebase persistence (localStorage stays only as offline cache/fallback) and a public GitHub repo.

## Source app behavior (reference: `D:\html\pagina.html` — NOT index.html, which is an unrelated recipe demo)
- **Login**: two roles — Chofer and Admin/Control.
- **Chofer view**:
  - Register trip departure: name (auto-saved as `miNombre` in localStorage), material (Arena / Piedra / Base Granular), patente (upper-cased), interno, m3 (number), destino.
  - If driver has an active trip (same name, no `horaLlegada`), show "trip in progress" block with truck/m3/destination and a MARCAR LLEGADA button (green) instead of the departure form. Registering a new trip is blocked while one is active.
  - "Mis viajes hoy": table of their last 10 trips (hora salida, patente, m3, llegada o "En viaje").
  - Success messages clear after 3 s.
- **Admin view**:
  - Password gate: `cantera2024` (alert on wrong: "Clave incorrecta. Clave por defecto: cantera2024").
  - Stats cards: Viajes hoy (count), M³ hoy (1 decimal).
  - Résumé by truck: patente, viajes, m3, chofer.
  - Résumé by material: material, viajes, m3.
  - Live table of ALL trips: hora salida, material, patente, interno, m3, chofer, llegada ("✅ hh:mm" or "En viaje...").
  - Export CSV (Excel-compatible): headers `Fecha,Hora Salida,Hora Llegada,Material,Patente,Interno,Chofer,M3,Destino`; fields quoted; filename `cantera_YYYY-MM-DD.csv`.
  - "Borrar día" button with `confirm()`; clears all data (without Firebase rules this works for anyone with the password — original behavior).
- **Data model**: `{ id: Date.now(), fecha, horaSalida, horaLlegada, material, patente, interno, chofer, m3, destino }` — times via `toLocaleTimeString('es-AR', {hour:'2-digit',minute:'2-digit'})`; fecha via `toLocaleDateString('es-AR')`.
- **Persistence (original)**: localStorage key `viajes_pro`; optional Firebase RTDB at `viajes/<id>` with a live `on('value')` listener for admin. **New**: Firebase RTDB is mandatory; localStorage is a read-only fallback/offline cache.

## Scope
- Migrate behavior 1:1 into React components (functional components + hooks, no external state lib).
- Keep the look & feel (dark cards, white cards, emoji headers, `.stat` tiles).
- UI copy stays in Spanish matching the original (Rioplatense neutral); code identifiers/comments in English.
- Firebase config from environment variables (`VITE_FIREBASE_*`).
- TDD mode: disabled; applicable checks are `npm run build` and `npm run lint` (oxlint).

## Constraints
- Repo public (`gilifingiz/cantera-app`); never commit `.env` (real keys) — commit `.env.example` only.
- RTDB must be created manually by the user in the Firebase console before deploy; until then the app still builds/renders (data layer degrades gracefully).
- `npm create -y vite@latest . -- --template react` scaffold already present (React 19, Vite 8, Firebase 12, oxlint).

## Task checklist
- [x] T1 Scaffold React+Vite project — DONE (parent)
- [x] T2 Configure `.env` + `.env.example` + `.gitignore` — DONE (parent)
- [x] T3 Implement React app (writer delegation): firebase init, store service, Login, ChoferView, AdminView, CSV export, styling
- [x] T4 Verify: `npm run build` + `npm run lint` pass
- [x] T5 DECISION: Firestore instead of Realtime Database (user created Firestore; data layer converted by writer; `firestore.rules` dev-open scoped to `/viajes`)
- [x] T6 Remove `VITE_FIREBASE_DATABASE_URL` from `.env`/`.env.example`
- [x] T7 Git: work-unit commits on `main`, pushed to `gilifingiz/cantera-app`
- [x] T8 Firebase deploy: hosting + firestore rules — LIVE at https://control-de-cantera.web.app

## Acceptance criteria
- Every behavior listed above matches the original app. ✅ verified by writer + parent spot checks
- `npm run build` succeeds; no oxlint errors. ✅ (exit 0)
- Admin password gate, stats, summaries, live table, CSV export, clear day all work against Firestore. ⚠️ runtime test in browser pending (user)
- App deployable to Firebase Hosting with a single config. ✅ deployed 200 OK

## Route declarations (per ODD)
- T1, T2: inline (parent, mechanical bootstrap).
- T3: delegated direct (one `general` writer) — crosses the 2+ non-trivial files writer trigger.
- T4, T7, T8: bounded shell actions (per-action rule, inline).

## Progress
- T1 ✅ scaffold created in `D:\control de cantera`
- T2 ✅ `.env`, `.env.example`, `.gitignore` updated
- T3 in progress

## Verification evidence
- TBD

## Next step
- Delegate T3 to a writer agent with the full behavior spec.