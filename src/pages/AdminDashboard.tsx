import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getContributors, getPledgeAnalytics } from '../lib/firestore';
import { contributionIntents } from '../data/contributionIntents';
import { pledgeCategories } from '../data/pledgeCategories';
import { LogOut, Users, BarChart3, Search, Download, Loader2 } from 'lucide-react';

interface ContributorRecord {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  pinCode: string;
  preferredLanguage: string;
  intents: string[];
  createdAt: string | null;
}

interface PledgeAnalyticsRecord {
  id: string;
  category: string;
  count: number;
  lastPledgedAt: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState<ContributorRecord[]>([]);
  const [analytics, setAnalytics] = useState<PledgeAnalyticsRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIntent, setFilterIntent] = useState('');
  const [activeTab, setActiveTab] = useState<'contributors' | 'analytics'>('contributors');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin', { replace: true });
      } else {
        loadData();
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [contribData, analyticsData] = await Promise.all([
        getContributors(),
        getPledgeAnalytics(),
      ]);
      setContributors(contribData as ContributorRecord[]);
      setAnalytics(analyticsData as PledgeAnalyticsRecord[]);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const filteredContributors = contributors.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsappNumber.includes(searchQuery) ||
      c.pinCode.includes(searchQuery);
    const matchesIntent = !filterIntent || c.intents.includes(filterIntent);
    return matchesSearch && matchesIntent;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'PIN Code', 'Language', 'Intents', 'Registered At'];
    const rows = filteredContributors.map((c) => {
      const date = c.createdAt
        ? new Date(c.createdAt).toLocaleString('en-IN')
        : 'N/A';
      const intentLabels = c.intents
        .map((id) => {
          const found = contributionIntents.find((i) => i.id === id);
          return found ? found.en : id;
        })
        .join('; ');
      return [c.fullName, c.email, c.whatsappNumber, c.pinCode, c.preferredLanguage, intentLabels, date];
    });
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kumbhseva-contributors.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top bar */}
      <div className="bg-white border-b border-amber-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-amber-900">KumbhSeva Admin</h1>
            <p className="text-amber-600 text-xs">Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="text-amber-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">{contributors.length}</p>
                <p className="text-amber-600 text-xs">Contributors</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <BarChart3 className="text-orange-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">
                  {analytics.reduce((sum, a) => sum + (a.count || 0), 0)}
                </p>
                <p className="text-amber-600 text-xs">Total Pledges</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BarChart3 className="text-green-700" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">{analytics.length}</p>
                <p className="text-amber-600 text-xs">Pledge Categories Used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-amber-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('contributors')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'contributors' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-600 hover:text-amber-800'
            }`}
          >
            Contributors
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-600 hover:text-amber-800'
            }`}
          >
            Pledge Analytics
          </button>
        </div>

        {activeTab === 'contributors' && (
          <div className="bg-white rounded-xl border border-amber-100">
            {/* Search & Filter */}
            <div className="p-4 border-b border-amber-50 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone, PIN..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 outline-none text-sm text-amber-900 placeholder:text-amber-300"
                />
              </div>
              <select
                value={filterIntent}
                onChange={(e) => setFilterIntent(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-amber-200 text-sm text-amber-800 focus:border-amber-400 outline-none"
              >
                <option value="">All Intents</option>
                {contributionIntents.map((intent) => (
                  <option key={intent.id} value={intent.id}>
                    {intent.en.length > 50 ? intent.en.slice(0, 50) + '...' : intent.en}
                  </option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-amber-50 text-amber-700 text-left">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">WhatsApp</th>
                    <th className="px-4 py-3 font-semibold">PIN</th>
                    <th className="px-4 py-3 font-semibold">Intents</th>
                    <th className="px-4 py-3 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContributors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-amber-400">
                        No contributors found
                      </td>
                    </tr>
                  ) : (
                    filteredContributors.map((c) => (
                      <tr key={c.id} className="border-t border-amber-50 hover:bg-amber-50/50">
                        <td className="px-4 py-3 font-medium text-amber-900">{c.fullName}</td>
                        <td className="px-4 py-3 text-amber-700">{c.email}</td>
                        <td className="px-4 py-3 text-amber-700">+91 {c.whatsappNumber}</td>
                        <td className="px-4 py-3 text-amber-700">{c.pinCode}</td>
                        <td className="px-4 py-3 text-amber-700">
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            {c.intents.length}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-amber-600 text-xs">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <h3 className="font-bold text-amber-900 mb-4">Pledge Analytics</h3>
            {analytics.length === 0 ? (
              <p className="text-amber-400 text-center py-8">No pledge data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.map((a) => {
                  const cat = pledgeCategories.find((c) => c.id === a.category);
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <div>
                        <p className="font-medium text-amber-900">{cat?.titleEn || a.category}</p>
                        <p className="text-amber-500 text-xs">
                          {cat?.titleMr} / {cat?.titleHi}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-800">{a.count}</p>
                        <p className="text-amber-500 text-xs">pledges</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
