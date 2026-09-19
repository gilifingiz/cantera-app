import { Navigate, Route, Routes } from 'react-router-dom'
import AdminView from './components/AdminView.jsx'
import ChoferView from './components/ChoferView.jsx'
import Login from './components/Login.jsx'
import { useViajes } from './hooks/useViajes.js'

export default function App() {
  const { viajes, addViaje, marcarLlegada, borrarTodo } = useViajes()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="main-login">
            <Login />
          </main>
        }
      />
      <Route
        path="/chofer"
        element={
          <main>
            <ChoferView viajes={viajes} addViaje={addViaje} marcarLlegada={marcarLlegada} />
          </main>
        }
      />
      <Route
        path="/admin"
        element={
          <main className="main-admin">
            <AdminView viajes={viajes} borrarTodo={borrarTodo} />
          </main>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}