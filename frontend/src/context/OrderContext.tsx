// src/context/OrderContext.tsx
import React, { createContext, ReactNode } from 'react';
import axios from 'axios';

interface OrderItem {
  product: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderContextProps {
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  updateOrderToPaid: (orderId: string, paymentResult: any) => Promise<Order | null>;
}

interface OrderProviderProps {
  children: ReactNode;
}

// Crear el contexto con valores iniciales predeterminados
export const OrderContext = createContext<OrderContextProps>({
  createOrder: async () => {},
  getOrderById: async () => null,
  updateOrderToPaid: async () => null,
});

// Proveedor del contexto
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // Obtener el token del localStorage
  const getToken = () => localStorage.getItem('token') || '';

  // Usar la variable de entorno para la URL de la API
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Función para crear un nuevo pedido
  const createOrder = async (orderData: Partial<Order>) => {
    const token = getToken();
    try {
      const response = await axios.post(
        `${apiUrl}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Orden creada:', response.data);
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  };

  // Función para obtener un pedido por ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    const token = getToken();
    try {
      const response = await axios.get(`${apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el pedido:', error);
      return null;
    }
  };

  // Función para actualizar el pedido a pagado
  const updateOrderToPaid = async (orderId: string, paymentResult: any): Promise<Order | null> => {
    const token = getToken();
    try {
      const response = await axios.put(
        `${apiUrl}/orders/${orderId}/pay`,
        paymentResult,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado del pago:', error);
      return null;
    }
  };

  return (
    <OrderContext.Provider value={{ createOrder, getOrderById, updateOrderToPaid }}>
      {children}
    </OrderContext.Provider>
  );
};
