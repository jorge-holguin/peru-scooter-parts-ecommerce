// frontend/src/pages/AuthSuccess.tsx
import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthSuccess: React.FC = () => {
  const history = useHistory();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Aquí puedes implementar una función para obtener el usuario actual
      // utilizando el token y actualizar el estado 'user'
      history.push('/');
    } else {
      history.push('/login');
    }
  }, [history, setUser]);

  return <div>Autenticando...</div>;
};

export default AuthSuccess;
