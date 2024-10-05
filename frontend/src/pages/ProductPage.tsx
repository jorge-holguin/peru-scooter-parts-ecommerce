import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  stock: number;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const [loading, setLoading] = useState(true); // Para mostrar un indicador de carga
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  // Definir la URL de la API usando la variable de entorno
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Validar si el ID existe antes de hacer la solicitud
    if (!id) {
      setError('ID de producto no especificado');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${id}`);
        console.log('Respuesta del producto:', response.data);
        setProduct(response.data);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError('Error al cargar el producto. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false); // Terminar la carga
      }
    };

    fetchProduct();
  }, [id, API_URL]);

  if (loading) {
    return <div className="text-center mt-20">Cargando producto...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="text-center mt-20">Producto no encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start">
        <div className="w-full md:w-1/2">
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {product.name}
          </h1>
          <p className="text-xl text-indigo-600 font-semibold mt-2">
            S/ {product.price}
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {product.description}
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={() => addToCart(product, 1)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <ShoppingCart className="mr-2" size={20} />
              Añadir al carrito
            </button>
            {user && (
              <button
                onClick={() => addToWishlist(product)}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Heart className="mr-2" size={20} />
                Añadir a la lista de deseos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
