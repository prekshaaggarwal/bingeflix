import { createContext, useContext, useState } from 'react';

const MoodContext = createContext();

export const MOODS = [
  { id: 'all', label: 'All Vibes', icon: '🎬' },
  { id: 'Thrilling', label: 'Thrilling', icon: '⚡' },
  { id: 'Romantic', label: 'Romantic', icon: '💕' },
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: '🧠' },
  { id: 'Feel-Good', label: 'Feel-Good', icon: '😊' },
  { id: 'Dark', label: 'Dark', icon: '🌑' },
  { id: 'Inspiring', label: 'Inspiring', icon: '✨' },
  { id: 'Melancholic', label: 'Melancholic', icon: '🌧️' },
];

export function MoodProvider({ children }) {
  const [selectedMood, setSelectedMood] = useState('all');

  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export const useMood = () => useContext(MoodContext);
