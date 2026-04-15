import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { useBrowseHistory } from '../context/BrowseHistoryContext';
import { useToast } from '../components/Toast';
import StarRating from '../components/StarRating';
import ShareButton from '../components/ShareButton';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import movies from '../data/movies.json';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { markWatched, toggleMyList, isInMyList, isWatched } = useUserStats();
  const { addToHistory } = useBrowseHistory();
  const { addToast } = useToast();

  const movie = movies.find(m => m.id === Number(id));

  useEffect(() => {
    if (movie) {
      addToHistory(movie);
      document.title = `${movie.title} — Bingeflix`;
    }
  }, [movie, addToHistory]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const inList = isAuthenticated && isInMyList(movie.id);
  const watched = isAuthenticated && isWatched(movie.id);
  const similar = movies.filter(m => m.id !== movie.id && (m.genre === movie.genre || m.mood === movie.mood)).slice(0, 12);

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[60vh] sm:h-[70vh]">
        <img src={movie.banner} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 sm:left-8 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="relative -mt-40 z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-20 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 hidden md:block">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-64 rounded-xl shadow-2xl shadow-black/50 border border-white/5"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
                <span className="text-yellow-400 font-bold text-lg">★ {movie.rating}</span>
                <span className="text-gray-400">{movie.year}</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                {watched && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">Watched</span>}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3">{movie.title}</h1>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300 border border-white/5">{movie.genre}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300 border border-white/5">{movie.mood}</span>
              </div>
              <div className="flex items-center gap-3">
                <StarRating movieId={movie.id} size="lg" />
                <span className="text-xs text-gray-500">Rate this movie</span>
              </div>
            </div>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    markWatched(movie);
                    addToast(`Now playing: ${movie.title}`, 'info');
                  }
                }}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                {watched ? 'Watch Again' : 'Play'}
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    toggleMyList(movie);
                    addToast(inList ? 'Removed from My List' : 'Added to My List', 'success');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${inList ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'}`}
                >
                  {inList ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      In My List
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add to My List
                    </>
                  )}
                </button>
              )}
              <ShareButton movie={movie} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 max-w-lg">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Genre</p>
                <p className="text-sm font-medium mt-1">{movie.genre}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Mood</p>
                <p className="text-sm font-medium mt-1">{movie.mood}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Duration</p>
                <p className="text-sm font-medium mt-1">{movie.duration} min</p>
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <MovieRow title="More Like This" icon="🎬" movies={similar} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
