// src/pages/CheckoutPage.tsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart, totalPrice } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems,
          shippingAddress: address,
          paymentMethod: 'PayPal', // O el método que utilices
          itemsPrice: totalPrice,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      clearCart();
      navigate('/profile');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ...resto del código */}
    </div>
  );
};

export default CheckoutPage;
