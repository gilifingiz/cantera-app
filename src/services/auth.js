import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase.js'

// Admin-only authentication. Drivers never sign in; only the admin panel
// consumes this service. Session persists across reloads via the Firebase
// Auth default local persistence (IndexedDB on modern browsers).

export async function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logoutAdmin() {
  return signOut(auth)
}

// Returns { checking, user }: `checking: true` while the stored session is
// being resolved (show "Cargando…"), then `user` is the signed-in user or
// null when nobody is authenticated.
export function useAdminAuth() {
  const [state, setState] = useState({ checking: true, user: null })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ checking: false, user })
    })
    return unsubscribe
  }, [])

  return state
}

// Maps Firebase Auth error codes to friendly Spanish copy.
export function authErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos.'
    case 'auth/invalid-email':
      return 'El email no es válido.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Esperá un poco y volvé a intentar.'
    default:
      return 'No se pudo iniciar sesión. Probá de nuevo.'
  }
}