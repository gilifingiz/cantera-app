import { onValue, ref, remove, set, update } from 'firebase/database'
import { db, isRealtimeEnabled } from '../firebase.js'

const STORAGE_KEY = 'viajes_pro'

// ---- Local persistence (works in every mode) ----

export function loadViajes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveViajes(viajes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(viajes))
}

// ---- Realtime Database helpers (no-op while the database URL is not set) ----

export function writeViaje(viaje) {
  if (!isRealtimeEnabled || !db) return
  set(ref(db, `viajes/${viaje.id}`), viaje)
}

export function updateLlegada(id, hora) {
  if (!isRealtimeEnabled || !db) return
  update(ref(db, `viajes/${id}`), { horaLlegada: hora })
}

export function removeAll() {
  if (!isRealtimeEnabled || !db) return
  remove(ref(db, 'viajes'))
}

// Mirrors the original `db.ref('viajes').on('value')` listener: every snapshot
// is delivered as an array sorted by id (newest first).
export function subscribeViajes(callback) {
  if (!isRealtimeEnabled || !db) return () => {}
  return onValue(ref(db, 'viajes'), (snapshot) => {
    const data = snapshot.val()
    const viajes = data ? Object.values(data).sort((a, b) => b.id - a.id) : []
    callback(viajes)
  })
}