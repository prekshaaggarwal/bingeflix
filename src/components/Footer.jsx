export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-sm text-gray-400 mb-4 font-medium">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-gray-300 transition-colors">Home</a></li>
              <li><a href="/login" className="hover:text-gray-300 transition-colors">Log In</a></li>
              <li><a href="/profile" className="hover:text-gray-300 transition-colors">My Profile</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm text-gray-400 mb-4 font-medium">Genres</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Sci-Fi</li>
              <li>Action</li>
              <li>Romance</li>
              <li>Horror</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm text-gray-400 mb-4 font-medium">Moods</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Thrilling</li>
              <li>Feel-Good</li>
              <li>Mind-Bending</li>
              <li>Inspiring</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm text-gray-400 mb-4 font-medium">About</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Help Center</li>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Cookie Preferences</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            BINGEFLIX
          </div>
          <p className="text-xs text-gray-600">
            Built with React + Tailwind CSS. Not affiliated with Netflix.
          </p>
        </div>
      </div>
    </footer>
  );
}
