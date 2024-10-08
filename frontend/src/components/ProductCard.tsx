// src/components/ProductCard.tsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {product.name}
        </h2>
      </Link>
      <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-lg font-bold text-indigo-600">S/ {product.price}</span>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleBuyNow}
          >
            Comprar
          </button>
          <button
            className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handleAddToCart}
          >
            <FiShoppingCart />
          </button>
          <button
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleAddToWishlist}
          >
            <FiHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
