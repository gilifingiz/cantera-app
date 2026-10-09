# Feature: PWA offline + installable (pwa-offline)

**Objective:** Allow the app to open and work 100% offline (cold start with zero signal) and be installable on phones as a native-like app.

**Problem:** Today the app only survives signal cut while already open (Firestore persistent cache). Cold-start offline fails because the browser has no cached app shell.

**Why:** Quarry workers lose signal inside the pit; user wants "use without wifi" with automatic sync and zero data loss.

**Scope:**
- Install `vite-plugin-pwa` (Vite 8 compatible, v1.3.0)
- Generate icons (`public/icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`)
- Register plugin in `vite.config.js` (autoUpdate, NetworkFirst navigation fallback, standalone manifest)
- `index.html`: apple-touch-icon link
- Build, verify SW artifacts, deploy, live-verify, commit

**Constraints / decisions:**
- Online behavior must NOT change (deploys still instant: hosting root no-cache + NetworkFirst)
- No data loss: Firestore persistent cache already handles offline writes + auto sync
- First open must be online (downloads cache); after that, offline works
- Route: direct inline (small mechanical config change, researched) — route declaration per task

## Tasks
- [ ] T1: install vite-plugin-pwa and generate icons — evidence: package.json + public/icons/*.png exist
- [ ] T2: configure vite.config.js + index.html — evidence: build emits sw.js + manifest.webmanifest
- [ ] T3: build green (`npm run build` exit 0) — evidence: dist contains sw.js, manifest.webmanifest, icons
- [ ] T4: deploy hosting — evidence: live /manifest.webmanifest + /sw.js return 200
- [ ] T5: commit + push — evidence: commit hash on main

## Verification evidence
- (fill after tasks)