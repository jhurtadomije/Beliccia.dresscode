// src/main.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap'; // JS de Bootstrap
import './assets/estilos.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
