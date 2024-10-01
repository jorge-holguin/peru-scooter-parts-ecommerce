// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client'
import './index.css'; // Importa el CSS de Tailwind
import App from './App';

// Crea el "root" usando createRoot en lugar de render
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
