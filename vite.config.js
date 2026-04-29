import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'pwa-icon.svg'],
        manifest: {
          name: 'TRVLTOO — AI Travel Planner',
          short_name: 'TRVLTOO',
          description: 'Plan your next trip with Claude AI. Day-by-day itineraries built around your style, budget, and saved spots.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkOnly',
            },
          ],
        },
      }),
    ],
    server: {
      // Proxy /api to Vercel dev server (run `vercel dev` on port 3000 for API routes)
      proxy: {
        '/api': { target: 'http://localhost:3000', changeOrigin: true },
      },
    },
    build: {
      rolldownOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/jspdf'))        return 'pdf';
            if (id.includes('node_modules/@sentry'))      return 'sentry';
            if (id.includes('node_modules/framer-motion')) return 'motion';
            if (id.includes('node_modules/firebase'))     return 'firebase';
            if (id.includes('node_modules/react-router')) return 'vendor';
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
          },
        },
      },
    },
});

