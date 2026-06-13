import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { GitBranch, BookOpen, BarChart2, Settings, LogOut, RefreshCw, Menu, X, ChevronDown, ChevronsLeft, ChevronsRight, Aperture, Sparkles } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

const navItems = [
  { to: '/creator/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/creator/coverage', icon: BookOpen, label: 'Coverage' },
  { to: '/creator/sector-models', icon: BarChart2, label: 'Sector Models' },
  { to: '/creator/assess', icon: Sparkles, label: 'Assess private co.' },
  { to: '/creator/settings', icon: Settings, label: 'Settings' },
];

export const CreatorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { sidebarCollapsed: collapsed, toggleSidebar: toggleCollapsed } = useUI();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'transparent' }}>
      {/* Radial glows */}
      <div className="radial-glow-tl" />
      <div className="radial-glow-br" />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-60 ${collapsed ? 'lg:w-[68px]' : 'lg:w-60'} flex flex-col transition-[transform,width] duration-200 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(10,25,27,0.85)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className={`flex items-center h-14 ${collapsed ? 'lg:px-0 lg:justify-center px-5' : 'px-5'}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span className={collapsed ? 'lg:hidden' : 'flex items-center'}>
            <Wordmark size="md" />
            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>Creator</span>
          </span>
          {collapsed && (
            <Aperture size={22} strokeWidth={2.2} className="hidden lg:block text-brand-teal" style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.7))' }} />
          )}
          <button
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
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
            Research workspace. Published reports go to investor subscribers.
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        <header
          className="h-14 flex items-center gap-4 px-4 shrink-0 z-10"
          style={{ background: 'rgba(11,31,32,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button className="lg:hidden text-muted-text hover:text-primary-text" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
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
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium text-primary-text">Research Creator Workspace</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>INTERNAL</span>
          </div>
          <div className="relative ml-auto">
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(251,191,36,0.2)', color: '#FBBF24' }}>
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
                  onClick={() => { navigate('/app/dashboard'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left text-muted-text hover:text-primary-text transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <RefreshCw size={14} /> Switch to Investor View
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

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
