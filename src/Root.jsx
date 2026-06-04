import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';

const Planner      = lazy(() => import('./pages/Planner.jsx'));
const Spots        = lazy(() => import('./pages/Spots.jsx'));
const Trips        = lazy(() => import('./pages/Trips.jsx'));
const NewTrip      = lazy(() => import('./pages/NewTrip.jsx'));
const TripDetail   = lazy(() => import('./pages/TripDetail.jsx'));
const SharedTrip   = lazy(() => import('./pages/SharedTrip.jsx'));
const MapPage      = lazy(() => import('./pages/MapPage.jsx'));
const InvitePage   = lazy(() => import('./pages/InvitePage.jsx'));
const Destinations = lazy(() => import('./pages/Destinations.jsx'));
const Upgrade      = lazy(() => import('./pages/Upgrade.jsx'));

const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone === true;

export default function Root() {
  const [splash, setSplash] = useState(isStandalone);

  return (
    <>
      <AnimatePresence>
        {splash && <SplashScreen key="splash" onComplete={() => setSplash(false)} />}
      </AnimatePresence>
      {!splash && (
        <BrowserRouter>
          <OfflineBanner />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/"              element={<Landing />} />
              <Route path="/plan"          element={<Planner />} />
              <Route path="/spots"         element={<Spots />} />
              <Route path="/trips"         element={<Trips />} />
              <Route path="/trips/new"     element={<NewTrip />} />
              <Route path="/trips/:id"     element={<TripDetail />} />
              <Route path="/trip/:id"      element={<SharedTrip />} />
              <Route path="/map"           element={<MapPage />} />
              <Route path="/invite/:token" element={<InvitePage />} />
              <Route path="/destinations"  element={<Destinations />} />
              <Route path="/upgrade"       element={<Upgrade />} />
            </Routes>
          </Suspense>
          <InstallPrompt />
        </BrowserRouter>
      )}
    </>
  );
}
