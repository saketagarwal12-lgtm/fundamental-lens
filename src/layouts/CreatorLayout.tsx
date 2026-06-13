import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { GitBranch, BookOpen, BarChart2, Settings, LogOut, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { IconRail } from '../components/IconRail';
import type { RailItem } from '../components/IconRail';
import { useAuth } from '../contexts/AuthContext';

const navItems: RailItem[] = [
  { to: '/creator/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/creator/coverage', icon: BookOpen, label: 'Coverage' },
  { to: '/creator/sector-models', icon: BarChart2, label: 'Sector Models' },
  { to: '/creator/assess', icon: Sparkles, label: 'Assess private co.' },
  { to: '/creator/settings', icon: Settings, label: 'Settings' },
];

export const CreatorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'transparent' }}>
      {/* Radial glows */}
      <div className="radial-glow-tl" />
      <div className="radial-glow-br" />

      {/* Tier 1 — permanent icon rail */}
      <IconRail items={navItems} home="/creator/pipeline" badge="Creator" />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        <header
          className="h-14 flex items-center gap-4 px-4 shrink-0 z-10"
          style={{ background: 'rgba(11,31,32,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <Wordmark size="md" />
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>Creator</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-2">
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
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
