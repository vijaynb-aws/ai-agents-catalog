import React from 'react';
import CatalogPage from './pages/CatalogPage';
import LoginButton from './components/LoginButton';

const App: React.FC = () => {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'ai-hub'
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.13 0.005 240)' }}>
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14"
        style={{
          background: 'oklch(0.13 0.005 240 / 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid oklch(1 0 0 / 0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/generated/ai-hub-logo.dim_256x256.png"
            alt="AI Hub"
            className="w-7 h-7 rounded-lg object-cover"
          />
          <span
            className="font-display font-bold text-base tracking-tight"
            style={{ color: 'oklch(0.95 0.01 240)' }}
          >
            AI Hub
          </span>
        </div>

        {/* Login / Logout */}
        <LoginButton />
      </header>

      {/* Main content */}
      <main className="flex-1">
        <CatalogPage />
      </main>

      {/* Footer */}
      <footer
        className="py-6 px-4 sm:px-6 lg:px-8 text-center text-sm"
        style={{
          borderTop: '1px solid oklch(1 0 0 / 0.06)',
          color: 'oklch(0.45 0.02 240)',
        }}
      >
        <p>
          © {year} AI Hub.{' '}
          Built with{' '}
          <span style={{ color: 'oklch(0.72 0.17 185)' }}>♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'oklch(0.72 0.17 185)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'oklch(0.85 0.18 185)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'oklch(0.72 0.17 185)';
            }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
