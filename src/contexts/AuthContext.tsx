import React, { createContext, useContext, useState } from 'react';

export type Role = 'investor' | 'creator' | null;

interface AuthContextType {
  role: Role;
  userName: string;
  login: (role: 'investor' | 'creator', name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  userName: '',
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => (sessionStorage.getItem('fl_role') as Role) ?? null);
  const [userName, setUserName] = useState(() => sessionStorage.getItem('fl_user') ?? '');
  const login = (r: 'investor' | 'creator', name = '') => {
    const n = name || (r === 'investor' ? 'Investor' : 'Research Analyst');
    setRole(r);
    setUserName(n);
    sessionStorage.setItem('fl_role', r);
    sessionStorage.setItem('fl_user', n);
  };
  const logout = () => {
    setRole(null);
    setUserName('');
    sessionStorage.removeItem('fl_role');
    sessionStorage.removeItem('fl_user');
  };
  return <AuthContext.Provider value={{ role, userName, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
