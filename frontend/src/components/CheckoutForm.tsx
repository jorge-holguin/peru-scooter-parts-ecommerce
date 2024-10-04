import React, { useState, useContext } from 'react';
import { CardElement, useStripe, useElements, CardElementProps } from '@stripe/react-stripe-js';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext'; // Importar el contexto de órdenes
import { useNavigate } from 'react-router-dom';

const CARD_ELEMENT_OPTIONS: CardElementProps['options'] = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { totalPrice, clearCart, cartItems } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext); // Usar el contexto de órdenes
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState(''); // Estado para la dirección
  const [city, setCity] = useState(''); // Estado para la ciudad
  const [postalCode, setPostalCode] = useState(''); // Estado para el código postal
  const [country, setCountry] = useState(''); // Estado para el país
  const navigate = useNavigate();

  // Usar la variable de entorno para la URL de la API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Validar campos de envío
      if (!address || !city || !postalCode || !country) {
        setErrorMessage('Por favor, completa todos los campos de envío.');
        setIsProcessing(false);
        return;
      }

      // Calcula el monto total en centavos
      const amount = Math.round(totalPrice * 100);

      // Llama a tu backend para crear un PaymentIntent
      const response = await axios.post(`${API_URL}/payments/create-payment-intent`, {
        amount: amount,
        currency: 'usd', // Cambia a 'pen' si usas soles peruanos
      });

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Ha ocurrido un error');
      } else {
        if (result.paymentIntent?.status === 'succeeded') {
          // Pago exitoso
          console.log('¡Pago exitoso!');

          // Crear una nueva orden en el backend
          await createOrder({
            orderItems: cartItems.map((item) => ({
              product: item.product._id,
              quantity: item.quantity,
            })),
            shippingAddress: { address, city, postalCode, country },
            paymentMethod: 'Tarjeta',
            itemsPrice: totalPrice,
            taxPrice: 0,
            shippingPrice: 5,
            totalPrice,
            isPaid: true,
            isDelivered: false,
          });

          // Limpiar el carrito
          clearCart();

          // Redirigir a la página de agradecimiento
          navigate('/thank-you');
        }
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setErrorMessage('Error al procesar el pago');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Detalles de Envío</h2>
      <div className="space-y-2">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            placeholder="123 Calle Falsa"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Ciudad</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            placeholder="Lima"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Código Postal</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">País</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            placeholder="Perú"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold">Información de la Tarjeta</h2>
      <label className="block text-gray-700 dark:text-gray-300">
        Número de Tarjeta
        <CardElement options={CARD_ELEMENT_OPTIONS} className="mt-2 p-2 border rounded-md dark:bg-gray-800" />
      </label>
      {errorMessage && <p className="text-red-600 dark:text-red-400">{errorMessage}</p>}
      <button type="submit" disabled={!stripe || isProcessing} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
        {isProcessing ? 'Procesando...' : `Pagar S/ ${totalPrice}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
