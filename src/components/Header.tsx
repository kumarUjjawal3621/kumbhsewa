import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div className="leading-tight">
            <span className="block text-amber-800 font-bold text-lg tracking-wide">KumbhSeva</span>
            <span className="block text-amber-600 text-[10px] tracking-widest uppercase">Nashik 2026</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-amber-800 hover:text-amber-600 font-medium text-sm transition-colors">Home</Link>
          <Link to="/pledge" className="text-amber-800 hover:text-amber-600 font-medium text-sm transition-colors">Take Pledge</Link>
          <Link to="/contribute" className="text-amber-800 hover:text-amber-600 font-medium text-sm transition-colors">Contribute</Link>
          <Link to="/admin" className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">Admin</Link>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-amber-100 bg-white px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-800 font-medium">Home</Link>
          <Link to="/pledge" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-800 font-medium">Take Pledge</Link>
          <Link to="/contribute" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-800 font-medium">Contribute</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-amber-600 font-medium">Admin</Link>
        </nav>
      )}
    </header>
  );
}
