import SyncBadge from './SyncBadge.jsx'

// Sums the m³ column, treating unparseable values as zero (same rule as AdminView).
function sumM3(viajes) {
  return viajes.reduce((sum, v) => sum + (parseFloat(v.m3) || 0), 0)
}

export default function Login({ onSelect, viajes = null }) {
  // null = trips still loading; show "—" instead of fabricated zeros.
  const tripCount = viajes === null ? null : viajes.length
  const m3Today = viajes === null ? null : sumM3(viajes).toFixed(1)

  return (
    <div className="card hero-cantera">
      <div className="hero-glyph" aria-hidden="true">
        🚛
      </div>
      <h1>Cantera A</h1>
      <p className="hero-sub">Control de carga y descarga de viajes</p>
      <span className="hero-underline" aria-hidden="true" />

      <section className="grid stats" aria-label="Resumen del día">
        <div className="stat">
          <b>{tripCount ?? '—'}</b>
          <span className="stat-label">Viajes hoy</span>
        </div>
        <div className="stat">
          <b>{m3Today ?? '—'}</b>
          <span className="stat-label">M³ hoy</span>
        </div>
      </section>

      <p className="muted">Seleccioná tu rol:</p>
      <div className="actions">
        <button type="button" onClick={() => onSelect('chofer')}>
          SOY CHOFER
        </button>
        <button type="button" className="sec" onClick={() => onSelect('admin')}>
          SOY ADMIN / CONTROL
        </button>
      </div>

      <footer className="login-footer">
        <SyncBadge />
        <p className="login-sync-note">
          Los datos se sincronizan automáticamente, incluso sin señal
        </p>
      </footer>
    </div>
  )
}