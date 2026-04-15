import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { useToast } from './Toast';

export default function PreviewModal({ movie, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { markWatched, toggleMyList, isInMyList } = useUserStats();
  const { addToast } = useToast();

  const inList = isAuthenticated && isInMyList(movie.id);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#181828] shadow-2xl shadow-black/80 border border-white/5 animate-scale-up">
        <div className="relative aspect-video">
          <img src={movie.banner || movie.image} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181828] via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  markWatched(movie);
                  addToast(`Now playing: ${movie.title}`, 'info');
                }
                navigate(`/movie/${movie.id}`);
                onClose();
              }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all group"
            >
              <svg className="w-7 h-7 ml-1 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="text-yellow-400 font-bold">★ {movie.rating}</span>
              <span className="text-gray-400">{movie.year}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{movie.title}</h2>
          </div>
        </div>

        <div className="p-6 pt-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-gray-300 border border-white/5">{movie.genre}</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-gray-300 border border-white/5">{movie.mood}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{movie.description}</p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  markWatched(movie);
                  addToast(`Now playing: ${movie.title}`, 'info');
                }
                navigate(`/movie/${movie.id}`);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
              Play
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  toggleMyList(movie);
                  addToast(inList ? `Removed from My List` : `Added to My List`, 'success');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${inList ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'}`}
              >
                {inList ? '✓ In My List' : '+ My List'}
              </button>
            )}
            <button
              onClick={() => { navigate(`/movie/${movie.id}`); onClose(); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/10 rounded-lg font-semibold text-sm hover:bg-white/20 transition-all"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
