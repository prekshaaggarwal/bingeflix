import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/': 'Bingeflix — Home',
  '/login': 'Bingeflix — Log In',
  '/profile': 'Bingeflix — My Profile',
};

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/movie/')) {
      document.title = 'Bingeflix — Now Watching';
    } else {
      document.title = TITLES[pathname] || 'Bingeflix';
    }
  }, [pathname]);

  return null;
}
