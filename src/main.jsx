import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'
import SharedTrip from './pages/SharedTrip.jsx'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2,
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div style={{ padding: 40, color: '#fff', background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>Something went wrong. <a href="/" style={{ marginLeft: 12, color: '#14b8a6' }}>Reload</a></div>}>
      <BrowserRouter basename="/trvltoo">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/trip/:id" element={<SharedTrip />} />
        </Routes>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
