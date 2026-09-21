import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

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
let auth = null

// Firestore is optional: without credentials the app degrades to local-only
// mode (in-memory state, no persistence).
export const isFirestoreEnabled = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey)

if (isFirestoreEnabled) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  // Native offline persistence (IndexedDB cache + automatic write queue),
  // shared across tabs. Replaces the old localStorage data cache.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  })
}

export { auth, db }