import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Definir la estructura de un producto
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string;
}

// Definir las props del contexto de lista de deseos
interface WishlistContextProps {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

// Definir las props del `WishlistProvider`
interface WishlistProviderProps {
  children: ReactNode;
}

// Crear el contexto con valores iniciales predeterminados
export const WishlistContext = createContext<WishlistContextProps>({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
});

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // URL base de la API

  // Obtener el token del localStorage
  const getToken = () => localStorage.getItem('token') || '';

  // Cargar la lista de deseos desde el backend al montar el componente
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = getToken();
        if (!token) return; // Si no hay token, no cargar la lista de deseos

        const response = await axios.get(`${apiUrl}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishlistItems(response.data.wishlistItems || []);
      } catch (error) {
        console.error('Error al obtener la lista de deseos del backend:', error);
      }
    };

    fetchWishlist();
  }, [apiUrl]);

  // Función para añadir un producto a la lista de deseos en el backend y actualizar el estado local
  const addToWishlist = async (product: Product) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Debes iniciar sesión para añadir productos a la lista de deseos.');
        return;
      }

      const response = await axios.post(
        `${apiUrl}/wishlist`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setWishlistItems((prevItems) => [...prevItems, product]);
        alert('Producto añadido a la lista de deseos.');
      }
    } catch (error) {
      console.error('Error al agregar a la lista de deseos:', error);
      alert('No se pudo añadir a la lista de deseos.');
    }
  };

  // Función para remover un producto de la lista de deseos en el backend y actualizar el estado local
  const removeFromWishlist = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Debes iniciar sesión para eliminar productos de la lista de deseos.');
        return;
      }

      const response = await axios.delete(`${apiUrl}/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== productId));
        alert('Producto eliminado de la lista de deseos.');
      }
    } catch (error) {
      console.error('Error al remover de la lista de deseos:', error);
      alert('No se pudo eliminar de la lista de deseos.');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
