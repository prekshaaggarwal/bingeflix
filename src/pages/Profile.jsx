import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import MovieRow from '../components/MovieRow';
import GenreRadar from '../components/GenreRadar';
import Confetti from '../components/Confetti';

export default function Profile() {
  const { user } = useAuth();
  const { stats, getFavoriteGenre, getBadges } = useUserStats();
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevBadgeCount, setPrevBadgeCount] = useState(null);

  const favoriteGenre = getFavoriteGenre();
  const badges = getBadges();
  const hours = Math.floor(stats.totalWatchTime / 60);
  const minutes = stats.totalWatchTime % 60;

  useEffect(() => {
    if (prevBadgeCount !== null && badges.length > prevBadgeCount) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
    setPrevBadgeCount(badges.length);
  }, [badges.length]);

  const streak = useMemo(() => {
    if (stats.watched.length === 0) return 0;
    const days = new Set();
    stats.watched.forEach(m => {
      days.add(new Date(m.watchedAt).toDateString());
    });
    const sorted = [...days].sort((a, b) => new Date(b) - new Date(a));
    let count = 0;
    const today = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (sorted[i] === expected.toDateString()) count++;
      else break;
    }
    return count;
  }, [stats.watched]);

  const allBadges = [
    { id: 'binger', name: 'Weekend Binger', icon: '🍿', desc: 'Watch 5+ movies', needed: 5, type: 'movies' },
    { id: 'addict', name: 'Screen Addict', icon: '📺', desc: 'Watch 10+ movies', needed: 10, type: 'movies' },
    { id: 'nightowl', name: 'Night Owl', icon: '🦉', desc: 'Watch late at night', needed: null, type: 'special' },
    { id: 'genremaster', name: 'Genre Master', icon: '🎭', desc: '3+ in one genre', needed: 3, type: 'genre' },
    { id: 'marathon', name: 'Marathon Runner', icon: '🏃', desc: '10+ hours watched', needed: 600, type: 'time' },
  ];

  const earnedIds = new Set(badges.map(b => b.id));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <Confetti active={showConfetti} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-lg shadow-red-500/20">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20">
            <span className="text-2xl animate-pulse">🔥</span>
            <div>
              <p className="text-lg font-extrabold text-orange-400">{streak} Day Streak</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Keep watching daily!</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12">
        <AnimatedStatCard
          icon="🎬"
          label="Movies Watched"
          value={stats.watched.length}
          gradient="from-blue-500/20 to-purple-500/20"
          border="border-blue-500/20"
        />
        <AnimatedStatCard
          icon="⏱️"
          label="Watch Time"
          value={hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          gradient="from-green-500/20 to-emerald-500/20"
          border="border-green-500/20"
        />
        <AnimatedStatCard
          icon="🎭"
          label="Favorite Genre"
          value={favoriteGenre || '—'}
          gradient="from-orange-500/20 to-red-500/20"
          border="border-orange-500/20"
        />
        <AnimatedStatCard
          icon="🏆"
          label="Badges Earned"
          value={`${badges.length}/${allBadges.length}`}
          gradient="from-yellow-500/20 to-amber-500/20"
          border="border-yellow-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div>
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span>🏅</span> Achievement Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allBadges.map(badge => {
              const earned = earnedIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`relative p-5 rounded-xl border transition-all ${earned ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/5' : 'bg-white/[0.02] border-white/5 opacity-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl sm:text-4xl ${earned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{badge.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{badge.desc}</p>
                    </div>
                  </div>
                  {earned && (
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span>📊</span> Genre Radar
          </h2>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <GenreRadar watched={stats.watched} />
          </div>
        </div>
      </div>

      {stats.watched.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span>📜</span> Watch History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...stats.watched].reverse().map(movie => (
              <div key={movie.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group">
                <img src={movie.image} alt={movie.title} className="w-12 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{movie.genre} · {movie.duration}m</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {new Date(movie.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.myList.length > 0 && (
        <MovieRow title="My List" icon="📌" movies={stats.myList} />
      )}
    </div>
  );
}

function AnimatedStatCard({ icon, label, value, gradient, border }) {
  const [displayed, setDisplayed] = useState(0);
  const numValue = typeof value === 'number' ? value : null;

  useEffect(() => {
    if (numValue === null || numValue === 0) return;
    let start = 0;
    const step = Math.max(1, Math.floor(numValue / 20));
    const interval = setInterval(() => {
      start += step;
      if (start >= numValue) { setDisplayed(numValue); clearInterval(interval); }
      else setDisplayed(start);
    }, 40);
    return () => clearInterval(interval);
  }, [numValue]);

  return (
    <div className={`p-4 sm:p-5 rounded-xl bg-gradient-to-br ${gradient} border ${border} backdrop-blur-sm hover:scale-[1.02] transition-transform`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xl sm:text-2xl font-extrabold">
        {numValue !== null ? displayed : value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
