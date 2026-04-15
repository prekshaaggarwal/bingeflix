import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import movies from '../data/movies.json';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim().length > 0
    ? movies.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.toLowerCase().includes(query.toLowerCase()) ||
        m.mood.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSelect = (movie) => {
    setOpen(false);
    setQuery('');
    navigate(`/movie/${movie.id}`);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-sm text-gray-400 border border-white/5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-500 font-mono">Ctrl+K</kbd>
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 bg-[#1a1a2e] border border-white/20 rounded-lg px-3 py-1.5 w-56 sm:w-72">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies, genres, moods..."
          className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-500 hover:text-white">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {query.trim().length > 0 && (
        <div className="absolute top-full mt-2 right-0 w-72 sm:w-80 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {results.length > 0 ? results.map(movie => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
            >
              <img src={movie.image} alt="" className="w-10 h-14 rounded object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{movie.title}</p>
                <p className="text-xs text-gray-400">{movie.genre} · {movie.mood} · {movie.year}</p>
              </div>
            </button>
          )) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No results for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
