import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

const UIContext = createContext<UIContextType>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  setSidebarCollapsed: () => {},
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('fl-sidebar-collapsed');
    if (saved !== null) return saved === '1';
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  const setSidebarCollapsed = useCallback((v: boolean) => {
    sessionStorage.setItem('fl-sidebar-collapsed', v ? '1' : '0');
    setCollapsed(v);
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      sessionStorage.setItem('fl-sidebar-collapsed', next ? '1' : '0');
      return next;
    });
  }, []);

  return (
    <UIContext.Provider value={{ sidebarCollapsed, toggleSidebar, setSidebarCollapsed }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
