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

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Definir la URL base de la API
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Obtener el token del localStorage y verificar su existencia
  const getToken = () => {
    const token = localStorage.getItem('token') || '';
    console.log(`Token obtenido: ${token ? token : 'No se encontró token'}`);
    return token;
  };

  // Cargar la lista de deseos desde el backend al montar el componente
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.warn('No se pudo cargar la lista de deseos. Token no encontrado.');
          return; // Si no hay token, no cargar la lista de deseos
        }

        console.log('Haciendo petición GET para cargar la lista de deseos con el token:', token);
        const response = await axios.get(`${apiUrl}/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Respuesta del servidor al cargar lista de deseos:', response.data);
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
        console.warn('Debes iniciar sesión para agregar productos a la lista de deseos.');
        return;
      }

      console.log(`Haciendo petición POST para añadir producto a la lista de deseos: ${product.name}`);
      console.log('Token que se enviará en la cabecera:', token);

      // Añadir un log para ver las cabeceras enviadas
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      console.log('Cabeceras utilizadas en la solicitud:', headers);

      const response = await axios.post(
        `${apiUrl}/wishlist`,
        { productId: product._id },
        { headers }
      );

      console.log('Respuesta del servidor al agregar producto a la lista de deseos:', response.data);
      if (response.status === 200) {
        setWishlistItems((prevItems) => [...prevItems, product]);
      }
    } catch (error) {
      console.error('Error al agregar a la lista de deseos:', error);
    }
  };

  // Función para remover un producto de la lista de deseos en el backend y actualizar el estado local
  const removeFromWishlist = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('Debes iniciar sesión para remover productos de la lista de deseos.');
        return;
      }

      console.log(`Haciendo petición DELETE para remover producto de la lista de deseos: ${productId}`);
      console.log('Token que se enviará en la cabecera:', token);

      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      console.log('Cabeceras utilizadas en la solicitud:', headers);

      const response = await axios.delete(`${apiUrl}/wishlist/${productId}`, {
        headers,
      });

      console.log('Respuesta del servidor al remover producto de la lista de deseos:', response.data);
      if (response.status === 200) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== productId));
      }
    } catch (error) {
      console.error('Error al remover de la lista de deseos:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
