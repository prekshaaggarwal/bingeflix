import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMood, MOODS } from '../context/MoodContext';
import SearchBar from './SearchBar';
import SurpriseMe from './SurpriseMe';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { selectedMood, setSelectedMood } = useMood();
  const [scrolled, setScrolled] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) setShowSurprise(true);
      if (e.key === 'h' && !e.ctrlKey && !e.metaKey) navigate('/');
      if (e.key === 'p' && !e.ctrlKey && !e.metaKey && isAuthenticated) navigate('/profile');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentMood = MOODS.find(m => m.id === selectedMood);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-[68px]">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent hover:from-red-500 hover:to-red-300 transition-all">
              BINGEFLIX
            </Link>
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <Link to="/profile" className="hover:text-white transition-colors">My Profile</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <SearchBar />

            <button
              onClick={() => setShowSurprise(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all text-sm border border-yellow-500/20 text-yellow-300 hover:text-yellow-200"
              title="Surprise Me (S)"
            >
              <span className="text-base">🎲</span>
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setMoodOpen(!moodOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm border border-white/10"
                >
                  <span>{currentMood?.icon}</span>
                  <span className="hidden sm:inline">{currentMood?.label}</span>
                  <svg className={`w-3 h-3 transition-transform ${moodOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {moodOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setMoodOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                      {MOODS.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => { setSelectedMood(mood.id); setMoodOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${selectedMood === mood.id ? 'bg-red-600/30 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                          <span className="text-lg">{mood.icon}</span>
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform"
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        My Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
              >
                Log In
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1"
              >
                <span className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                <span className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {mobileOpen && isAuthenticated && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 right-0 w-64 bg-[#141414] border-l border-white/5 h-full animate-fade-in">
            <div className="p-4 space-y-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                My Profile
              </Link>
              <button onClick={() => { setShowSurprise(true); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm text-yellow-300 hover:bg-white/10 transition-colors">
                🎲 Surprise Me
              </button>
              <hr className="border-white/5 my-2" />
              <div className="px-4 py-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Mood</p>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => { setSelectedMood(mood.id); setMobileOpen(false); }}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${selectedMood === mood.id ? 'bg-red-600/40 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {mood.icon} {mood.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-white/5 my-2" />
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      {showSurprise && <SurpriseMe onClose={() => setShowSurprise(false)} />}
    </>
  );
}
