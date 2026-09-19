import { useSyncStatus } from '../hooks/useSyncStatus.js'

const LABELS = {
  local: 'Modo local',
  synced: '✓ Sincronizado',
  syncing: '⏳ Sincronizando…',
  offline: '⚠ Sin conexión — pendiente',
}

export default function SyncBadge() {
  const { status } = useSyncStatus()
  return (
    <span className={`sync-badge sync-${status}`} role="status" aria-live="polite">
      {LABELS[status]}
    </span>
  )
}