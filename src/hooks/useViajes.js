import { useCallback, useEffect, useState } from 'react'
import { isRealtimeEnabled } from '../firebase.js'
import {
  loadViajes,
  removeAll,
  saveViajes,
  subscribeViajes,
  updateLlegada,
  writeViaje,
} from '../services/viajesService.js'

export function useViajes(isAdmin = false) {
  // Local state is the single source of truth; localStorage is the cache.
  const [viajes, setViajes] = useState(() => loadViajes())

  // Live sync for admins: the RTDB listener refreshes local state, exactly
  // like the original `escucharFirebase()` admin listener.
  useEffect(() => {
    if (!isRealtimeEnabled || !isAdmin) return
    const unsubscribe = subscribeViajes(setViajes)
    return unsubscribe
  }, [isAdmin])

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

  return { viajes, addViaje, marcarLlegada, borrarTodo, isRealtimeEnabled }
}