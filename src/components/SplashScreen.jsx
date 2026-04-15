import { useState, useEffect } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('expand'), 1200);
    const t2 = setTimeout(() => setPhase('fade'), 2200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[300] bg-black flex items-center justify-center transition-opacity duration-500 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className={`flex flex-col items-center transition-all duration-700 ${phase === 'expand' ? 'scale-150 opacity-80' : 'scale-100 opacity-100'}`}>
        <div className="relative">
          <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-28 sm:h-28 mb-6">
            <defs>
              <linearGradient id="splash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <rect
              x="10" y="10" width="100" height="100" rx="24"
              fill="url(#splash-grad)"
              className={`transition-all duration-700 ${phase === 'logo' ? 'opacity-100' : 'opacity-90'}`}
            >
              <animate attributeName="rx" values="24;28;24" dur="1.5s" repeatCount="1" />
            </rect>
            <text
              x="60" y="78"
              textAnchor="middle"
              fill="white"
              fontFamily="Arial Black, sans-serif"
              fontSize="58"
              fontWeight="900"
              className={`transition-all duration-500 ${phase === 'logo' ? 'opacity-0' : 'opacity-100'}`}
              style={{ animationDelay: '0.3s' }}
            >
              B
            </text>
          </svg>

          <div className={`absolute -inset-8 rounded-full transition-all duration-700 ${phase === 'expand' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
            }}
          />
        </div>

        <h1
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-all duration-500 ${phase === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            BINGEFLIX
          </span>
        </h1>
      </div>
    </div>
  );
}
