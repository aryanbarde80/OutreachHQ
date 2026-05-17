import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { useAuth } from './context/AuthContext';
import { AccountsPage } from './pages/AccountsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { LoginPage } from './pages/LoginPage';
import { LogsPage } from './pages/LogsPage';
import { ResumesPage } from './pages/ResumesPage';

function ProtectedApp() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/resumes" element={<ResumesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  const { token } = useAuth();

  return token ? (
    <ProtectedApp />
  ) : (
    <Routes>
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

