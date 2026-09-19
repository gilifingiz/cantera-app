import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="card hero-cantera">
      <div className="hero-glyph" aria-hidden="true">
        🚛
      </div>
      <h1>Cantera A</h1>
      <p className="hero-sub">Control de carga y descarga de viajes</p>
      <span className="hero-underline" aria-hidden="true" />

      <p className="muted">Seleccioná tu rol:</p>
      <div className="actions">
        <button type="button" onClick={() => navigate('/chofer')}>
          SOY CHOFER
        </button>
        <button type="button" className="sec" onClick={() => navigate('/admin')}>
          SOY ADMIN / CONTROL
        </button>
      </div>
    </div>
  )
}