import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { Landing } from './pages/Landing';
import { InvestorLayout } from './layouts/InvestorLayout';
import { CreatorLayout } from './layouts/CreatorLayout';
import { Dashboard } from './pages/investor/Dashboard';
import { PortfolioScore } from './pages/investor/PortfolioScore';
import { Watchlist } from './pages/investor/Watchlist';
import { Reports } from './pages/investor/Reports';
import { Alerts } from './pages/investor/Alerts';
import { UserProfile } from './pages/investor/UserProfile';
import { CompanyPage } from './pages/investor/company/CompanyPage';
import { Pipeline } from './pages/creator/Pipeline';
import { Coverage } from './pages/creator/Coverage';
import { SectorModels } from './pages/creator/SectorModels';
import { Settings } from './pages/creator/Settings';

const ProtectedRoute: React.FC<{
  role: 'investor' | 'creator';
  children: React.ReactNode;
}> = ({ role, children }) => {
  const { role: currentRole } = useAuth();
  if (!currentRole) return <Navigate to="/" replace />;
  if (currentRole !== role) {
    return <Navigate to={currentRole === 'investor' ? '/app/dashboard' : '/creator/pipeline'} replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Investor routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute role="investor">
              <InvestorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="portfolio-score" element={<PortfolioScore />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="company/:id" element={<CompanyPage />} />
        </Route>

        {/* Creator routes */}
        <Route
          path="/creator"
          element={
            <ProtectedRoute role="creator">
              <CreatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="pipeline" replace />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="coverage" element={<Coverage />} />
          <Route path="sector-models" element={<SectorModels />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <AppRoutes />
      </UIProvider>
    </AuthProvider>
  );
}
