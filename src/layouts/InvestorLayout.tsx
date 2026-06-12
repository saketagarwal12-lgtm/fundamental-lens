import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Star, FileText, Bell, User, TrendingUp, Search, LogOut, RefreshCw, Menu, X, ChevronDown, ChevronsLeft, ChevronsRight, Aperture } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { companies } from '../data/companies';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/portfolio-score', icon: TrendingUp, label: 'Portfolio Fundamental Score' },
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
  const { sidebarCollapsed: collapsed, toggleSidebar: toggleCollapsed } = useUI();

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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-60 ${collapsed ? 'lg:w-[68px]' : 'lg:w-60'} flex flex-col transition-[transform,width] duration-200 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(10,25,27,0.85)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className={`flex items-center h-14 ${collapsed ? 'lg:px-0 lg:justify-center px-5' : 'px-5'}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span className={collapsed ? 'lg:hidden' : ''}><Wordmark size="md" /></span>
          {collapsed && (
            <Aperture size={22} strokeWidth={2.2} className="hidden lg:block text-brand-teal" style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.7))' }} />
          )}
          {/* collapse toggle (desktop) */}
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`ml-auto hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-muted-text hover:text-primary-text transition-colors ${collapsed ? 'lg:hidden' : ''}`}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronsLeft size={16} />
          </button>
          <button className="ml-auto lg:hidden text-muted-text hover:text-primary-text" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                }`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
            </NavLink>
          ))}
        </nav>
        {/* expand toggle when collapsed */}
        {collapsed && (
          <button
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            className="hidden lg:flex items-center justify-center h-10 mx-3 mb-2 rounded-md text-muted-text hover:text-primary-text transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronsRight size={16} />
          </button>
        )}
        <div className={`p-4 ${collapsed ? 'lg:hidden' : ''}`} style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] text-faint-text leading-relaxed">
            Research, not personalised investment advice. Investments carry risk.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top bar */}
        <header
          className="h-14 flex items-center gap-4 px-4 shrink-0 z-10"
          style={{ background: 'rgba(11,31,32,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Mobile: open drawer */}
          <button
            className="lg:hidden text-muted-text hover:text-primary-text"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          {/* Desktop: persistent collapse toggle */}
          <button
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-muted-text hover:text-primary-text transition-colors shrink-0"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>

          {/* Search */}
          <div className={`flex-1 relative transition-all duration-200 ${collapsed ? 'max-w-2xl' : 'max-w-lg'}`}>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
            <input
              type="search"
              placeholder="Search issuers, ISINs…"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#E9F3F1',
              }}
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
                      c.recommendation === 'Avoid' ? 'text-[#FB7185]' :
                      'text-[#FBBF24]'
                    }`} style={{
                      background: c.recommendation === 'Subscribe' ? 'rgba(52,211,153,0.15)' :
                        c.recommendation === 'Avoid' ? 'rgba(251,113,133,0.15)' :
                        'rgba(251,191,36,0.15)',
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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
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
