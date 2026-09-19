import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirestoreEnabled } from '../firebase.js'

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

// ---- Firestore helpers (no-op while Firestore is not configured) ----

export function writeViaje(viaje) {
  if (!isFirestoreEnabled || !db) return
  setDoc(doc(db, 'viajes', String(viaje.id)), viaje)
}

export function updateLlegada(id, hora) {
  if (!isFirestoreEnabled || !db) return
  updateDoc(doc(db, 'viajes', String(id)), { horaLlegada: hora })
}

export function removeAll() {
  if (!isFirestoreEnabled || !db) return
  getDocs(collection(db, 'viajes')).then((snapshot) => {
    snapshot.docs.forEach((snapshotDoc) => deleteDoc(snapshotDoc.ref))
  })
}

// Mirrors the original `db.ref('viajes').on('value')` listener: every snapshot
// is delivered as an array sorted by id (newest first).
export function subscribeViajes(callback) {
  if (!isFirestoreEnabled || !db) return () => {}
  return onSnapshot(
    collection(db, 'viajes'),
    (snap) => {
      const viajes = snap.docs.map((d) => d.data()).sort((a, b) => b.id - a.id)
      callback(viajes)
    },
    (error) => {
      // Keep the listener alive; rethrow so it is not silently swallowed.
      throw error
    },
  )
}