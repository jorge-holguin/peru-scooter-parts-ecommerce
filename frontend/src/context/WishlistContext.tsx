import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Definir la estructura de un producto
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string; // Cambiado de string[] a string
}

// Definir las props del contexto de lista de deseos
interface WishlistContextProps {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

// Definir las props del `WishlistProvider`
interface WishlistProviderProps {
  children: ReactNode; // Definir el prop 'children' como ReactNode
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

  // Cargar la lista de deseos desde localStorage al montar el componente
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Guardar la lista de deseos en localStorage cada vez que se actualice
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Función para añadir un producto a la lista de deseos
  const addToWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      if (!prevItems.find((item) => item._id === product._id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  // Función para remover un producto de la lista de deseos
  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
