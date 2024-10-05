// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  _id: string;
  totalPrice: number;
  isPaid: boolean;
  createdAt: string;
  // Agrega otros campos según tu modelo
}

const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [error, setError] = useState<string | null>(null);

  // Usar la variable de entorno para la URL de la API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Estructura de la respuesta:', response.data); // Verificar la estructura de la respuesta
        setOrders(response.data); // Ajuste para recibir un array directamente
      } catch (err) {
        setError('Error al obtener los pedidos. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [API_URL]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Mi Perfil
      </h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Mis Pedidos
      </h2>
      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No tienes pedidos realizados.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <p className="text-lg text-gray-800 dark:text-white">
                Pedido ID: {order._id}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Fecha: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Total: S/ {order.totalPrice}
              </p>
              <p
                className={`${
                  order.isPaid ? 'text-green-600' : 'text-red-600'
                } font-semibold`}
              >
                {order.isPaid ? 'Pagado' : 'Pendiente de Pago'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
