// src/pages/ThankYouPage.tsx
import React from 'react';

const ThankYouPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        ¡Gracias por tu compra!
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        Tu pedido ha sido procesado exitosamente.
      </p>
    </div>
  );
};

export default ThankYouPage;
