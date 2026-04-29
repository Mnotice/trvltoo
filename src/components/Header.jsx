import { Moon, Sun, LogOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ currentView, isDark, onToggleTheme, setView, user, onSignIn, onSignOut }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 md:px-12 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/15 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-all">
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </Link>
        <div
          className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xl shadow-2xl cursor-pointer"
          onClick={() => setView('explore')}
        >
          TML
        </div>
        <nav className="hidden md:flex items-center space-x-10">
          {['Explore', 'Plan', 'Community'].map(item => (
            <button
              key={item}
              onClick={() => setView(item.toLowerCase())}
              className={`text-xs font-black uppercase tracking-[0.3em] transition-colors ${
                currentView === item.toLowerCase() ? 'text-teal-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
          {user && (
            <button
              onClick={() => setView('trips')}
              className={`text-xs font-black uppercase tracking-[0.3em] transition-colors ${
                currentView === 'trips' ? 'text-teal-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Trips
            </button>
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={onToggleTheme} className="p-3 rounded-2xl bg-white/10">
          {isDark
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5 text-slate-400" />
          }
        </button>
        {user ? (
          <div className="hidden md:flex items-center gap-3">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-9 h-9 rounded-full border-2 border-teal-500/40"
              />
            )}
            <button
              onClick={onSignOut}
              title="Sign out"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="hidden md:block px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
