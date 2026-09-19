# Offline Sync + UX Redesign — Feature Doc

## Objective
Move the trip tracking app to offline-first with **Firestore native offline persistence** (IndexedDB cache + automatic write queue), removing ALL localStorage usage; remove the `interno` field; apply the agreed UX fixes (labels, inline validation, no password leak, empty/loading states, safer "Borrar día"); polish the UI to be prettier and responsive.

## Why / Decisions (user-approved)
- **A**: No localStorage (security). Chosen solution: `persistentLocalCache` (IndexedDB) via `initializeFirestore` + multi-tab manager. Write queue and retry are handled by the SDK. *Rejected: SQLite (no native browser support without heavy WASM + still requires manual sync logic).*
- **B**: Remove `interno` from chofer form, admin table, CSV. Data model tolerates old records that still contain `interno` (read path may ignore it).
- **C**: UI polish pass: design tokens, prettier layout, mobile-first responsive, better typography and touch targets.
- Exception to "no localStorage": `miNombre` stays in localStorage as a pure UI preference (no business data). Flagged to user.

## Scope changes vs baseline
1. **firebase.js**: `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })` instead of `getFirestore(app)`.
2. **viajesService.js**: delete `loadViajes`/`saveViajes` (localStorage) and STORAGE_KEY. All reads via `onSnapshot` (cache-first). Writes: `setDoc`/`updateDoc`/batch `deleteDoc` — SDK queues offline. Snapshot error → `console.warn` (observability, not uncaught).
3. **useViajes.js**:
   - Initial state `null` = loading (view shows "Cargando…" until first snapshot lands from cache).
   - Optimistic in-memory updates on mutations (no localStorage).
   - Name normalization for active-trip matching: `trim().toLocaleLowerCase('es')` on both sides (user: "Juan" ≠ "juan" must not duplicate active trips).
   - New `useSyncStatus` hook: combines `navigator.onLine` + `online`/`offline` events + `onSnapshotsInSync` backlog signal. Status ∈ local | synced | syncing | offline.
4. **SyncBadge component**: visible in both views. `✓ Sincronizado` / `⏳ Sincronizando…` / `⚠ Sin conexión — pendiente` / `Modo local` (no firebase creds). Spanish copy.
5. **ChoferView**: remove interno; real `<label>`s for all fields; inline per-field validation (no alert for form); m3 min > 0 (`min="0.01"` + JS check); loading + empty states ("Todavía no registraste viajes hoy"); success messages inline with `aria-live="polite"` (3 s); SyncBadge at top.
6. **AdminView**: password gate becomes a real `<form>` (Enter works); wrong password message "Clave incorrecta." — NO password leak; remove Int column; empty state ("No hay viajes registrados hoy"); loading state; Borrar día confirm includes count: `Se van a borrar {n} viajes. Esta acción no se puede deshacer. ¿Continuar?`; SyncBadge.
7. **csv.js**: drop Interno from header and rows (header: Fecha,Hora Salida,Hora Llegada,Material,Patente,Chofer,M3,Destino). Keep field quoting; keep local-date filename.
8. **index.css**: full redesign — CSS custom properties (colors, radius, shadow, spacing), mobile-first, `@media (min-width: 640px)`, centered max-width container (narrow for chofer, wider for admin), ≥44 px touch targets, table font 14px, focus-visible outlines, stat tiles spacing fixed ("0Viajes hoy" → separated), cleaner palette (charcoal/slate + accent), keep Cantera identity (truck emoji, Spanish copy). Remove dead classes (`.hidden`, `.big`) if unused. No UI framework, no new deps.
9. **index.html**: keep lang es + title; add `theme-color`.

## Out of scope
- Firebase Auth + real security rules (separate follow-up, already flagged).
- Migrating existing localStorage data into Firestore (fresh start; cloud is the source of truth).

## Task checklist
- [x] T1 Update ODD feature doc + Engram mirror (parent)
- [x] T2 Delegate implementation writer (data layer + UI) — delegated direct
- [x] T3 Verify: `npm run build` + `npm run lint` exit 0
- [x] T4 Commit work unit + push to `cantera-app`
- [x] T5 Firebase deploy (hosting) + smoke check HTTP 200 + theme-color present
- [x] T6 Update memory

## Notes / deviations (accepted)
- Admin password moved to `VITE_ADMIN_PASSWORD` env (only in local `.env`, gitignored; `.env.example` has placeholder). Still client-side exposure (VITE_* is inlined into the bundle) — real hardening remains the Auth + rules follow-up.
- `.firebase/` CLI cache accidentally committed once, removed and gitignored.
- Fresh clones need `VITE_ADMIN_PASSWORD` set or the admin gate rejects all inputs (secure-by-default lockout).

## Verification evidence
- TBD

## Next step
- Delegate writer with full spec (this doc is the reference).