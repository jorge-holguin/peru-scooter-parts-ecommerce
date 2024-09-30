import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate(); // Reemplazar useHistory por useNavigate
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Aquí puedes implementar una función para obtener el usuario actual
      // utilizando el token y actualizar el estado 'user'
      navigate('/'); // Reemplazar history.push('/') por navigate('/')
    } else {
      navigate('/login'); // Reemplazar history.push('/login') por navigate('/login')
    }
  }, [navigate, setUser]);

  return <div>Autenticando...</div>;
};

export default AuthSuccess;
