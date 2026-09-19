# Feature: routing-screens

## Objective

Darle a la app un sistema real de rutas y pantallas con navegación (back/forward, deep links), usando React Router.

## Problem

La app hoy alterna pantallas por estado local (`rol` en App), sin URLs. No hay botón "atrás" del navegador, no se pueden compartir URLs específicas ni recargar en una pantalla dada.

## Why

Pedido explícito del usuario: "la aplicación no tiene rutas... quiero que crees este sistema de rutas y pantallas para toda la app".

## Scope

- Instalar `react-router-dom` (única dependencia nueva).
- Rutas: `/` → login/landing, `/chofer` → vista chofer, `/admin` → vista admin, `*` → redirect a `/`.
- Navegación desde login (botones) y desde los botones "cambiar rol" de chofer/admin.
- Mantener la suscripción de datos (`useViajes`) en el nivel de App para que persista entre rutas.
- Quitar del cartel del login: stats (Viajes hoy / M³ hoy) y el SyncBadge + nota de sincronización. Dejar el resto del landing como está (hero ámbar, tagline, centrado vertical).
- SyncBadge se mantiene en chofer y admin (feature offline aprobada).

## Constraints

- Sin TypeScript. UI copy en español, identificadores en inglés.
- No cambiar comportamiento de datos ni autenticación admin.
- Firebase Hosting ya tiene SPA rewrite (`**` → index.html), así que los deep links funcionan en producción sin tocar firebase.json.

## Tareas

- [x] T1: Instalar react-router-dom y envolver la app con BrowserRouter en main.jsx
- [x] T2: Definir <Routes> en App (/, /chofer, /admin, *) con datos compartidos
- [x] T3: Login navega a /chofer o /admin; quitar stats + SyncBadge + nota del cartel (dejar hero, tagline, botones, centrado)
- [x] T4: "Cambiar rol" en ChoferView y AdminView navega a /

## Checks

- `npm run build` → exit 0
- `npm run lint` → exit 0
- `vite preview` + fetch `/`, `/chofer`, `/admin` → 200 (smoke)

## Authorized scope

- src/main.jsx, src/App.jsx, src/components/{Login,ChoferView,AdminView}.jsx, package.json