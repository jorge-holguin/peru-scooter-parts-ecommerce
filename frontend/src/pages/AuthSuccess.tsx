// src/pages/AuthSuccess.tsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Obtener el usuario actual con el token
      // Aquí puedes llamar a tu endpoint /api/auth/me
      const fetchUser = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUser(data.user);
          navigate('/');
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
          navigate('/login');
        }
      };
      fetchUser();
    } else {
      navigate('/login');
    }
  }, [navigate, setUser]);

  return <div>Autenticando...</div>;
};

export default AuthSuccess;
