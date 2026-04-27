import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/trvltoo/',
    plugins: [react(), tailwindcss()],
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

