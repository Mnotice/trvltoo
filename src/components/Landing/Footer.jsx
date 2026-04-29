import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-lg font-black italic uppercase tracking-tighter text-white">TRVLTOO</span>
          <p className="text-[11px] text-white/30 font-medium">Your AI-powered travel planner.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Day Planner', to: '/plan' },
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
          ].map(link => (
            link.to
              ? <Link key={link.label} to={link.to} className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors">{link.label}</Link>
              : <a key={link.label} href={link.href} className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors">{link.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/30 hover:text-white/70 transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-white/30 hover:text-white/70 transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 font-medium">© {new Date().getFullYear()} TRVLTOO. Built with Claude AI.</p>
      </div>
    </footer>
  );
}
