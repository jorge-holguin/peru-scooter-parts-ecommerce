// src/pages/WishlistPage.tsx
import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const WishlistPage: React.FC = () => {
  // Utiliza el contexto para obtener la lista de deseos
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  // Función para manejar la eliminación de un producto de la lista de deseos
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // Llamada a la API para eliminar el producto de la lista de deseos en la base de datos
      await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/${productId}`);
      // Actualizar la lista de deseos en el contexto local
      removeFromWishlist(productId);
      alert('Producto eliminado de la lista de deseos');
    } catch (error) {
      console.error('Error al eliminar de la lista de deseos:', error);
      alert('Ocurrió un error al eliminar de la lista de deseos');
    }
  };

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
                  src={product.images} // Asegúrate de que `product.images` contiene la URL de la imagen correcta
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
                onClick={() => handleRemoveFromWishlist(product._id)} // Llamar a la función para eliminar de la lista de deseos
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
