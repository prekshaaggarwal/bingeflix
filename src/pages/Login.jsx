import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSelector from '../components/ProfileSelector';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      if (!name.trim()) { setError('Name is required'); return; }
      if (!email.trim()) { setError('Email is required'); return; }
      if (password.length < 4) { setError('Password must be at least 4 characters'); return; }
      const result = signup(name.trim(), email.trim().toLowerCase(), password);
      if (result.success) setShowProfilePicker(true);
      else setError(result.message);
    } else {
      if (!email.trim()) { setError('Email is required'); return; }
      if (!password) { setError('Password is required'); return; }
      const result = login(email.trim().toLowerCase(), password);
      if (result.success) setShowProfilePicker(true);
      else setError(result.message);
    }
  };

  if (showProfilePicker && user) {
    return <ProfileSelector user={user} onSelect={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#141414]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(https://picsum.photos/seed/bingeflix-login/1920/1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative w-full max-w-md animate-fade-in">
        <Link to="/" className="block text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-8">
          BINGEFLIX
        </Link>

        <div className="bg-black/75 backdrop-blur-xl rounded-xl p-8 sm:p-10 border border-white/5">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {isSignup ? 'Create Account' : 'Log In'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {isSignup ? 'Join Bingeflix and start streaming' : 'Welcome back to Bingeflix'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98]"
            >
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isSignup ? (
              <>Already have an account?{' '}
                <button onClick={() => { setIsSignup(false); setError(''); }} className="text-white hover:text-red-400 font-medium transition-colors">
                  Log In
                </button>
              </>
            ) : (
              <>New to Bingeflix?{' '}
                <button onClick={() => { setIsSignup(true); setError(''); }} className="text-white hover:text-red-400 font-medium transition-colors">
                  Sign Up Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
