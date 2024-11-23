import React, { createContext, useState, useContext } from 'react';
import { User, AuthState } from '../types/auth';

// Exportar el contexto
export const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token: string) => {
    try {
      localStorage.setItem('token', token);
      
      // Simular decodificación de token JWT
      const decodedUser: User = {
        id: '1',
        name: 'Test User',
        role: 'operator',
      };
      
      setUser(decodedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Crear el valor del contexto
  const value: AuthState = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
