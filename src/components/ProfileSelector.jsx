import { useState } from 'react';

const PROFILE_COLORS = [
  'from-red-500 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-yellow-500 to-amber-500',
];

export default function ProfileSelector({ user, onSelect }) {
  const [hovered, setHovered] = useState(null);

  const profiles = [
    { name: user.name, color: PROFILE_COLORS[0] },
    { name: 'Kids', color: PROFILE_COLORS[2] },
    { name: 'Add Profile', color: null, isAdd: true },
  ];

  return (
    <div className="fixed inset-0 z-[250] bg-[#141414] flex flex-col items-center justify-center animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10">Who's watching?</h1>
      <div className="flex items-center gap-6 sm:gap-8">
        {profiles.map((p, i) => (
          <button
            key={i}
            onClick={() => !p.isAdd && onSelect(p.name)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex flex-col items-center gap-3 group"
          >
            <div
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-extrabold transition-all duration-200 ${
                hovered === i ? 'ring-2 ring-white scale-105' : ''
              } ${
                p.isAdd
                  ? 'bg-white/10 border-2 border-dashed border-white/20 text-white/40 hover:text-white/70 hover:border-white/40'
                  : `bg-gradient-to-br ${p.color}`
              }`}
            >
              {p.isAdd ? (
                <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              ) : (
                p.name[0].toUpperCase()
              )}
            </div>
            <span className={`text-sm transition-colors ${hovered === i ? 'text-white' : 'text-gray-400'}`}>
              {p.name}
            </span>
          </button>
        ))}
      </div>
      <button className="mt-12 px-8 py-2 border border-white/30 text-white/60 rounded text-sm hover:text-white hover:border-white transition-all">
        Manage Profiles
      </button>
    </div>
  );
}
