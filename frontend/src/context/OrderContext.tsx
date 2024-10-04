import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Definir la estructura de una orden
interface Order {
  _id?: string;
  orderItems: {
    product: string;
    quantity: number;
  }[];
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
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
}

// Definir las props del contexto de ordenes
interface OrderContextProps {
  orders: Order[];
  createOrder: (order: Order) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

// Definir las props para el `OrderProvider`
interface OrderProviderProps {
  children: ReactNode;
}

// Crear el contexto con valores iniciales predeterminados
export const OrderContext = createContext<OrderContextProps>({
  orders: [],
  createOrder: async () => {},
  getOrderById: async () => null,
  setOrders: () => {},
});

// Definir el `OrderProvider`
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Obtener el token del localStorage
  const getToken = () => localStorage.getItem('token');

  // Generar las cabeceras de autorización para las solicitudes
  const getAuthHeaders = () => {
    const token = getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  // Crear una nueva orden en el backend
  const createOrder = async (order: Order) => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      const response = await axios.post(`${apiUrl}/orders`, order, { headers });

      if (response.status === 201) {
        console.log('Orden creada con éxito:', response.data);
        setOrders((prevOrders) => [...prevOrders, response.data]);
      } else {
        console.error(`Error al crear la orden: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error al crear la orden en el backend:', error);
    }
  };

  // Obtener una orden específica por su ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        console.error('No se encontró el token en localStorage');
        return null;
      }

      const response = await axios.get(`${apiUrl}/orders/${orderId}`, { headers });

      if (response.status === 200) {
        console.log('Orden obtenida con éxito:', response.data);
        return response.data;
      } else {
        console.error(`Error al obtener la orden: ${response.data.message}`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la orden del backend:', error);
      return null;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
