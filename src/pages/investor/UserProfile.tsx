import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 page-fade max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-primary-text">Profile</h1>
        <p className="text-sm text-muted-text mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="glass-card-elevated p-6 mb-5">
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: 'rgba(45,212,191,0.2)', color: '#2DD4BF' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-text">{userName}</h2>
            <p className="text-sm text-muted-text">Investor · Individual</p>
            <span
              className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.2)' }}
            >
              <Shield size={11} /> Standard Access
            </span>
          </div>
        </div>
      </div>

      {/* Account settings */}
      <div className="glass-card overflow-hidden mb-5">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-semibold text-primary-text">Account</h3>
        </div>
        <div>
          {[
            { icon: User, label: 'Display name', value: userName },
            { icon: Mail, label: 'Email notifications', value: 'prototype@fundamentallens.in' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-5 py-4"
              style={i < 1 ? { borderBottom: '1px solid rgba(255,255,255,0.07)' } : {}}
            >
              <item.icon size={16} className="text-muted-text" />
              <div className="flex-1">
                <p className="text-sm text-primary-text">{item.label}</p>
                <p className="text-xs text-muted-text">{item.value}</p>
              </div>
              <button className="text-xs text-brand-teal hover:underline">Edit</button>
            </div>
          ))}
        </div>
      </div>

      {/* Display preferences */}
      <div className="glass-card overflow-hidden mb-5">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-semibold text-primary-text">Display Preferences</h3>
        </div>
        <div>
          {[
            { label: 'Show research disclaimers', on: true },
            { label: 'Compact table view', on: false },
            { label: 'Show score change delta', on: true },
          ].map((p, i, arr) => (
            <label
              key={p.label}
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.07)' } : {}}
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

      <button
        onClick={() => { logout(); navigate('/'); }}
        className="flex items-center gap-2 w-full px-5 py-4 rounded-xl text-sm font-medium transition-colors glass-card"
        style={{ color: '#FB7185', justifyContent: 'flex-start' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,113,133,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.background = '')}
      >
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );
};
