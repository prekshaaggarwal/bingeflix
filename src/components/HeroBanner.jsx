import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { useToast } from './Toast';
import ShareButton from './ShareButton';

function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 5) return `Late night, ${name}`;
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  if (h < 21) return `Good evening, ${name}`;
  return `Late night, ${name}`;
}

export default function HeroBanner({ movies }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { markWatched, toggleMyList, isInMyList, isWatched } = useUserStats();
  const { addToast } = useToast();
  const [scrollY, setScrollY] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const movieList = movies?.length ? movies : [];
  const movie = movieList[activeIdx] || null;

  const goTo = useCallback((idx) => {
    if (idx === activeIdx) return;
    setFading(true);
    setTimeout(() => { setActiveIdx(idx); setFading(false); }, 300);
  }, [activeIdx]);

  useEffect(() => {
    if (movieList.length <= 1) return;
    const interval = setInterval(() => {
      goTo((activeIdx + 1) % movieList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeIdx, movieList.length, goTo]);

  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  if (!movie) return null;

  const inList = isAuthenticated && isInMyList(movie.id);
  const watched = isAuthenticated && isWatched(movie.id);
  const parallax = Math.min(scrollY * 0.4, 200);
  const opacity = Math.max(1 - scrollY / 600, 0);

  return (
    <div className="relative w-full h-[75vh] sm:h-[85vh] overflow-hidden">
      <div className="absolute inset-0" style={{ transform: `translateY(${parallax}px)` }}>
        <img
          src={movie.banner}
          alt={movie.title}
          className={`w-full h-full object-cover scale-110 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent" />
      </div>

      <div
        className="relative h-full flex items-end pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto"
        style={{ opacity }}
      >
        <div className={`max-w-2xl space-y-4 sm:space-y-6 transition-all duration-500 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {isAuthenticated && user?.name && (
            <p className="text-sm sm:text-base text-gray-300 font-medium">
              {getGreeting(user.name)} 👋
            </p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-red-600 rounded text-xs font-bold tracking-wider">FEATURED</span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-300">{movie.genre}</span>
            <span className="text-gray-500">·</span>
            <span className="text-yellow-400">★ {movie.rating}</span>
            {movie.maturity && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold border border-white/30 rounded text-white/70">
                {movie.maturity}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            {movie.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 line-clamp-3 max-w-xl leading-relaxed">
            {movie.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  markWatched(movie);
                  addToast(`Now playing: ${movie.title}`, 'info');
                }
                navigate(`/movie/${movie.id}`);
              }}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-all hover:scale-105 text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
              {watched ? 'Watch Again' : 'Play'}
            </button>
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-md hover:bg-white/30 transition-all text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              More Info
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  toggleMyList(movie);
                  addToast(inList ? 'Removed from My List' : 'Added to My List', 'success');
                }}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${inList ? 'border-green-400 bg-green-400/20 text-green-400' : 'border-white/40 text-white hover:border-white'}`}
              >
                {inList ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                )}
              </button>
            )}
            <ShareButton movie={movie} />
          </div>

          {movieList.length > 1 && (
            <div className="flex items-center gap-2 pt-2">
              {movieList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all rounded-full ${i === activeIdx ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
