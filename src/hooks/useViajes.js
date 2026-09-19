import { useCallback, useEffect, useState } from 'react'
import { isFirestoreEnabled } from '../firebase.js'
import { removeAll, subscribeViajes, updateLlegada, writeViaje } from '../services/viajesService.js'
import { markSyncPending } from './useSyncStatus.js'

// Normalizes a driver name so "Juan" and "juan" match for active-trip
// detection. Trim + lowercase with Spanish locale.
export function normalizeName(s) {
  return (s || '').trim().toLocaleLowerCase('es')
}

export function useViajes() {
  // null = loading until the first snapshot lands (cache-first);
  // [] = local-only mode, no persistence layer.
  const [viajes, setViajes] = useState(() => (isFirestoreEnabled ? null : []))

  useEffect(() => {
    if (!isFirestoreEnabled) return
    const unsubscribe = subscribeViajes(setViajes)
    return unsubscribe
  }, [])

  // Optimistic in-memory mutations; Firestore (with its offline write queue)
  // is the persistence layer and keeps every other open tab in sync.
  const addViaje = useCallback((viaje) => {
    markSyncPending()
    setViajes((prev) => [viaje, ...(prev ?? [])])
    writeViaje(viaje)
  }, [])

  const marcarLlegada = useCallback((id, hora) => {
    markSyncPending()
    setViajes((prev) =>
      (prev ?? []).map((v) => (v.id === id ? { ...v, horaLlegada: hora } : v)),
    )
    updateLlegada(id, hora)
  }, [])

  const borrarTodo = useCallback(() => {
    markSyncPending()
    setViajes([])
    removeAll().catch((err) => console.warn('[viajes] removeAll failed', err))
  }, [])

  return { viajes, addViaje, marcarLlegada, borrarTodo, isFirestoreEnabled }
}