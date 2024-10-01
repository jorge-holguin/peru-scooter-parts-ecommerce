// src/pages/CartPage.tsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string;
  };
  quantity: number;
}

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, totalPrice } = useContext(CartContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Carrito de Compras
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Tu carrito está vacío.{' '}
          <Link to="/" className="text-indigo-600 hover:underline">
            Regresar a la tienda
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.product._id}
              className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Cantidad: {item.quantity}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Precio: S/ {item.product.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              Total: S/ {totalPrice}
            </p>
            <Link
              to="/checkout"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Proceder al Pago
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
