import { useState } from 'react'
import { exportarExcel } from '../utils/csv.js'

const ADMIN_PASSWORD = 'cantera2024'

export default function AdminView({ viajes, borrarTodo, onCambiarRol }) {
  const [clave, setClave] = useState('')
  const [autenticado, setAutenticado] = useState(false)

  function handleEntrar() {
    if (clave === ADMIN_PASSWORD) {
      setAutenticado(true)
    } else {
      alert('Clave incorrecta. Clave por defecto: cantera2024')
    }
  }

  if (!autenticado) {
    return (
      <div className="card">
        <h3>🔐 Panel Admin</h3>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Clave"
        />
        <button type="button" onClick={handleEntrar}>
          ENTRAR
        </button>
      </div>
    )
  }

  const totalM3 = viajes.reduce((sum, v) => sum + (parseFloat(v.m3) || 0), 0)

  const porPatente = {}
  viajes.forEach((v) => {
    if (!porPatente[v.patente]) {
      porPatente[v.patente] = { viajes: 0, m3: 0, chofer: v.chofer }
    }
    porPatente[v.patente].viajes += 1
    porPatente[v.patente].m3 += parseFloat(v.m3)
  })

  const porMaterial = {}
  viajes.forEach((v) => {
    if (!porMaterial[v.material]) {
      porMaterial[v.material] = { viajes: 0, m3: 0 }
    }
    porMaterial[v.material].viajes += 1
    porMaterial[v.material].m3 += parseFloat(v.m3)
  })

  function handleBorrarDia() {
    if (confirm('Borrar todo el día? Solo hazlo si sos admin')) {
      borrarTodo()
    }
  }

  return (
    <>
      <div className="admin-content">
        <div className="grid">
          <div className="stat">
            <b>{viajes.length}</b>Viajes hoy
          </div>
          <div className="stat">
            <b>{totalM3.toFixed(1)}</b>M³ hoy
          </div>
        </div>

        <div className="card">
          <h4>Resumen por Camión</h4>
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

        <div className="card">
          <h4>Resumen por Material</h4>
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

        <div className="card">
          <h4>Todos los viajes en vivo</h4>
          <div style={{ overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Hora Sal.</th>
                  <th>Mat</th>
                  <th>Patente</th>
                  <th>Int</th>
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
                    <td>{v.interno || '-'}</td>
                    <td>{v.m3}</td>
                    <td>{v.chofer}</td>
                    <td>{v.horaLlegada ? `✅ ${v.horaLlegada}` : 'En viaje...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <button type="button" className="sec" onClick={() => exportarExcel(viajes)}>
            📊 Exportar Excel
          </button>
          <button type="button" className="sec" onClick={handleBorrarDia}>
            🗑️ Borrar día (solo admin)
          </button>
        </div>

        <button type="button" className="sec" onClick={onCambiarRol}>
          Cambiar rol
        </button>
      </div>
    </>
  )
}