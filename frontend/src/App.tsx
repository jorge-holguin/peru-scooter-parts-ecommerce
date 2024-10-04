import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AuthSuccess from './pages/AuthSuccess';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import PrivateRoute from './components/PrivateRoute'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ThankYouPage from './pages/ThankYouPage';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext'; 

const stripePromise = loadStripe('pk_test_51Pz5mwHPZjnsfqM1Kb3T08Vb873Wp1QUrXQvjwyZdjFUsDqsl3JoEyTBPRrrc5V47mLNxotRRWz97BR6wgjzMdAx00smlQsB51');

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
        <OrderProvider>
        <WishlistProvider>
        <Elements stripe={stripePromise}>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auth-success" element={<AuthSuccess />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />

                  {/* Rutas protegidas */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                  </Route>
                </Routes>
              </main>
              <ChatWidget />
              <Footer />
            </div>
          </Router>
          </Elements>
          </WishlistProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
