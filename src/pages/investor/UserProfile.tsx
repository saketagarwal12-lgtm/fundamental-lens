import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 page-fade max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-ink">Profile</h1>
        <p className="text-sm text-muted mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-hairline p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand/20 text-brand flex items-center justify-center text-2xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">{userName}</h2>
            <p className="text-sm text-muted">Investor · Individual</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded bg-brand/10 text-brand">
              <Shield size={11} /> Standard Access
            </span>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="bg-white rounded-xl border border-hairline overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-hairline">
          <h3 className="font-semibold text-[#23262C]">Account</h3>
        </div>
        <div className="divide-y divide-hairline">
          <div className="flex items-center gap-3 px-5 py-4">
            <User size={16} className="text-muted" />
            <div className="flex-1">
              <p className="text-sm text-[#23262C]">Display name</p>
              <p className="text-xs text-muted">{userName}</p>
            </div>
            <button className="text-xs text-brand hover:underline">Edit</button>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <Mail size={16} className="text-muted" />
            <div className="flex-1">
              <p className="text-sm text-[#23262C]">Email notifications</p>
              <p className="text-xs text-muted">prototype@fundamentallens.in</p>
            </div>
            <button className="text-xs text-brand hover:underline">Edit</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-hairline overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-hairline">
          <h3 className="font-semibold text-[#23262C]">Display Preferences</h3>
        </div>
        <div className="divide-y divide-hairline">
          {[
            { label: 'Show research disclaimers', on: true },
            { label: 'Compact table view', on: false },
            { label: 'Show score change delta', on: true },
          ].map(p => (
            <label key={p.label} className="flex items-center justify-between px-5 py-4 cursor-pointer">
              <span className="text-sm text-[#23262C]">{p.label}</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${p.on ? 'bg-brand' : 'bg-hairline'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${p.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => { logout(); navigate('/'); }}
        className="flex items-center gap-2 w-full px-5 py-4 bg-white rounded-xl border border-hairline text-[#B5524A] text-sm font-medium hover:bg-[#B5524A]/5 transition-colors"
      >
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );
};
