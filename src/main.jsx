import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App.jsx';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: import.meta.env.PROD,
  tracesSampleRate: 0.2,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_RELEASE ?? 'dev',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10 text-center">
          <div className="p-8 rounded-[3rem] bg-red-500/10 border-2 border-red-500/20 max-w-lg">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-red-500 mb-6">Something went wrong</h2>
            <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white text-slate-900 rounded-full font-black uppercase tracking-tighter">Reload</button>
          </div>
        </div>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
