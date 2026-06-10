import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Star, FileText, Bell, User, TrendingUp, Search, LogOut, RefreshCw, Menu, X, ChevronDown } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { useAuth } from '../contexts/AuthContext';
import { companies } from '../data/companies';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/portfolio-score', icon: TrendingUp, label: 'Portfolio Score' },
  { to: '/app/watchlist', icon: Star, label: 'Watchlist' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
  { to: '/app/alerts', icon: Bell, label: 'Alerts' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

export const InvestorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen overflow-hidden bg-paper">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-ink flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-14 px-5 border-b border-white/10">
          <Wordmark lightMode size="md" />
          <button className="ml-auto lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-[10px] text-white/30 leading-relaxed">
            Research, not personalised investment advice. Investments carry risk.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-hairline flex items-center gap-4 px-4 shrink-0 z-10">
          <button
            className="lg:hidden text-muted hover:text-[#23262C]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search issuers, ISINs…"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-paper border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
            />
            {showResults && results.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-hairline rounded-lg shadow-lg z-50 overflow-hidden">
                {results.map(c => (
                  <button
                    key={c.id}
                    onMouseDown={() => handleSelectCompany(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-paper transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#23262C] truncate">{c.name}</p>
                      <p className="text-xs text-muted">{c.sector} · {c.externalRating}</p>
                    </div>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded shrink-0 ${
                      c.recommendation === 'Subscribe' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' :
                      c.recommendation === 'Avoid' ? 'bg-[#B5524A]/10 text-[#B5524A]' :
                      'bg-[#C08A2E]/10 text-[#C08A2E]'
                    }`}>
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-paper transition-colors text-sm"
            >
              <div className="w-7 h-7 rounded-full bg-brand/20 text-brand flex items-center justify-center text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{userName}</span>
              <ChevronDown size={14} className="text-muted" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-hairline rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { navigate('/creator/pipeline'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left hover:bg-paper transition-colors"
                >
                  <RefreshCw size={14} className="text-muted" /> Switch to Creator
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left hover:bg-paper text-[#B5524A] transition-colors"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Disclaimer strip */}
        <div className="bg-white border-t border-hairline px-6 py-2 text-center no-print shrink-0">
          <p className="text-[11px] text-muted">
            Research, not personalised investment advice. Past performance does not guarantee future results.
            Read all offer documents before investing.
          </p>
        </div>
      </div>
    </div>
  );
};
