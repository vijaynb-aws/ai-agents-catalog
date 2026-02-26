import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
      {/* Background image */}
      <img
        src="/assets/generated/hero-banner.dim_1440x400.png"
        alt="AI Hub Hero Banner"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.13 0.005 240 / 0.3) 0%, oklch(0.13 0.005 240 / 0.6) 60%, oklch(0.13 0.005 240 / 0.95) 100%)',
        }}
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        <div className="mb-4 flex items-center gap-3">
          <img
            src="/assets/generated/ai-hub-logo.dim_256x256.png"
            alt="AI Hub Logo"
            className="w-12 h-12 rounded-xl object-contain"
            style={{ filter: 'drop-shadow(0 0 12px oklch(0.72 0.17 185 / 0.6))' }}
          />
          <h1
            className="font-display font-black tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, oklch(0.72 0.17 185), oklch(0.78 0.18 75))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI Hub
          </h1>
        </div>

        <p
          className="font-sans font-medium max-w-xl"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            color: 'oklch(0.85 0.02 240)',
            textShadow: '0 2px 8px oklch(0 0 0 / 0.5)',
          }}
        >
          Discover the best AI tools in one place — curated, categorized, and ready to use.
        </p>

        {/* Decorative dots */}
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block rounded-full animate-pulse-glow"
              style={{
                width: '6px',
                height: '6px',
                background:
                  i === 1
                    ? 'oklch(0.78 0.18 75)'
                    : 'oklch(0.72 0.17 185)',
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
