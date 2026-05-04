import { Link } from 'react-router-dom';
import { Heart, ScrollText, Droplets, Shield, Sparkles, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b45309' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles size={14} />
            Kumbh Parv Nashik 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 leading-tight mb-4">
            Serve the Sacred.<br />
            <span className="text-amber-600">Strengthen the Spirit.</span>
          </h1>
          <p className="text-amber-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join millions in devotion and service. Take a pledge for a cleaner, safer, and more compassionate Kumbh, or register as a contributor to serve the pilgrims of Nashik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pledge"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all hover:-translate-y-0.5"
            >
              <ScrollText size={20} />
              Take a Pledge
            </Link>
            <Link
              to="/contribute"
              className="inline-flex items-center justify-center gap-2 bg-white text-amber-800 border-2 border-amber-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-50 transition-all hover:-translate-y-0.5"
            >
              <Heart size={20} />
              Become a Contributor
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/pledge" className="group bg-white rounded-2xl border border-amber-100 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
              <ScrollText className="text-amber-700" size={24} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Take a Pledge</h3>
            <p className="text-amber-600 text-sm leading-relaxed">
              Commit to a cause — cleanliness, water conservation, discipline, or seva. Receive an instant certificate of commitment.
            </p>
            <span className="inline-block mt-4 text-amber-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Take Pledge &rarr;
            </span>
          </Link>

          <Link to="/contribute" className="group bg-white rounded-2xl border border-amber-100 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Heart className="text-orange-700" size={24} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Become a Contributor</h3>
            <p className="text-amber-600 text-sm leading-relaxed">
              Volunteer your time, skills, or resources. Register as a contributor and Team Kumbh will reach out when your service is needed.
            </p>
            <span className="inline-block mt-4 text-amber-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Register Now &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Why Participate */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">Why Participate</h2>
          <p className="text-amber-600 max-w-xl mx-auto">Kumbh Parv is not just a gathering — it is a call to serve. Your participation makes a difference.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Droplets, title: 'Sacred Rivers, Sacred Duty', desc: 'Protect the Godavari and its surroundings. Conserve water and maintain the sanctity of our holy rivers.' },
            { icon: Shield, title: 'Safety for Millions', desc: 'Help ensure the safety and well-being of millions of pilgrims through discipline and organized service.' },
            { icon: Users, title: 'Community Strength', desc: 'Together, we create a cleaner, more welcoming Nashik. Every contribution matters, no matter how small.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-amber-100 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                <item.icon className="text-amber-600" size={20} />
              </div>
              <h3 className="font-bold text-amber-900 mb-2">{item.title}</h3>
              <p className="text-amber-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Your Service Matters</h2>
          <p className="text-amber-100 mb-8 max-w-lg mx-auto">Every pledge and every contribution brings us closer to a Kumbh that honors both devotion and dignity.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pledge" className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors">
              <ScrollText size={18} />
              Take a Pledge
            </Link>
            <Link to="/contribute" className="inline-flex items-center justify-center gap-2 bg-amber-700 text-white border border-amber-500 px-6 py-3 rounded-xl font-semibold hover:bg-amber-800 transition-colors">
              <Heart size={18} />
              Become a Contributor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
