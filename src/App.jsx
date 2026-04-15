import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MoodProvider } from './context/MoodContext';
import { UserStatsProvider } from './context/UserStatsContext';
import { BrowseHistoryProvider } from './context/BrowseHistoryContext';
import { ToastProvider } from './components/Toast';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import PageTitle from './components/PageTitle';
import BackToTop from './components/BackToTop';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <HashRouter>
      <AuthProvider>
        <MoodProvider>
          <UserStatsProvider>
            <BrowseHistoryProvider>
              <ToastProvider>
                {showSplash && <SplashScreen onDone={handleSplashDone} />}
                <div className={`min-h-screen bg-[#141414] text-white ${showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
                  <ScrollProgress />
                  <ScrollToTop />
                  <PageTitle />
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BackToTop />
                  <KeyboardShortcuts />
                </div>
              </ToastProvider>
            </BrowseHistoryProvider>
          </UserStatsProvider>
        </MoodProvider>
      </AuthProvider>
    </HashRouter>
  );
}
