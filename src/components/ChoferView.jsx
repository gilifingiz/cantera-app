import { useEffect, useRef, useState } from 'react'

const MATERIALES = ['Arena', 'Piedra', 'Base Granular']
const MI_NOMBRE_KEY = 'miNombre'

export default function ChoferView({ viajes, addViaje, marcarLlegada, onCambiarRol }) {
  const [nombre, setNombre] = useState(() => localStorage.getItem(MI_NOMBRE_KEY) || '')
  const [material, setMaterial] = useState('')
  const [patente, setPatente] = useState('')
  const [interno, setInterno] = useState('')
  const [m3, setM3] = useState('')
  const [destino, setDestino] = useState('')
  const [msg, setMsg] = useState('')
  const msgTimer = useRef(null)

  useEffect(() => () => clearTimeout(msgTimer.current), [])

  // Same check the original ran on name input/blur: first trip of this driver
  // without an arrival time. While it exists, the departure button is hidden.
  const viajeActivo = viajes.find((v) => v.chofer === nombre && !v.horaLlegada)
  const misViajes = viajes.filter((v) => v.chofer === nombre).slice(0, 10)

  function showMsg(text) {
    setMsg(text)
    clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setMsg(''), 3000)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const m3Num = parseFloat(m3)
    if (!nombre || !material || !patente || !m3Num) {
      alert('Completa nombre, material, patente y m3')
      return
    }
    localStorage.setItem(MI_NOMBRE_KEY, nombre)
    const viaje = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-AR'),
      horaSalida: new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      horaLlegada: '',
      material,
      patente: patente.toUpperCase(),
      interno,
      chofer: nombre,
      m3: m3Num,
      destino,
    }
    addViaje(viaje)
    showMsg(`✅ Salida registrada: ${viaje.patente} - ${viaje.m3} m³`)
    setM3('')
    setDestino('')
  }

  function handleMarcarLlegada() {
    if (!viajeActivo) {
      alert('No tenés viaje activo')
      return
    }
    const hora = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    marcarLlegada(viajeActivo.id, hora)
    showMsg(`✅ Llegada marcada: ${hora}`)
  }

  return (
    <>
      <div className="card">
        <h3>👷 Carga de viaje</h3>
        <form onSubmit={handleSubmit}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre Ej: Juan"
          />
          <select value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="">Material</option>
            {MATERIALES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            placeholder="Patente"
          />
          <input
            value={interno}
            onChange={(e) => setInterno(e.target.value)}
            placeholder="Interno"
          />
          <input
            value={m3}
            onChange={(e) => setM3(e.target.value)}
            type="number"
            placeholder="M³ Ej: 12"
          />
          <input
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Destino / Obra"
          />

          {viajeActivo ? (
            <div className="en-curso">
              <p>🚛 Tenés un viaje en curso</p>
              <p className="viaje-activo">
                {viajeActivo.patente} - {viajeActivo.m3}m³ a {viajeActivo.destino}
              </p>
              <button type="button" className="btn-llegada" onClick={handleMarcarLlegada}>
                MARCAR LLEGADA A OBRA ✅
              </button>
            </div>
          ) : (
            <button type="submit">REGISTRAR SALIDA ⏱️</button>
          )}
        </form>
        {msg && <p className="msg">{msg}</p>}
      </div>

      <div className="card">
        <b>Mis viajes hoy:</b>
        <div>
          <table>
            <thead>
              <tr>
                <th>Hora Sal.</th>
                <th>Patente</th>
                <th>M³</th>
                <th>Llegada</th>
              </tr>
            </thead>
            <tbody>
              {misViajes.map((v) => (
                <tr key={v.id}>
                  <td>{v.horaSalida}</td>
                  <td>{v.patente}</td>
                  <td>{v.m3}</td>
                  <td>{v.horaLlegada || 'En viaje'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button type="button" className="sec" onClick={onCambiarRol}>
        Cambiar rol
      </button>
    </>
  )
}