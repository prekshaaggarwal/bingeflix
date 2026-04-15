import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const STORAGE_KEY = 'bingeflix_ratings';

function getRatings(userId) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return all[userId] || {};
}

function saveRating(userId, movieId, rating) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!all[userId]) all[userId] = {};
  all[userId][movieId] = rating;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function useRating(movieId) {
  const { user } = useAuth();
  if (!user) return { rating: 0, setRating: () => {} };
  const ratings = getRatings(user.id);
  return {
    rating: ratings[movieId] || 0,
    setRating: (r) => saveRating(user.id, movieId, r),
  };
}

export default function StarRating({ movieId, size = 'md' }) {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [hovered, setHovered] = useState(0);
  const [rating, setLocalRating] = useState(() => {
    if (!user) return 0;
    return getRatings(user.id)[movieId] || 0;
  });

  if (!isAuthenticated) return null;

  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  const handleRate = (star) => {
    const newRating = star === rating ? 0 : star;
    setLocalRating(newRating);
    saveRating(user.id, movieId, newRating);
    if (newRating > 0) addToast(`Rated ${newRating} star${newRating > 1 ? 's' : ''}`, 'success');
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={(e) => { e.stopPropagation(); handleRate(star); }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125"
        >
          <svg
            className={`${sizeClass} transition-colors`}
            fill={(hovered || rating) >= star ? '#facc15' : 'none'}
            stroke={(hovered || rating) >= star ? '#facc15' : '#6b7280'}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
      {rating > 0 && <span className="text-xs text-gray-500 ml-1">({rating})</span>}
    </div>
  );
}
