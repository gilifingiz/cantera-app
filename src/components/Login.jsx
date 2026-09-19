export default function Login({ onSelect }) {
  return (
    <div className="card">
      <h2>🚛 Cantera A</h2>
      <p>Seleccioná tu rol:</p>
      <button type="button" onClick={() => onSelect('chofer')}>
        SOY CHOFER
      </button>
      <button type="button" className="sec" onClick={() => onSelect('admin')}>
        SOY ADMIN / CONTROL
      </button>
    </div>
  )
}