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

  // URL base de la API
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

  // Cargar la lista de deseos desde el backend al montar el componente
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) {
          console.error('No se encontró el token en localStorage');
          return;
        }

        console.log('Haciendo petición GET para cargar la lista de deseos con las cabeceras:', headers);

        const response = await axios.get(`${apiUrl}/wishlist`, { headers });
        console.log('Respuesta del servidor al cargar lista de deseos:', response.data);
        setWishlistItems(response.data.wishlist || []); // Actualizar estado con la lista de deseos
      } catch (error) {
        console.error('Error al obtener la lista de deseos del backend:', error);
      }
    };

    fetchWishlist();
  }, [apiUrl]);

  // Función para añadir un producto a la lista de deseos en el backend y actualizar el estado local
  const addToWishlist = async (product: Product) => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      console.log('Cabeceras utilizadas para agregar a lista de deseos:', headers);
      const requestBody = { productId: product._id };
      console.log('Cuerpo de la solicitud para agregar a lista de deseos:', requestBody);

      const response = await axios.post(`${apiUrl}/wishlist`, requestBody, { headers });

      if (response.status === 200) {
        console.log('Producto agregado a la lista de deseos en el backend:', product.name);
        setWishlistItems((prevItems) => [...prevItems, product]);
      } else {
        console.error(`Error al agregar a la lista de deseos: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error al agregar a la lista de deseos en el backend:', error);
    }
  };

  // Función para remover un producto de la lista de deseos en el backend y actualizar el estado local
  const removeFromWishlist = async (productId: string) => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      console.log('Cabeceras utilizadas para remover de lista de deseos:', headers);
      console.log('Cuerpo de la solicitud para eliminar de lista de deseos:', { productId });

      const response = await axios.delete(`${apiUrl}/wishlist/${productId}`, { headers });

      if (response.status === 200) {
        console.log('Producto removido de la lista de deseos en el backend:', productId);
        setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== productId));
      } else {
        console.error(`Error al remover de la lista de deseos: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error al remover de la lista de deseos en el backend:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
