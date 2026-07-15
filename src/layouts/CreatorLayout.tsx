import { Outlet, useNavigate } from 'react-router-dom';
import { GitBranch, BookOpen, BarChart2, Settings, Sparkles, Workflow } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { IconRail } from '../components/IconRail';
import type { RailItem } from '../components/IconRail';
import { UserMenu } from '../components/UserMenu';
import { useAuth } from '../contexts/AuthContext';

const navItems: RailItem[] = [
  { to: '/creator/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/creator/coverage', icon: BookOpen, label: 'Coverage' },
  { to: '/creator/sector-models', icon: BarChart2, label: 'Sector Models' },
  { to: '/creator/assess', icon: Sparkles, label: 'Assess private co.' },
  { to: '/creator/architecture', icon: Workflow, label: 'Architecture' },
  { to: '/creator/settings', icon: Settings, label: 'Settings' },
];

export const CreatorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

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

          <div className="ml-auto">
            <UserMenu
              userName={userName}
              role="creator"
              accent="#FBBF24"
              onSwitch={() => navigate('/app/dashboard')}
              onSignOut={() => { logout(); navigate('/'); }}
            />
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
