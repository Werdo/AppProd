import React from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = storage.getToken();
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      storage.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user: userData } = response.data;
    storage.setToken(token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    storage.removeToken();
    setUser(null);
  };

  const value = React.useMemo(() => ({
    user,
    loading,
    login,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};