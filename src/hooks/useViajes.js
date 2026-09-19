import { useCallback, useEffect, useState } from 'react'
import { isFirestoreEnabled } from '../firebase.js'
import {
  loadViajes,
  removeAll,
  saveViajes,
  subscribeViajes,
  updateLlegada,
  writeViaje,
} from '../services/viajesService.js'

export function useViajes() {
  // Local state is the single source of truth; localStorage is the cache.
  const [viajes, setViajes] = useState(() => loadViajes())

  // Live sync for every role: since Firestore acts as the mandatory cloud
  // backend, the listener refreshes local state whenever it is enabled,
  // exactly like the original `escucharFirebase()` admin listener.
  useEffect(() => {
    if (!isFirestoreEnabled) return
    const unsubscribe = subscribeViajes(setViajes)
    return unsubscribe
  }, [])

  const addViaje = useCallback(
    (viaje) => {
      const next = [viaje, ...viajes]
      setViajes(next)
      saveViajes(next)
      writeViaje(viaje)
    },
    [viajes],
  )

  const marcarLlegada = useCallback(
    (id, hora) => {
      const next = viajes.map((v) => (v.id === id ? { ...v, horaLlegada: hora } : v))
      setViajes(next)
      saveViajes(next)
      updateLlegada(id, hora)
    },
    [viajes],
  )

  const borrarTodo = useCallback(() => {
    setViajes([])
    saveViajes([])
    removeAll()
  }, [])

  return { viajes, addViaje, marcarLlegada, borrarTodo, isFirestoreEnabled }
}