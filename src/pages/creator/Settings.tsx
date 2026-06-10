import { Save, Bell, Users, Shield, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-6 page-fade max-w-3xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-ink">Creator Settings</h1>
        <p className="text-sm text-muted mt-0.5">Platform configuration for the research workspace</p>
      </div>

      <div className="space-y-5">
        {/* Notifications */}
        <div className="bg-white rounded-xl border border-hairline overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
            <Bell size={16} className="text-brand" />
            <h3 className="font-semibold text-[#23262C]">Pipeline Notifications</h3>
          </div>
          <div className="divide-y divide-hairline">
            {[
              { label: 'Notify when issuer is blocked at Gaps stage', on: true },
              { label: 'Notify when report is ready for review', on: true },
              { label: 'Notify when rating action is filed by agencies', on: false },
              { label: 'Weekly pipeline summary digest', on: true },
            ].map(p => (
              <label key={p.label} className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-paper/30 transition-colors">
                <span className="text-sm text-[#23262C]">{p.label}</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${p.on ? 'bg-brand' : 'bg-hairline'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${p.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl border border-hairline overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
            <Users size={16} className="text-brand" />
            <h3 className="font-semibold text-[#23262C]">Team & Permissions</h3>
          </div>
          <div className="p-5 space-y-3">
            {[
              { name: 'R. Mehta', role: 'Senior Analyst', access: 'Publish' },
              { name: 'S. Kapoor', role: 'Analyst', access: 'Draft + Submit' },
              { name: 'P. Iyer', role: 'Analyst', access: 'Draft + Submit' },
              { name: 'A. Sharma', role: 'Junior Analyst', access: 'Draft only' },
              { name: 'T. Nair', role: 'Junior Analyst', access: 'Draft only' },
            ].map(m => (
              <div key={m.name} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-semibold">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#23262C]">{m.name}</p>
                    <p className="text-xs text-muted">{m.role}</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-paper border border-hairline text-muted">{m.access}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="bg-white rounded-xl border border-hairline overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
            <Database size={16} className="text-brand" />
            <h3 className="font-semibold text-[#23262C]">Data Source Configuration</h3>
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
                  <p className="text-xs font-medium text-muted mb-1">{s.label}</p>
                  <input
                    type="text"
                    defaultValue={s.value}
                    className="w-full px-3 py-2 text-xs border border-hairline rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-brand/40 bg-paper/30"
                  />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded shrink-0 mt-4 ${s.connected ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' : 'bg-[#B5524A]/10 text-[#B5524A]'}`}>
                  {s.connected ? 'Connected' : 'Error'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors">
          <Save size={15} /> Save Settings
        </button>
      </div>
    </div>
  );
};
