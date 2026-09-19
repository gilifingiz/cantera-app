import { useState } from 'react'
import AdminView from './components/AdminView.jsx'
import ChoferView from './components/ChoferView.jsx'
import Login from './components/Login.jsx'
import { useViajes } from './hooks/useViajes.js'

export default function App() {
  const [rol, setRol] = useState(null)
  const { viajes, addViaje, marcarLlegada, borrarTodo } = useViajes()

  function cambiarRol() {
    setRol(null)
  }

  if (rol === 'chofer') {
    return (
      <main>
        <ChoferView
          viajes={viajes}
          addViaje={addViaje}
          marcarLlegada={marcarLlegada}
          onCambiarRol={cambiarRol}
        />
      </main>
    )
  }

  if (rol === 'admin') {
    return (
      <main className="main-admin">
        <AdminView viajes={viajes} borrarTodo={borrarTodo} onCambiarRol={cambiarRol} />
      </main>
    )
  }

  return (
    <main className="main-login">
      <Login onSelect={setRol} viajes={viajes} />
    </main>
  )
}