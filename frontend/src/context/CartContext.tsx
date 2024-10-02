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

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que se actualice el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para añadir un producto al carrito e integrarlo con el backend
  const addToCart = async (product: Product, quantity: number) => {
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
      // Llamada al backend para agregar el ítem al carrito en la base de datos
      await axios.post(`${process.env.REACT_APP_API_URL}/cart`, {
        productId: product._id,
        quantity,
      });
    } catch (error) {
      console.error('Error al agregar al carrito en el backend:', error);
    }
  };

  // Función para remover un producto del carrito e integrarlo con el backend
  const removeFromCart = async (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));

    try {
      // Llamada al backend para eliminar el ítem del carrito en la base de datos
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${productId}`);
    } catch (error) {
      console.error('Error al remover del carrito en el backend:', error);
    }
  };

  // Función para limpiar el carrito e integrarlo con el backend
  const clearCart = async () => {
    setCartItems([]);

    try {
      // Llamada al backend para limpiar el carrito en la base de datos
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart`);
    } catch (error) {
      console.error('Error al limpiar el carrito en el backend:', error);
    }
  };

  // Calcular el precio total del carrito
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
