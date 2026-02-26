import React, { useState } from 'react';
import { LogIn, LogOut, Loader2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

const LoginButton: React.FC = () => {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [showPrincipal, setShowPrincipal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const truncatePrincipal = (principal: string) => {
    if (principal.length <= 14) return principal;
    return `${principal.slice(0, 8)}…${principal.slice(-4)}`;
  };

  const handleCopy = async (principal: string) => {
    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      setShowPrincipal(false);
      // Clear all cached queries so admin state and user data reset on logout
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isAuthenticated) {
    const principal = identity.getPrincipal().toString();
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2">
          {/* Truncated principal + expand toggle */}
          <button
            onClick={() => setShowPrincipal((v) => !v)}
            className="hidden sm:flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg transition-all duration-150"
            style={{
              background: 'oklch(0.18 0.01 240)',
              color: 'oklch(0.72 0.17 185)',
              border: '1px solid oklch(0.72 0.17 185 / 0.25)',
            }}
            title="Click to show/hide your full principal ID"
          >
            {truncatePrincipal(principal)}
            {showPrincipal ? (
              <ChevronUp className="w-3 h-3 ml-0.5 opacity-70" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            )}
          </button>

          <button
            onClick={handleAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: 'oklch(0.18 0.01 240)',
              color: 'oklch(0.75 0.02 240)',
              border: '1px solid oklch(1 0 0 / 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'oklch(0.65 0.22 25 / 0.4)';
              e.currentTarget.style.color = 'oklch(0.65 0.22 25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'oklch(1 0 0 / 0.1)';
              e.currentTarget.style.color = 'oklch(0.75 0.02 240)';
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

        {/* Expandable full principal panel */}
        {showPrincipal && (
          <div
            className="w-full max-w-xs sm:max-w-sm rounded-xl p-3 text-xs"
            style={{
              background: 'oklch(0.16 0.01 240)',
              border: '1px solid oklch(0.72 0.17 185 / 0.3)',
              boxShadow: '0 4px 24px oklch(0 0 0 / 0.4)',
            }}
          >
            <p
              className="mb-1.5 font-semibold text-[10px] uppercase tracking-widest"
              style={{ color: 'oklch(0.55 0.02 240)' }}
            >
              Your Principal ID
            </p>
            <div className="flex items-start gap-2">
              <span
                className="font-mono break-all leading-relaxed flex-1"
                style={{ color: 'oklch(0.85 0.01 240)' }}
              >
                {principal}
              </span>
              <button
                onClick={() => handleCopy(principal)}
                className="shrink-0 p-1.5 rounded-lg transition-all duration-150 mt-0.5"
                style={{
                  background: copied
                    ? 'oklch(0.72 0.17 185 / 0.15)'
                    : 'oklch(0.22 0.01 240)',
                  color: copied ? 'oklch(0.72 0.17 185)' : 'oklch(0.55 0.02 240)',
                  border: '1px solid oklch(0.72 0.17 185 / 0.2)',
                }}
                title="Copy principal to clipboard"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p
              className="mt-2 text-[10px] leading-relaxed"
              style={{ color: 'oklch(0.45 0.02 240)' }}
            >
              Share this ID with the app admin to get admin access.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60"
      style={{
        background: 'linear-gradient(135deg, oklch(0.72 0.17 185), oklch(0.68 0.16 185))',
        color: 'oklch(0.1 0.005 240)',
        boxShadow: '0 0 16px oklch(0.72 0.17 185 / 0.25)',
      }}
      onMouseEnter={(e) => {
        if (!isLoggingIn) {
          e.currentTarget.style.boxShadow = '0 0 24px oklch(0.72 0.17 185 / 0.45)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 16px oklch(0.72 0.17 185 / 0.25)';
      }}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Logging in…
        </>
      ) : (
        <>
          <LogIn className="w-3.5 h-3.5" />
          Login
        </>
      )}
    </button>
  );
};

export default LoginButton;
