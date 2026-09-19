import { useEffect, useState } from 'react'
import { onSnapshotsInSync } from 'firebase/firestore'
import { db, isFirestoreEnabled } from '../firebase.js'

// Tiny module-level bus: mutations are issued by the data hook (useViajes)
// but the badge may live in a different subtree, so the pending signal is
// broadcast to every mounted listener.
const pendingListeners = new Set()

export function markSyncPending() {
  pendingListeners.forEach((setBacklog) => setBacklog(true))
}

function subscribePending(listener) {
  pendingListeners.add(listener)
  return () => {
    pendingListeners.delete(listener)
  }
}

export function useSyncStatus() {
  const [online, setOnline] = useState(() => navigator.onLine)
  const [backlog, setBacklog] = useState(false)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isFirestoreEnabled || !db) return
    const unsubscribePending = subscribePending(setBacklog)
    // Fires once every pending write has been acknowledged by the server:
    // the local backlog is drained.
    const unsubscribeSync = onSnapshotsInSync(db, () => setBacklog(false))
    return () => {
      unsubscribePending()
      unsubscribeSync()
    }
  }, [])

  let status = 'synced'
  if (!isFirestoreEnabled) status = 'local'
  else if (!online) status = 'offline'
  else if (backlog) status = 'syncing'

  return { status, online, backlog }
}