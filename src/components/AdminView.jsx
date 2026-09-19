import { useState } from 'react'
import { exportarExcel } from '../utils/csv.js'
import SyncBadge from './SyncBadge.jsx'

// Client-side gate. The shared secret lives in the environment
// (VITE_ADMIN_PASSWORD), never in source code or UI copy. Real auth is a
// follow-up (Firebase Auth) — this is a UX gate, not security.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export default function AdminView({ viajes, borrarTodo, onCambiarRol }) {
  const [clave, setClave] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [errorClave, setErrorClave] = useState(false)

  function handleEntrar(e) {
    e.preventDefault()
    if (clave === ADMIN_PASSWORD) {
      setAutenticado(true)
      setErrorClave(false)
    } else {
      setErrorClave(true)
    }
  }

  if (!autenticado) {
    return (
      <div className="card">
        <h3>🔐 Panel Admin</h3>
        <form onSubmit={handleEntrar}>
          <div className="field">
            <label htmlFor="clave">Clave</label>
            <input
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => {
                setClave(e.target.value)
                setErrorClave(false)
              }}
              placeholder="Clave"
              autoComplete="current-password"
              autoFocus
              aria-invalid={errorClave}
              aria-describedby={errorClave ? 'err-clave' : undefined}
            />
            {errorClave && (
              <p className="field-error" id="err-clave" role="alert">
                Clave incorrecta.
              </p>
            )}
          </div>
          <button type="submit">ENTRAR</button>
        </form>
      </div>
    )
  }

  const lista = viajes ?? []
  const totalM3 = lista.reduce((sum, v) => sum + (parseFloat(v.m3) || 0), 0)

  const porPatente = {}
  lista.forEach((v) => {
    if (!porPatente[v.patente]) {
      porPatente[v.patente] = { viajes: 0, m3: 0, chofer: v.chofer }
    }
    porPatente[v.patente].viajes += 1
    porPatente[v.patente].m3 += parseFloat(v.m3)
  })

  const porMaterial = {}
  lista.forEach((v) => {
    if (!porMaterial[v.material]) {
      porMaterial[v.material] = { viajes: 0, m3: 0 }
    }
    porMaterial[v.material].viajes += 1
    porMaterial[v.material].m3 += parseFloat(v.m3)
  })

  function handleBorrarDia() {
    const count = viajes ? viajes.length : 0
    if (
      confirm(
        `Se van a borrar ${count} viajes. Esta acción no se puede deshacer. ¿Continuar?`,
      )
    ) {
      borrarTodo()
    }
  }

  return (
    <div className="admin-content">
      <SyncBadge />

      {viajes === null ? (
        <>
          <div className="card">
            <p className="estado">Cargando…</p>
          </div>
          <button type="button" className="sec" onClick={onCambiarRol}>
            Cambiar rol
          </button>
        </>
      ) : (
        <>
          <div className="grid">
            <div className="stat">
              <b>{viajes.length}</b>
              <span className="stat-label">Viajes hoy</span>
            </div>
            <div className="stat">
              <b>{totalM3.toFixed(1)}</b>
              <span className="stat-label">M³ hoy</span>
            </div>
          </div>

          {viajes.length === 0 ? (
            <div className="card">
              <p className="estado">No hay viajes registrados hoy</p>
            </div>
          ) : (
            <>
              <div className="card">
                <h4>Resumen por Camión</h4>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Patente</th>
                        <th>Viajes</th>
                        <th>M³</th>
                        <th>Chofer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(porPatente).map(([patente, datos]) => (
                        <tr key={patente}>
                          <td>
                            <b>{patente}</b>
                          </td>
                          <td>{datos.viajes}</td>
                          <td>
                            <b>{datos.m3}</b>
                          </td>
                          <td>{datos.chofer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h4>Resumen por Material</h4>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Viajes</th>
                        <th>M³</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(porMaterial).map(([material, datos]) => (
                        <tr key={material}>
                          <td>{material}</td>
                          <td>{datos.viajes}</td>
                          <td>
                            <b>{datos.m3}</b>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h4>Todos los viajes en vivo</h4>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Hora Sal.</th>
                        <th>Mat</th>
                        <th>Patente</th>
                        <th>M³</th>
                        <th>Chofer</th>
                        <th>Llegada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viajes.map((v) => (
                        <tr key={v.id}>
                          <td>{v.horaSalida}</td>
                          <td>{v.material}</td>
                          <td>{v.patente}</td>
                          <td>{v.m3}</td>
                          <td>{v.chofer}</td>
                          <td>{v.horaLlegada ? `✅ ${v.horaLlegada}` : 'En viaje...'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="actions">
                  <button type="button" className="sec" onClick={() => exportarExcel(viajes)}>
                    📊 Exportar Excel
                  </button>
                  <button type="button" className="sec danger" onClick={handleBorrarDia}>
                    🗑️ Borrar día (solo admin)
                  </button>
                </div>
              </div>
            </>
          )}

          <button type="button" className="sec" onClick={onCambiarRol}>
            Cambiar rol
          </button>
        </>
      )}
    </div>
  )
}