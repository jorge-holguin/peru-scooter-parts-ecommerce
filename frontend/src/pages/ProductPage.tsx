// src/pages/ProductPage.tsx
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
  images: string; // Si solo usas una imagen
  stock: number;
  // Agrega otros campos según tu modelo
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        // Si el producto está directamente en response.data
        setProduct(response.data);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };

  if (!product) {
    return <div>Cargando...</div>;
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
              onClick={handleAddToCart}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <ShoppingCart className="mr-2" size={20} />
              Añadir al carrito
            </button>
            {user && (
              <button
                onClick={handleAddToWishlist}
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
