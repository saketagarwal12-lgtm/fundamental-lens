import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Star, FileText, Bell, User, TrendingUp, Search, LogOut, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { IconRail } from '../components/IconRail';
import type { RailItem } from '../components/IconRail';
import { useAuth } from '../contexts/AuthContext';
import { companies } from '../data/companies';

const navItems: RailItem[] = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Monitoring dashboard' },
  { to: '/app/portfolio-score', icon: TrendingUp, label: 'Portfolio Fundamental Score' },
  { to: '/app/watchlist', icon: Star, label: 'Watchlist' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
  { to: '/app/assess', icon: Sparkles, label: 'Assess private co.' },
  { to: '/app/alerts', icon: Bell, label: 'Alerts' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

export const InvestorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const results = search.length > 1
    ? companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSelectCompany = (id: string) => {
    navigate(`/app/company/${id}`);
    setSearch('');
    setShowResults(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'transparent' }}>
      {/* Radial glows */}
      <div className="radial-glow-tl" />
      <div className="radial-glow-br" />

      {/* Tier 1 — permanent icon rail */}
      <IconRail items={navItems} home="/app/dashboard" />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top bar */}
        <header
          className="h-14 flex items-center gap-4 px-4 shrink-0 z-10"
          style={{ background: 'rgba(11,31,32,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="hidden md:block shrink-0">
            <Wordmark size="md" />
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-lg">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
            <input
              type="search"
              placeholder="Search a company…"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E9F3F1' }}
            />
            {showResults && results.length > 0 && (
              <div
                className="absolute top-full mt-1 left-0 right-0 rounded-lg z-50 overflow-hidden"
                style={{ background: 'rgba(18,42,44,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(18px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
              >
                {results.map(c => (
                  <button
                    key={c.id}
                    onMouseDown={() => handleSelectCompany(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary-text truncate">{c.name}</p>
                      <p className="text-xs text-muted-text">{c.sector} · {c.externalRating}</p>
                    </div>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      c.recommendation === 'Subscribe' ? 'text-[#34D399]' :
                      c.recommendation === 'Avoid' ? 'text-[#FB7185]' : 'text-[#FBBF24]'
                    }`} style={{
                      background: c.recommendation === 'Subscribe' ? 'rgba(52,211,153,0.15)' :
                        c.recommendation === 'Avoid' ? 'rgba(251,113,133,0.15)' : 'rgba(251,191,36,0.15)',
                    }}>
                      {c.recommendation}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm"
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(45,212,191,0.2)', color: '#2DD4BF' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-primary-text">{userName}</span>
              <ChevronDown size={14} className="text-muted-text" />
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-lg z-50 overflow-hidden"
                style={{ background: 'rgba(18,42,44,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(18px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
              >
                <button
                  onClick={() => { navigate('/creator/pipeline'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left text-muted-text hover:text-primary-text transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <RefreshCw size={14} /> Switch to Creator
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left transition-colors"
                  style={{ color: '#FB7185' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,113,133,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content (centred) */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Disclaimer strip */}
        <div className="px-6 py-2 text-center no-print shrink-0" style={{ background: 'rgba(10,25,27,0.6)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[11px] text-faint-text">
            Research, not personalised investment advice. Past performance does not guarantee future results.
            Read all offer documents before investing.
          </p>
        </div>
      </div>
    </div>
  );
};
