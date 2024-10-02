import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Definición de la interfaz para el usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Definición de las props del contexto de autenticación
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Definición de las props para el AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto con un valor predeterminado
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  setUser: () => {},
});

// Definición del componente AuthProvider con las props de tipo AuthProviderProps
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Usar la variable de entorno para la URL de la API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('No se pudo iniciar sesión. Por favor, revisa tus credenciales.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Obtener el usuario actual con el token
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
          logout();
        }
      };
      fetchUser();
    }
  }, [API_URL]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
