import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { GitBranch, BookOpen, BarChart2, Settings, LogOut, RefreshCw, Menu, X, ChevronDown } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/creator/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/creator/coverage', icon: BookOpen, label: 'Coverage' },
  { to: '/creator/sector-models', icon: BarChart2, label: 'Sector Models' },
  { to: '/creator/settings', icon: Settings, label: 'Settings' },
];

export const CreatorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-ink flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-14 px-5 border-b border-white/10">
          <Wordmark lightMode size="md" />
          <div className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-brand/30 text-brand-tint">Creator</div>
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
            Research workspace. Published reports go to investor subscribers.
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-hairline flex items-center gap-4 px-4 shrink-0 z-10">
          <button className="lg:hidden text-muted hover:text-[#23262C]" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium text-[#23262C]">Research Creator Workspace</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand/10 text-brand">INTERNAL</span>
          </div>
          <div className="relative ml-auto">
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-paper transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#C08A2E]/20 text-[#C08A2E] flex items-center justify-center text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{userName}</span>
              <ChevronDown size={14} className="text-muted" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-hairline rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { navigate('/app/dashboard'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left hover:bg-paper transition-colors"
                >
                  <RefreshCw size={14} className="text-muted" /> Switch to Investor View
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

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
