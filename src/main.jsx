import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './index.css'
import Landing from './pages/Landing.jsx'
import App from './App.jsx'
import Spots from './pages/Spots.jsx'
import Trips from './pages/Trips.jsx'
import NewTrip from './pages/NewTrip.jsx'
import TripDetail from './pages/TripDetail.jsx'
import SharedTrip from './pages/SharedTrip.jsx'
import MapPage from './pages/MapPage.jsx'
import InvitePage from './pages/InvitePage.jsx'
import Destinations from './pages/Destinations.jsx'
import Upgrade from './pages/Upgrade.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/plan" element={<App />} />
          <Route path="/spots" element={<Spots />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/new" element={<NewTrip />} />
          <Route path="/trips/:id" element={<TripDetail />} />
          <Route path="/trip/:id" element={<SharedTrip />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/upgrade" element={<Upgrade />} />
        </Routes>
        <InstallPrompt />
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
