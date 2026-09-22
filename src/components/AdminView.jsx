import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exportarExcel } from '../utils/csv.js'
import {
  authErrorMessage,
  loginAdmin,
  logoutAdmin,
  useAdminAuth,
} from '../services/auth.js'
import SyncBadge from './SyncBadge.jsx'

export default function AdminView({ viajes, borrarTodo }) {
  const navigate = useNavigate()
  const { checking, user } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [loginError, setLoginError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleEntrar(e) {
    e.preventDefault()
    setBusy(true)
    setLoginError('')
    try {
      await loginAdmin(email, clave)
      setClave('')
    } catch (err) {
      setLoginError(authErrorMessage(err.code))
    } finally {
      setBusy(false)
    }
  }

  function cerrarSesion() {
    logoutAdmin()
  }

  if (checking) {
    return (
      <>
        <div className="card">
          <p className="estado">Cargando…</p>
        </div>
        <button type="button" className="sec" onClick={() => navigate('/')}>
          Cambiar rol
        </button>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <div className="card">
          <h3>🔐 Panel Admin</h3>
          <form onSubmit={handleEntrar} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setLoginError('')
                }}
                placeholder="admin@cantera.com.ar"
                autoComplete="email"
                autoFocus
                aria-invalid={Boolean(loginError)}
                aria-describedby={loginError ? 'err-login' : undefined}
              />
            </div>
            <div className="field">
              <label htmlFor="clave">Contraseña</label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => {
                  setClave(e.target.value)
                  setLoginError('')
                }}
                placeholder="Contraseña"
                autoComplete="current-password"
                aria-invalid={Boolean(loginError)}
                aria-describedby={loginError ? 'err-login' : undefined}
              />
              {loginError && (
                <p className="field-error" id="err-login" role="alert">
                  {loginError}
                </p>
              )}
            </div>
            <button type="submit" disabled={busy}>
              {busy ? 'ENTRANDO…' : 'ENTRAR'}
            </button>
          </form>
        </div>
        <button type="button" className="sec" onClick={() => navigate('/')}>
          Cambiar rol
        </button>
      </>
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
          <button type="button" className="sec" onClick={() => navigate('/')}>
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
                        <th>Destino</th>
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
                          <td>{v.destino || '—'}</td>
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

          <div className="actions">
            <button type="button" className="sec" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
            <button type="button" className="sec" onClick={() => navigate('/')}>
              Cambiar rol
            </button>
          </div>
        </>
      )}
    </div>
  )
}