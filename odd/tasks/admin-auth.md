# Feature: admin-auth

## Objective

Seguridad real del panel admin con Firebase Auth. Solo los admins tienen cuenta (email + contraseña). Los choferes siguen entrando sin autenticación y cargando viajes como hoy.

## Problem

La clave de admin hoy es un candado decorativo: vive en `VITE_ADMIN_PASSWORD` (`.env` local), pero Vite la inserta en el bundle de producción y cualquiera la lee del JS. Además quedó quemada en el historial público de GitHub (commit viejos con `const ADMIN_PASSWORD = 'cantera2024'`).

## Why

Pedido explícito del usuario, opción 1 elegida: solo los admins tienen cuenta. Sin real auth no hay barrera verdadera ni reglas de Firestore por actor.

## Scope

- Servicio de auth: `src/services/auth.js` con `loginAdmin(email, password)`, `logoutAdmin()`, hook `useAdminAuth()` (checking/user). Persistencia local de sesión (IndexedDB por defecto en firebase/auth v9+ — sin localStorage).
- `AdminView`: estado "Cargando…" mientras chequea sesión; si no hay sesión → formulario email+contraseña con errores en español (wrong-password, user-not-found, invalid-email, too-many-requests); si hay → panel actual + botón "Cerrar sesión".
- Eliminar `VITE_ADMIN_PASSWORD` del código, `.env` y `.env.example`.
- `firestore.rules`: `allow read, create, update: if true;` (choferes sin cuenta) y `allow delete: if request.auth != null && email en allowlist de admin` (borrar día exige admin logueado).
- Cuenta de admin: crear vía REST Identity Toolkit (API key pública) con email+contraseña que elija el usuario; requirió activar el proveedor "Email/Contraseña" en la consola de Firebase.
- Los choferes NO se autentican: ruta `/chofer` y su lectura/escritura de viajes siguen iguales.

## Constraints

- Sin nuevas dependencias (firebase/auth está en el paquete firebase).
- Sin TypeScript. UI en español, identificadores en inglés.
- No romper el flujo offline del chofer ni la vista de admin autenticado.

## Tareas

- [ ] T1: Servicio auth + hook useAdminAuth (src/services/auth.js, export auth en firebase.js)
- [ ] T2: AdminView con gate de sesión: login email+clave, errores, cerrar sesión; quitar clave vieja
- [ ] T3: Reglas Firestore delete admin-only (allowlist de email) + borrar VITE_ADMIN_PASSWORD de .env/.env.example
- [ ] T4: Activar proveedor Email/Contraseña en consola; crear cuenta admin; deploy rules + hosting; verificación en vivo

## Checks

- `npm run build` → exit 0
- `npm run lint` → exit 0
- Login admin real contra producción + borrar día funcionando con sesión; chofer sigue sin cuenta.
- Verificar que el bundle ya NO contiene el literal de la clave vieja.

## Authorized scope

- src/firebase.js, src/services/auth.js (nuevo), src/components/AdminView.jsx, firestore.rules, .env, .env.example