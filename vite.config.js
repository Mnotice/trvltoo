import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/trvltoo/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/foursquare': {
          target: 'https://foursquare-places.p.rapidapi.com',
          changeOrigin: true,
          rewrite: (path) => {
            // Support both standard Node URL (when proxying) and browser patterns
            const params = path.split('?')[1] || '';
            const searchParams = new URLSearchParams(params);
            const dest = searchParams.get('destination') || 'Phuket';
            return `/v3/places/search?near=${dest}&limit=20`;
          },
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('X-RapidAPI-Key', env.VITE_RAPIDAPI_KEY || env.RAPIDAPI_KEY);
              proxyReq.setHeader('X-RapidAPI-Host', 'foursquare-places.p.rapidapi.com');
              proxyReq.setHeader('Accept', 'application/json');
            });
          }
        }
      }
    }
  }
})
