import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, isFirestoreEnabled } from '../firebase.js'

// ---- Firestore helpers (no-op while Firestore is not configured) ----

export function writeViaje(viaje) {
  if (!isFirestoreEnabled || !db) return
  setDoc(doc(db, 'viajes', String(viaje.id)), viaje)
}

export function updateLlegada(id, hora) {
  if (!isFirestoreEnabled || !db) return
  updateDoc(doc(db, 'viajes', String(id)), { horaLlegada: hora })
}

// Deletes every document in one batch. Returns a Promise; callers never throw
// it uncaught.
export function removeAll() {
  if (!isFirestoreEnabled || !db) return Promise.resolve()
  return getDocs(collection(db, 'viajes')).then((snapshot) => {
    const batch = writeBatch(db)
    snapshot.docs.forEach((snapshotDoc) => batch.delete(snapshotDoc.ref))
    return batch.commit()
  })
}

// Mirrors the original `db.ref('viajes').on('value')` listener: every snapshot
// is delivered as an array sorted by id (newest first). Errors are logged on
// purpose (observability) and never thrown, keeping the listener alive.
export function subscribeViajes(callback) {
  if (!isFirestoreEnabled || !db) return () => {}
  return onSnapshot(
    collection(db, 'viajes'),
    (snap) => {
      const viajes = snap.docs.map((d) => d.data()).sort((a, b) => b.id - a.id)
      callback(viajes)
    },
    (err) => {
      console.warn('[viajes] snapshot error', err)
    },
  )
}