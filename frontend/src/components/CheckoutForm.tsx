// src/components/CheckoutForm.tsx
import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  CardElementProps,
} from '@stripe/react-stripe-js';
import axios from 'axios';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Llama a tu backend para crear un PaymentIntent
      const response = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: 1000, // Monto en centavos (por ejemplo, $10.00)
        currency: 'usd',
      });

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
          // Puedes redirigir al usuario o mostrar un mensaje de éxito
        }
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setErrorMessage('Error al procesar el pago');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <label className="block text-gray-700 dark:text-gray-300">
        Información de la Tarjeta
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          className="mt-2 p-2 border rounded-md"
        />
      </label>
      {errorMessage && (
        <p className="text-red-600">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isProcessing ? 'Procesando...' : 'Pagar'}
      </button>
    </form>
  );
};

export default CheckoutForm;
