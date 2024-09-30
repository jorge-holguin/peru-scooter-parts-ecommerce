// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition duration-300">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0]}
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
    </div>
  );
};

export default ProductCard;
