import React, { useState, useCallback } from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { UiProvider, useUi } from './context/UiContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';
import { AccessSimulatorModal } from './components/common/AccessSimulatorModal';
import { ArchitectureFlowModal } from './components/common/ArchitectureFlowModal';
import { LiveSessionsModal } from './components/common/LiveSessionsModal';
import { GuidedTourModal } from './components/common/GuidedTourModal';
import { SplashScreen } from './components/common/SplashScreen';
import { CursorTrail } from './components/common/CursorTrail';
import { ShortcutLayer } from './components/common/ShortcutLayer';
import { ShortcutHelp } from './components/common/ShortcutHelp';
import { LockdownModal } from './components/common/LockdownModal';
import { LockdownBanner } from './components/common/LockdownBanner';
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
  const { cursorEnabled, lockdown } = useUi();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLockdownOpen, setIsLockdownOpen] = useState(false);

  const openLockdown = useCallback(() => setIsLockdownOpen(true), []);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <CursorTrail enabled={cursorEnabled} />
        <ToastContainer />
      </>
    );
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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 antialiased font-sans">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

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
          onRequestLockdown={openLockdown}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar
          onNavigate={setCurrentPage}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onRequestLockdown={openLockdown}
        />

        {lockdown && <LockdownBanner onReview={openLockdown} />}

        <main className="flex-1 overflow-y-auto app-surface">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Keying on the page id replays the entrance animation on every
                navigation, which gives the single-page app a sense of place. */}
            <div key={currentPage} className="max-w-7xl mx-auto fade-up">
              {renderCurrentPage()}
            </div>
          </div>
        </main>
      </div>

      {/* Global layers */}
      <CommandPalette onNavigate={setCurrentPage} onRequestLockdown={openLockdown} />
      <AccessSimulatorModal />
      <ArchitectureFlowModal />
      <LiveSessionsModal />
      <GuidedTourModal onNavigate={setCurrentPage} />
      <ShortcutHelp />
      <LockdownModal isOpen={isLockdownOpen} onClose={() => setIsLockdownOpen(false)} />
      <ShortcutLayer onNavigate={setCurrentPage} onRequestLockdown={openLockdown} />
      <ToastContainer />
      <CursorTrail enabled={cursorEnabled} />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <UiProvider>
      <SecurityProvider>
        <MainAppContent />
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </SecurityProvider>
    </UiProvider>
  );
}
