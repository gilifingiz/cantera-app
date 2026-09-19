export default function Login({ onSelect }) {
  return (
    <div className="card hero">
      <h1>🚛 Cantera A</h1>
      <p className="hero-sub">Control de viajes</p>
      <p className="muted">Seleccioná tu rol:</p>
      <button type="button" onClick={() => onSelect('chofer')}>
        SOY CHOFER
      </button>
      <button type="button" className="sec" onClick={() => onSelect('admin')}>
        SOY ADMIN / CONTROL
      </button>
    </div>
  )
}