import { useState, useEffect } from 'react';

const shortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Open search' },
  { keys: ['Esc'], action: 'Close modal / search' },
  { keys: ['?'], action: 'Show this help' },
  { keys: ['H'], action: 'Go home' },
  { keys: ['P'], action: 'Go to profile' },
  { keys: ['S'], action: 'Surprise me (random movie)' },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>
            Keyboard Shortcuts
          </h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map(s => (
            <div key={s.action} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map(k => (
                  <kbd key={k} className="px-2 py-1 text-xs font-mono bg-white/10 border border-white/10 rounded text-gray-300 min-w-[28px] text-center">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 mt-6 text-center">Press ? to toggle this panel</p>
      </div>
    </div>
  );
}
