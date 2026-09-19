import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { normalizeName } from '../hooks/useViajes.js'
import SyncBadge from './SyncBadge.jsx'

const MATERIALES = ['Arena', 'Piedra', 'Base Granular']
const MI_NOMBRE_KEY = 'miNombre'

export default function ChoferView({ viajes, addViaje, marcarLlegada }) {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState(() => localStorage.getItem(MI_NOMBRE_KEY) || '')
  const [material, setMaterial] = useState('')
  const [patente, setPatente] = useState('')
  const [m3, setM3] = useState('')
  const [destino, setDestino] = useState('')
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState('')
  const msgTimer = useRef(null)

  const nombreRef = useRef(null)
  const materialRef = useRef(null)
  const patenteRef = useRef(null)
  const m3Ref = useRef(null)

  useEffect(() => () => clearTimeout(msgTimer.current), [])

  const viajesHoy = viajes ?? []
  const nombreNorm = normalizeName(nombre)
  // Same check the original app ran on name input/blur: first trip of this
  // driver without an arrival time. While it exists, the departure button is
  // hidden. Matching is case/space-insensitive on both sides.
  const viajeActivo = viajesHoy.find(
    (v) => normalizeName(v.chofer) === nombreNorm && !v.horaLlegada,
  )
  const misViajes = viajesHoy.filter((v) => normalizeName(v.chofer) === nombreNorm).slice(0, 10)

  function showMsg(text) {
    setMsg(text)
    clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setMsg(''), 3000)
  }

  function clearError(field) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const m3Num = parseFloat(m3)
    const nextErrors = {}
    if (!nombre.trim()) nextErrors.nombre = 'Ingresá tu nombre'
    if (!material) nextErrors.material = 'Elegí un material'
    if (!patente.trim()) nextErrors.patente = 'Ingresá la patente'
    if (m3.trim() === '' || Number.isNaN(m3Num) || m3Num <= 0) {
      nextErrors.m3 = 'Ingresá una cantidad mayor a 0'
    }
    setErrors(nextErrors)
    const firstInvalid = ['nombre', 'material', 'patente', 'm3'].find((k) => nextErrors[k])
    if (firstInvalid) {
      const refMap = { nombre: nombreRef, material: materialRef, patente: patenteRef, m3: m3Ref }
      refMap[firstInvalid].current?.focus()
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
      patente: patente.trim().toUpperCase(),
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
    if (!viajeActivo) return
    const hora = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    marcarLlegada(viajeActivo.id, hora)
    showMsg(`✅ Llegada marcada: ${hora}`)
  }

  if (viajes === null) {
    return (
      <>
        <SyncBadge />
        <div className="card">
          <p className="estado">Cargando…</p>
        </div>
        <button type="button" className="sec" onClick={() => navigate('/')}>
          Cambiar rol
        </button>
      </>
    )
  }

  return (
    <>
      <SyncBadge />
      <div className="card">
        <h3>👷 Carga de viaje</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="nombre">Tu nombre</label>
            <input
              id="nombre"
              ref={nombreRef}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                clearError('nombre')
              }}
              placeholder="Tu nombre Ej: Juan"
              autoComplete="name"
              aria-invalid={Boolean(errors.nombre)}
              aria-describedby={errors.nombre ? 'err-nombre' : undefined}
            />
            {errors.nombre && (
              <p className="field-error" id="err-nombre" role="alert">
                {errors.nombre}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="material">Material</label>
            <select
              id="material"
              ref={materialRef}
              value={material}
              onChange={(e) => {
                setMaterial(e.target.value)
                clearError('material')
              }}
              aria-invalid={Boolean(errors.material)}
              aria-describedby={errors.material ? 'err-material' : undefined}
            >
              <option value="">Material</option>
              {MATERIALES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.material && (
              <p className="field-error" id="err-material" role="alert">
                {errors.material}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="patente">Patente</label>
            <input
              id="patente"
              ref={patenteRef}
              value={patente}
              onChange={(e) => {
                setPatente(e.target.value)
                clearError('patente')
              }}
              placeholder="Patente"
              autoComplete="off"
              aria-invalid={Boolean(errors.patente)}
              aria-describedby={errors.patente ? 'err-patente' : undefined}
            />
            {errors.patente && (
              <p className="field-error" id="err-patente" role="alert">
                {errors.patente}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="m3">M³</label>
            <input
              id="m3"
              ref={m3Ref}
              value={m3}
              onChange={(e) => {
                setM3(e.target.value)
                clearError('m3')
              }}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="any"
              placeholder="M³ Ej: 12"
              aria-invalid={Boolean(errors.m3)}
              aria-describedby={errors.m3 ? 'err-m3' : undefined}
            />
            {errors.m3 && (
              <p className="field-error" id="err-m3" role="alert">
                {errors.m3}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="destino">Destino / Obra</label>
            <input
              id="destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Destino / Obra"
              autoComplete="off"
            />
          </div>

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
        {msg && (
          <p className="msg" role="status" aria-live="polite">
            {msg}
          </p>
        )}
      </div>

      <div className="card">
        <b>Mis viajes hoy:</b>
        {misViajes.length === 0 ? (
          <p className="estado">Todavía no registraste viajes hoy</p>
        ) : (
          <div className="table-wrap">
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
        )}
      </div>

      <button type="button" className="sec" onClick={() => navigate('/')}>
        Cambiar rol
      </button>
    </>
  )
}