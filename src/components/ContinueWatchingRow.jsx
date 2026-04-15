import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../context/UserStatsContext';

export default function ContinueWatchingRow() {
  const { stats, markWatched } = useUserStats();
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const recentlyWatched = [...stats.watched].reverse().slice(0, 10);
  if (recentlyWatched.length === 0) return null;

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <div className="mb-10 group/row">
      <h2 className="text-lg sm:text-xl font-bold mb-3 px-4 sm:px-6 lg:px-12 flex items-center gap-2">
        <span className="text-xl">▶️</span>
        Continue Watching
      </h2>
      <div className="relative">
        {canScrollLeft && (
          <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-14 bg-gradient-to-r from-[#141414] to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recentlyWatched.map((movie) => {
            const fakeProgress = ((movie.id * 37 + 20) % 70) + 15;
            return (
              <div
                key={movie.id}
                onClick={() => { markWatched(movie); navigate(`/movie/${movie.id}`); }}
                className="flex-shrink-0 w-[260px] sm:w-[300px] cursor-pointer group rounded-lg overflow-hidden bg-[#1a1a2e] hover:ring-1 hover:ring-white/20 transition-all hover:scale-[1.02]"
              >
                <div className="relative">
                  <img src={movie.banner || movie.image} alt={movie.title} className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div className="h-full bg-red-600 rounded-r" style={{ width: `${fakeProgress}%` }} />
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold truncate">{movie.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{movie.genre} · {fakeProgress}% watched</p>
                </div>
              </div>
            );
          })}
        </div>
        {canScrollRight && (
          <button onClick={() => scroll('right')} className="absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-14 bg-gradient-to-l from-[#141414] to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
