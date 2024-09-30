// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-300">
        <p>
          &copy; {new Date().getFullYear()} Peru Scooter Parts. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
