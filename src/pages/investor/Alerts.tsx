import { Bell, TrendingUp, TrendingDown, Info, AlertTriangle } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'score_up',
    issuer: 'KrazyBee Services Limited',
    date: 'Apr 2026',
    title: 'Fundamental Score increased: 320 → 335',
    body: 'Series E funding round closed at $280M (unicorn valuation). Capital base strengthened significantly.',
    read: false,
  },
  {
    id: 2,
    type: 'material',
    issuer: 'KrazyBee Services Limited',
    date: 'Apr 2026',
    title: 'Material Development: Series E funding round',
    body: 'Raised $280M at ~$1.5B post-money valuation. Proceeds earmarked for lending expansion and AI underwriting.',
    read: false,
  },
  {
    id: 3,
    type: 'score_down',
    issuer: 'Finora Capital Limited',
    date: 'Mar 2026',
    title: 'Fundamental Score declined: 285 → 270',
    body: 'GNPA elevated to 4.2% vs sector average of 2.5%. MSME stress indicators rising.',
    read: true,
  },
  {
    id: 4,
    type: 'rating',
    issuer: 'KrazyBee Services Limited',
    date: 'Mar 2026',
    title: 'External rating reaffirmed: A (Stable) by CARE',
    body: 'CARE Ratings reaffirmed A (Stable) citing strong growth momentum and healthy profitability.',
    read: true,
  },
  {
    id: 5,
    type: 'governance',
    issuer: 'KrazyBee Services Limited',
    date: 'Aug 2025',
    title: 'Auditor resignation: Tattavam & Co.',
    body: 'Statutory auditor resigned. Replacement search initiated. No qualification on prior audits.',
    read: true,
  },
];

const icons = {
  score_up: TrendingUp,
  score_down: TrendingDown,
  material: Info,
  rating: Bell,
  governance: AlertTriangle,
};

const iconStyles: Record<string, React.CSSProperties> = {
  score_up: { background: 'rgba(52,211,153,0.15)', color: '#34D399' },
  score_down: { background: 'rgba(251,113,133,0.15)', color: '#FB7185' },
  material: { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' },
  rating: { background: 'rgba(255,255,255,0.07)', color: '#9CB3B1' },
  governance: { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' },
};

export const Alerts: React.FC = () => {
  const unread = alerts.filter(a => !a.read).length;

  return (
    <div className="p-6 page-fade max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-primary-text">Alerts</h1>
          <p className="text-sm text-muted-text mt-0.5">
            {unread > 0
              ? <span style={{ color: '#FBBF24' }} className="font-medium">{unread} unread</span>
              : 'All caught up'}
            {' '}· Material changes across your holdings
          </p>
        </div>
        <button className="text-xs text-muted-text hover:text-brand-teal transition-colors">Mark all read</button>
      </div>

      <div className="space-y-3">
        {alerts.map(a => {
          const Icon = icons[a.type as keyof typeof icons];
          const iconStyle = iconStyles[a.type as keyof typeof iconStyles];
          return (
            <div
              key={a.id}
              className="glass-card p-5 flex gap-4"
              style={!a.read ? { borderColor: 'rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.05)' } : {}}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={iconStyle}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-primary-text text-sm">{a.title}</p>
                    <p className="text-xs text-muted-text mt-0.5">{a.issuer} · {a.date}</p>
                  </div>
                  {!a.read && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ background: '#2DD4BF' }}
                    />
                  )}
                </div>
                <p className="text-sm text-muted-text mt-2 leading-relaxed">{a.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert preferences */}
      <div className="mt-8 glass-card p-5">
        <h3 className="font-semibold text-primary-text mb-4">Alert Preferences</h3>
        <div className="space-y-3">
          {[
            { label: 'Fundamental Score changes (±15 points)', on: true },
            { label: 'External rating actions', on: true },
            { label: 'Material developments', on: true },
            { label: 'NCD maturity reminders (30d prior)', on: false },
            { label: 'New coverage added', on: true },
          ].map(pref => (
            <label
              key={pref.label}
              className="flex items-center justify-between py-2 cursor-pointer"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-sm text-primary-text">{pref.label}</span>
              <div
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ background: pref.on ? 'linear-gradient(135deg,#2DD4BF,#22D3EE)' : 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform"
                  style={{ background: '#fff', transform: pref.on ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }}
                />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
