import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-8xl sm:text-9xl font-black bg-gradient-to-b from-red-500 to-red-900 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Lost your way?</h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-all hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
          Bingeflix Home
        </Link>
        <div className="mt-12 text-6xl opacity-10 select-none">🎬</div>
      </div>
    </div>
  );
}
