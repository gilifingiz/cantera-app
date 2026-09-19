import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app
let db = null

// Firestore is optional: without credentials the app degrades to
// localStorage-only mode (same fallback as the original single-file app).
export const isFirestoreEnabled = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey)

if (isFirestoreEnabled) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
}

export { db }