import { useMemo, useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import TopTenRow from '../components/TopTenRow';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import Footer from '../components/Footer';
import { SkeletonRow } from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { useUserStats } from '../context/UserStatsContext';
import { useBrowseHistory } from '../context/BrowseHistoryContext';
import movies from '../data/movies.json';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { selectedMood } = useMood();
  const { stats, getFavoriteGenre } = useUserStats();
  const { history } = useBrowseHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const featuredMovies = useMemo(() => {
    const top = movies.slice().sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5);
    return top;
  }, []);

  const moodFiltered = useMemo(() => {
    if (selectedMood === 'all') return movies;
    return movies.filter(m => m.mood === selectedMood);
  }, [selectedMood]);

  const genreGroups = useMemo(() => {
    const groups = {};
    moodFiltered.forEach(m => {
      if (!groups[m.genre]) groups[m.genre] = [];
      groups[m.genre].push(m);
    });
    return groups;
  }, [moodFiltered]);

  const favoriteGenre = getFavoriteGenre();

  const lastWatched = stats.watched.length > 0 ? stats.watched[stats.watched.length - 1] : null;
  const becauseYouWatched = useMemo(() => {
    if (!lastWatched) return [];
    return movies.filter(m => m.id !== lastWatched.id && (m.genre === lastWatched.genre || m.mood === lastWatched.mood));
  }, [lastWatched]);

  const trendingForYou = useMemo(() => {
    if (!favoriteGenre) return [];
    const watchedIds = new Set(stats.watched.map(m => m.id));
    return movies.filter(m => m.genre === favoriteGenre && !watchedIds.has(m.id));
  }, [favoriteGenre, stats.watched]);

  return (
    <div className="min-h-screen">
      <HeroBanner movies={featuredMovies} />

      <div className="-mt-20 relative z-10 space-y-2">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            {isAuthenticated && selectedMood !== 'all' && moodFiltered.length > 0 && (
              <MovieRow
                title="Recommended for your mood"
                icon="✨"
                movies={moodFiltered}
              />
            )}

            {isAuthenticated && <ContinueWatchingRow />}

            {isAuthenticated && stats.myList.length > 0 && (
              <MovieRow title="My List" icon="📌" movies={stats.myList} />
            )}

            {isAuthenticated && becauseYouWatched.length > 0 && lastWatched && (
              <MovieRow
                title={`Because you watched ${lastWatched.title}`}
                icon="🎯"
                movies={becauseYouWatched}
              />
            )}

            {isAuthenticated && trendingForYou.length > 0 && (
              <MovieRow title="Trending for You" icon="📈" movies={trendingForYou} />
            )}

            {isAuthenticated && history.length > 0 && (
              <MovieRow title="Recently Browsed" icon="👀" movies={history} />
            )}

            <TopTenRow movies={moodFiltered} />

            <MovieRow title="Popular on Bingeflix" icon="🏆" movies={moodFiltered.slice().sort((a, b) => b.rating - a.rating)} />

            <MovieRow title="New Releases" icon="🆕" movies={moodFiltered.filter(m => m.year >= 2025)} />

            {Object.entries(genreGroups).map(([genre, genreMovies]) => (
              <MovieRow key={genre} title={genre} movies={genreMovies} />
            ))}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
