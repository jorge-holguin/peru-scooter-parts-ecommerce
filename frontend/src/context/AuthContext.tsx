import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Definición de la interfaz para el usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Agrega otros campos si es necesario
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
  children: ReactNode; // Definir children como ReactNode
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

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
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
          const response = await axios.get('http://localhost:5000/api/auth/me', {
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
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
