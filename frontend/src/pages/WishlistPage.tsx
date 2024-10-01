// src/pages/WishlistPage.tsx
import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string; // Cambiado para coincidir con el contexto
}

const WishlistPage: React.FC = () => {
  // Utiliza el contexto para obtener la lista de deseos
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Mi Lista de Deseos
      </h1>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Tu lista de deseos está vacía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition duration-300 relative"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images} // Utiliza la propiedad `image` directamente
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-indigo-600 font-bold text-xl">
                    S/ {product.price}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
