import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { useToast } from './Toast';
import PreviewModal from './PreviewModal';

const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" fill="%231a1a2e"><rect width="400" height="600"/><text x="200" y="300" text-anchor="middle" fill="%23444" font-size="40">🎬</text></svg>');

export default function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { markWatched, toggleMyList, isInMyList, isWatched } = useUserStats();
  const { addToast } = useToast();

  const inList = isAuthenticated && isInMyList(movie.id);
  const watched = isAuthenticated && isWatched(movie.id);

  return (
    <>
      <div
        className="relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowPreview(true)}
      >
        <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${hovered ? 'scale-110 z-30 shadow-2xl shadow-black/80' : 'scale-100'}`}>
          <img
            src={imgError ? FALLBACK : movie.image}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover bg-white/5"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2 left-2 flex items-center gap-1">
            {movie.maturity && (
              <span className={`px-1 py-0.5 text-[8px] font-bold border rounded ${movie.maturity === 'R' ? 'border-red-500/60 text-red-400' : 'border-white/30 text-white/70'}`}>
                {movie.maturity}
              </span>
            )}
          </div>
          {watched && (
            <div className="absolute top-2 right-2 bg-green-500/90 rounded-full p-1">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}

          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              <h3 className="text-sm font-bold leading-tight">{movie.title}</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <span className="text-yellow-400">★ {movie.rating}</span>
                <span>·</span>
                <span>{movie.year}</span>
                <span>·</span>
                <span>{movie.duration}m</span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-gray-200">{movie.genre}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-gray-200">{movie.mood}</span>
              </div>
              {isAuthenticated && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markWatched(movie);
                      addToast(`Now playing: ${movie.title}`, 'info');
                      navigate(`/movie/${movie.id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    Play
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMyList(movie);
                      addToast(inList ? `Removed from My List` : `Added to My List`, 'success');
                    }}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${inList ? 'border-green-400 text-green-400' : 'border-white/50 text-white hover:border-white'}`}
                  >
                    {inList ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(true);
                    }}
                    className="w-7 h-7 rounded-full border border-white/50 text-white hover:border-white flex items-center justify-center transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
        <PreviewModal movie={movie} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
