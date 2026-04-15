import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import movies from '../data/movies.json';

export default function SurpriseMe({ onClose }) {
  const [phase, setPhase] = useState('spinning');
  const [displayIdx, setDisplayIdx] = useState(0);
  const [result, setResult] = useState(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const runSpin = useCallback(() => {
    setPhase('spinning');
    setResult(null);
    const target = movies[Math.floor(Math.random() * movies.length)];
    let speed = 60;
    let elapsed = 0;
    const maxDuration = 2500;

    clearInterval(intervalRef.current);

    const tick = () => {
      setDisplayIdx(i => (i + 1) % movies.length);
      elapsed += speed;

      if (elapsed >= maxDuration) {
        clearInterval(intervalRef.current);
        setResult(target);
        setPhase('revealed');
        return;
      }

      speed = Math.min(speed + 8, 300);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, speed);
    };

    intervalRef.current = setInterval(tick, speed);
  }, []);

  useEffect(() => {
    runSpin();
    return () => clearInterval(intervalRef.current);
  }, [runSpin]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const current = phase === 'revealed' ? result : movies[displayIdx];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative max-w-sm w-full animate-scale-up">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
            {phase === 'spinning' ? 'Finding your perfect movie...' : 'You should watch'}
          </p>
          {phase === 'spinning' && (
            <div className="flex justify-center gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-2xl overflow-hidden bg-[#1a1a2e] border shadow-2xl shadow-black/60 transition-all duration-500 ${phase === 'revealed' ? 'border-yellow-500/40 ring-2 ring-yellow-500/20' : 'border-white/10'}`}>
          <div className="relative aspect-video overflow-hidden">
            <img
              src={current?.banner || current?.image}
              alt=""
              className={`w-full h-full object-cover transition-all duration-200 ${phase === 'spinning' ? 'blur-[2px] scale-105' : 'blur-0 scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
            {phase === 'revealed' && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-yellow-500/90 text-black text-[10px] font-black uppercase tracking-wider rounded-md animate-slide-up">
                Perfect Match
              </div>
            )}
          </div>

          <div className="p-5 space-y-3">
            <h3 className={`text-xl font-extrabold transition-all ${phase === 'spinning' ? 'blur-[3px]' : 'blur-0'}`}>
              {current?.title}
            </h3>
            {phase === 'revealed' && (
              <div className="animate-fade-in space-y-3">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-yellow-400 font-bold">★ {result.rating}</span>
                  <span className="text-gray-400">{result.year}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400">{result.duration}m</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{result.genre}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{result.mood}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{result.description}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { onClose(); navigate(`/movie/${result.id}`); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    Watch Now
                  </button>
                  <button
                    onClick={() => runSpin()}
                    className="px-4 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all text-sm border border-white/10"
                  >
                    Spin Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
