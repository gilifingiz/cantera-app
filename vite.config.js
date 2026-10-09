import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Cantera A — Control de Viajes',
        short_name: 'Cantera A',
        description: 'Control de carga y descarga de viajes',
        lang: 'es',
        theme_color: '#1c2733',
        background_color: '#f3f4f6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        cleanupOutdatedCaches: true,
        // Disable the plugin's default cache-first navigation fallback so the
        // NetworkFirst route below is the only navigation handler.
        navigateFallback: null,
        runtimeCaching: [
          {
            // Pages: try the network first so deploys stay instantly visible
            // online; when offline, fall back to the precached index.html.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              precacheFallback: { fallbackURL: '/index.html' },
            },
          },
        ],
      },
    }),
  ],
})
