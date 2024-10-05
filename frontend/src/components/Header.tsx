// src/components/Header.tsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  // Calcular la cantidad de productos en el carrito
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calcular la cantidad de productos en la lista de deseos
  const wishlistItemCount = wishlistItems.length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          Peru Scooter Parts
        </Link>
        <nav className="hidden md:flex space-x-6">
          {/* <Link
            to="/"
            className="text-gray-800 dark:text-white hover:text-indigo-600"
          >
            Inicio
          </Link> */}
          {/* <Link
            to="/products"
            className="text-gray-800 dark:text-white hover:text-indigo-600"
          >
            Productos
          </Link> */}
          {/* <Link
            to="/chat"
            className="text-gray-800 dark:text-white hover:text-indigo-600"
          >
            Soporte
          </Link> */}
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/wishlist" className="text-gray-800 dark:text-white relative">
            <Heart size={24} />
            {/* Mostrar el contador de la lista de deseos */}
            {wishlistItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {wishlistItemCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="text-gray-800 dark:text-white relative">
            <ShoppingCart size={24} />
            {/* Mostrar el contador del carrito */}
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {cartItemCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                className="flex items-center text-gray-800 dark:text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <User size={24} />
                <span className="ml-2">Bienvenido, {user.name}</span>
              </button>
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-800 dark:text-white">
              Iniciar Sesión
            </Link>
          )}
          <button
            className="md:hidden text-gray-800 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-800">
          <Link
            to="/"
            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Inicio
          </Link>
          <Link
            to="/products"
            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Productos
          </Link>
          <Link
            to="/chat"
            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Soporte
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Mi Perfil
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
