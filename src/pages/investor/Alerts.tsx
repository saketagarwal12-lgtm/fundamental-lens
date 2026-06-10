import { Bell, TrendingUp, TrendingDown, Info, AlertTriangle } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'score_up',
    issuer: 'KrazyBee Services Limited',
    date: 'Apr 2026',
    title: 'Health Score increased: 64 → 67',
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
    title: 'Health Score declined: 57 → 54',
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

const iconColors = {
  score_up: 'text-[#2F8A5F] bg-[#2F8A5F]/10',
  score_down: 'text-[#B5524A] bg-[#B5524A]/10',
  material: 'text-brand bg-brand/10',
  rating: 'text-[#23262C] bg-paper',
  governance: 'text-[#C08A2E] bg-[#C08A2E]/10',
};

export const Alerts: React.FC = () => {
  const unread = alerts.filter(a => !a.read).length;

  return (
    <div className="p-6 page-fade max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-ink">Alerts</h1>
          <p className="text-sm text-muted mt-0.5">
            {unread > 0 ? <span className="text-[#C08A2E] font-medium">{unread} unread</span> : 'All caught up'}
            {' '}· Material changes across your holdings
          </p>
        </div>
        <button className="text-xs text-muted hover:text-brand transition-colors">Mark all read</button>
      </div>

      <div className="space-y-3">
        {alerts.map(a => {
          const Icon = icons[a.type as keyof typeof icons];
          const colorClass = iconColors[a.type as keyof typeof iconColors];
          return (
            <div key={a.id} className={`bg-white rounded-xl border p-5 flex gap-4 transition-colors ${!a.read ? 'border-brand/30 bg-brand-tint/30' : 'border-hairline'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#23262C] text-sm">{a.title}</p>
                    <p className="text-xs text-muted mt-0.5">{a.issuer} · {a.date}</p>
                  </div>
                  {!a.read && <span className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-muted mt-2 leading-relaxed">{a.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert preferences */}
      <div className="mt-8 bg-white rounded-xl border border-hairline p-5">
        <h3 className="font-semibold text-[#23262C] mb-4">Alert Preferences</h3>
        <div className="space-y-3">
          {[
            { label: 'Health Score changes (±3 points)', on: true },
            { label: 'External rating actions', on: true },
            { label: 'Material developments', on: true },
            { label: 'NCD maturity reminders (30d prior)', on: false },
            { label: 'New coverage added', on: true },
          ].map(pref => (
            <label key={pref.label} className="flex items-center justify-between py-2 border-b border-hairline last:border-0 cursor-pointer">
              <span className="text-sm text-[#23262C]">{pref.label}</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${pref.on ? 'bg-brand' : 'bg-hairline'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pref.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
