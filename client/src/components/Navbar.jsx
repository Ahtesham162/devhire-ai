import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileUp, LogOut, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3.5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
          <Terminal size={18} className="text-accent" strokeWidth={2.5} />
          DevHire<span className="text-accent">AI</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              isActive('/') ? 'bg-accent/10 text-accent' : 'text-muted hover:text-white'
            }`}
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            to="/upload"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              isActive('/upload') ? 'bg-accent/10 text-accent' : 'text-muted hover:text-white'
            }`}
          >
            <FileUp size={15} /> New Analysis
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted hover:text-danger transition ml-2"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}