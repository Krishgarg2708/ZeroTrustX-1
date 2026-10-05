import React, { useState } from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';
import { AccessSimulatorModal } from './components/common/AccessSimulatorModal';
import { ArchitectureFlowModal } from './components/common/ArchitectureFlowModal';
import { LiveSessionsModal } from './components/common/LiveSessionsModal';
import { GuidedTourModal } from './components/common/GuidedTourModal';
import { SplashScreen } from './components/common/SplashScreen';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { AccessRequestsPage } from './pages/AccessRequestsPage';
import { RbacPage } from './pages/RbacPage';
import { MfaPage } from './pages/MfaPage';
import { DevicesPage } from './pages/DevicesPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { RiskAnalyticsPage } from './pages/RiskAnalyticsPage';
import { SecurityEventsPage } from './pages/SecurityEventsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { AiCopilotPage } from './pages/AiCopilotPage';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useSecurity();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If not logged in, show enterprise login screen
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'copilot':
        return <AiCopilotPage />;
      case 'users':
        return <UsersPage />;
      case 'requests':
        return <AccessRequestsPage />;
      case 'roles':
        return <RbacPage />;
      case 'mfa':
        return <MfaPage />;
      case 'devices':
        return <DevicesPage />;
      case 'policies':
        return <PoliciesPage />;
      case 'risk':
        return <RiskAnalyticsPage />;
      case 'events':
        return <SecurityEventsPage />;
      case 'audit':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080B11] text-slate-100 antialiased font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Responsive Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-30' : 'hidden'
        } md:static md:block shrink-0`}
      >
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar
          onNavigate={setCurrentPage}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 cyber-dots">
          <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette onNavigate={setCurrentPage} />
      <AccessSimulatorModal />
      <ArchitectureFlowModal />
      <LiveSessionsModal />
      <GuidedTourModal onNavigate={setCurrentPage} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SecurityProvider>
      <MainAppContent />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </SecurityProvider>
  );
}
