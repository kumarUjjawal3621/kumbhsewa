import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">KumbhSeva</h3>
            <p className="text-amber-200 text-sm leading-relaxed">
              A devotional platform for public participation in Kumbh Parv Nashik 2026.
              Take a pledge or register as a contributor to serve the pilgrims.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-amber-200 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/pledge" className="text-amber-200 hover:text-white text-sm transition-colors">Take a Pledge</Link></li>
              <li><Link to="/contribute" className="text-amber-200 hover:text-white text-sm transition-colors">Become a Contributor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Kumbh Parv</h4>
            <p className="text-amber-200 text-sm leading-relaxed">
              Nashik, Maharashtra, India<br />
              2026
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-amber-800 text-center">
          <p className="text-amber-300 text-xs">
            Kumbh Parv Nashik 2026 &middot; Kumbh Commission &middot; All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
