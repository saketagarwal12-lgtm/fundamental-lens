import { Save, Bell, Users, Shield, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-6 page-fade max-w-3xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-primary-text">Creator Settings</h1>
        <p className="text-sm text-muted-text mt-0.5">Platform configuration for the research workspace</p>
      </div>

      <div className="space-y-5">
        {/* Notifications */}
        <div className="glass-card overflow-hidden">
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Bell size={16} style={{ color: '#2DD4BF' }} />
            <h3 className="font-semibold text-primary-text">Pipeline Notifications</h3>
          </div>
          <div>
            {[
              { label: 'Notify when issuer is blocked at Gaps stage', on: true },
              { label: 'Notify when report is ready for review', on: true },
              { label: 'Notify when rating action is filed by agencies', on: false },
              { label: 'Weekly pipeline summary digest', on: true },
            ].map((p, i, arr) => (
              <label
                key={p.label}
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors"
                style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.07)' } : {}}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="text-sm text-primary-text">{p.label}</span>
                <div
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{ background: p.on ? 'linear-gradient(135deg,#2DD4BF,#22D3EE)' : 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ transform: p.on ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="glass-card overflow-hidden">
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Users size={16} style={{ color: '#2DD4BF' }} />
            <h3 className="font-semibold text-primary-text">Team & Permissions</h3>
          </div>
          <div className="p-5 space-y-3">
            {[
              { name: 'R. Mehta', role: 'Senior Analyst', access: 'Publish' },
              { name: 'S. Kapoor', role: 'Analyst', access: 'Draft + Submit' },
              { name: 'P. Iyer', role: 'Analyst', access: 'Draft + Submit' },
              { name: 'A. Sharma', role: 'Junior Analyst', access: 'Draft only' },
              { name: 'T. Nair', role: 'Junior Analyst', access: 'Draft only' },
            ].map((m, i, arr) => (
              <div
                key={m.name}
                className="flex items-center justify-between py-2"
                style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.07)' } : {}}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-text">{m.name}</p>
                    <p className="text-xs text-muted-text">{m.role}</p>
                  </div>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded text-muted-text"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {m.access}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="glass-card overflow-hidden">
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Database size={16} style={{ color: '#2DD4BF' }} />
            <h3 className="font-semibold text-primary-text">Data Source Configuration</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'MCA21 API endpoint', value: 'api.mca.gov.in/v3', connected: true },
              { label: 'CARE Ratings feed', value: 'ratings.careratings.com/api', connected: true },
              { label: 'CRISIL Research', value: 'research.crisil.com/feed', connected: false },
              { label: 'RBI DBIE', value: 'dbie.rbi.org.in/api', connected: true },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-text mb-1">{s.label}</p>
                  <input
                    type="text"
                    defaultValue={s.value}
                    className="w-full px-3 py-2 text-xs rounded-lg font-mono focus:outline-none text-primary-text"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded shrink-0 mt-4"
                  style={s.connected
                    ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' }
                    : { background: 'rgba(251,113,133,0.15)', color: '#FB7185' }
                  }
                >
                  {s.connected ? 'Connected' : 'Error'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 rounded-lg btn-gradient text-sm font-semibold">
          <Save size={15} /> Save Settings
        </button>
      </div>
    </div>
  );
};
