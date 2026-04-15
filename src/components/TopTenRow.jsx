import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function TopTenRow({ movies }) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const top10 = movies.slice().sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 10);

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
        <span className="text-xl">🔥</span>
        Top 10 on Bingeflix Today
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
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {top10.map((movie, i) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex-shrink-0 flex items-end cursor-pointer group hover:scale-105 transition-transform duration-300"
            >
              <span
                className="text-[120px] sm:text-[150px] font-black leading-none select-none"
                style={{
                  WebkitTextStroke: '3px rgba(255,255,255,0.3)',
                  color: 'transparent',
                  marginRight: '-20px',
                  zIndex: 1,
                }}
              >
                {i + 1}
              </span>
              <div className="relative w-[120px] sm:w-[140px] rounded-lg overflow-hidden shadow-xl shadow-black/50">
                <img src={movie.image} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-xs font-bold leading-tight">{movie.title}</p>
                </div>
              </div>
            </div>
          ))}
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
