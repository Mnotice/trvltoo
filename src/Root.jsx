import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import App from './App.jsx';
import Spots from './pages/Spots.jsx';
import Trips from './pages/Trips.jsx';
import NewTrip from './pages/NewTrip.jsx';
import TripDetail from './pages/TripDetail.jsx';
import SharedTrip from './pages/SharedTrip.jsx';
import MapPage from './pages/MapPage.jsx';
import InvitePage from './pages/InvitePage.jsx';
import Destinations from './pages/Destinations.jsx';
import Upgrade from './pages/Upgrade.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';

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
          <Routes>
            <Route path="/"             element={<Landing />} />
            <Route path="/plan"         element={<App />} />
            <Route path="/spots"        element={<Spots />} />
            <Route path="/trips"        element={<Trips />} />
            <Route path="/trips/new"    element={<NewTrip />} />
            <Route path="/trips/:id"    element={<TripDetail />} />
            <Route path="/trip/:id"     element={<SharedTrip />} />
            <Route path="/map"          element={<MapPage />} />
            <Route path="/invite/:token" element={<InvitePage />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/upgrade"      element={<Upgrade />} />
          </Routes>
          <InstallPrompt />
        </BrowserRouter>
      )}
    </>
  );
}
