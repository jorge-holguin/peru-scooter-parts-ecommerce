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

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Mi Perfil
      </h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Mis Pedidos
      </h2>
      {orders.length === 0 ? (
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
