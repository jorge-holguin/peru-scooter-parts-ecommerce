import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Definir la estructura de un producto
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string;
}

// Definir la estructura de un ítem en el carrito
interface CartItem {
  product: Product;
  quantity: number;
}

// Definir las props del contexto de carrito
interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

// Definir las props para el CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Crear el contexto con valores iniciales predeterminados
export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: 0,
});

// Definir el CartProvider
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // URL base de la API

  // Obtener el token del localStorage
  const getToken = () => localStorage.getItem('token') || '';

  // Cargar el carrito desde el backend al montar el componente
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await axios.get(`${apiUrl}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(response.data.cartItems || []);
      } catch (error) {
        console.error('Error al obtener el carrito del backend:', error);
      }
    };

    fetchCartItems();
  }, [apiUrl]);

  // Guardar el carrito en localStorage cada vez que se actualice el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para añadir un producto al carrito e integrarlo con el backend
  const addToCart = async (product: Product, quantity: number) => {
    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    try {
      await axios.post(
        `${apiUrl}/cart`,
        { productId: product._id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error al agregar al carrito en el backend:', error);
      alert('No se pudo agregar el producto al carrito. Inténtalo de nuevo.');
    }
  };

  // Función para remover un producto del carrito e integrarlo con el backend
  const removeFromCart = async (productId: string) => {
    const token = getToken();
    if (!token) return;

    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));

    try {
      await axios.delete(`${apiUrl}/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al remover del carrito en el backend:', error);
      alert('No se pudo remover el producto del carrito.');
    }
  };

  // Función para limpiar el carrito e integrarlo con el backend
  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    setCartItems([]);

    try {
      await axios.delete(`${apiUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al limpiar el carrito en el backend:', error);
      alert('No se pudo limpiar el carrito. Inténtalo de nuevo.');
    }
  };

  // Calcular el precio total del carrito
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
