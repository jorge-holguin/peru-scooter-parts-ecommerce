// src/components/CheckoutForm.tsx
import React, { useState, useContext } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  CardElementProps,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
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
  const {totalPrice, clearCart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Calcula el monto total en centavos
      const amount = Math.round(totalPrice * 100); // Asegúrate de que sea un número entero

      // Llama a tu backend para crear un PaymentIntent
      const response = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        {
          amount: amount,
          currency: 'usd', // Cambia a 'pen' si usas soles peruanos
        }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        // Muestra el error al cliente
        setErrorMessage(result.error.message || 'Ha ocurrido un error');
      } else {
        if (result.paymentIntent?.status === 'succeeded') {
          // Pago exitoso
          console.log('¡Pago exitoso!');
          // Limpiar el carrito
          clearCart();
          // Redirigir o mostrar mensaje de éxito
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
      <label className="block text-gray-700 dark:text-gray-300">
        Información de la Tarjeta
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          className="mt-2 p-2 border rounded-md dark:bg-gray-800"
        />
      </label>
      {errorMessage && (
        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isProcessing ? 'Procesando...' : `Pagar S/ ${totalPrice}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
