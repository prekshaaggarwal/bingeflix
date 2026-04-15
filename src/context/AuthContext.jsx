import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('bingeflix_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('bingeflix_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('bingeflix_users', JSON.stringify(users));
    const sessionUser = { id: newUser.id, name, email };
    localStorage.setItem('bingeflix_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('bingeflix_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password' };
    const sessionUser = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem('bingeflix_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('bingeflix_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
