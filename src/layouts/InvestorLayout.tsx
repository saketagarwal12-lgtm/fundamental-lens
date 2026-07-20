import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Star, FileText, Bell, User, TrendingUp, Sparkles, Scale, Layers, Workflow, Gavel } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { IconRail } from '../components/IconRail';
import type { RailItem } from '../components/IconRail';
import { UserMenu } from '../components/UserMenu';
import { GlobalSearch } from '../components/GlobalSearch';
import { useAuth } from '../contexts/AuthContext';

const navItems: RailItem[] = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Monitoring dashboard' },
  { to: '/app/portfolio-score', icon: TrendingUp, label: 'Portfolio Fundamental Score' },
  { to: '/app/watchlist', icon: Star, label: 'Watchlist' },
  { to: '/app/compare', icon: Scale, label: 'Compare issuers' },
  { to: '/app/covenants', icon: Gavel, label: 'Covenant monitor' },
  { to: '/app/sectors', icon: Layers, label: 'Sectors' },
  { to: '/app/reports', icon: FileText, label: 'Reports' },
  { to: '/app/assess', icon: Sparkles, label: 'Assess private co.' },
  { to: '/how-it-works/architecture', icon: Workflow, label: 'How it works' },
  { to: '/app/alerts', icon: Bell, label: 'Alerts' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

export const InvestorLayout: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

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

          {/* Search — companies and ISINs */}
          <div className="flex-1 max-w-lg">
            <GlobalSearch />
          </div>

          {/* User menu */}
          <div className="ml-auto">
            <UserMenu
              userName={userName}
              role="investor"
              accent="#2DD4BF"
              onSwitch={() => navigate('/creator/pipeline')}
              onSignOut={() => { logout(); navigate('/'); }}
            />
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
