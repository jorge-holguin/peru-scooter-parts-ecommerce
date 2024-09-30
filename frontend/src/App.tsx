// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AuthSuccess from './pages/AuthSuccess';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Switch>
                  <Route path="/" component={HomePage} exact />
                  <Route path="/product/:id" component={ProductPage} />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/register" component={RegisterPage} />
                  <Route path="/cart" component={CartPage} />
                  {/* Rutas públicas */}
                  <PrivateRoute path="/cart" component={CartPage} />
                  <PrivateRoute path="/wishlist" component={WishlistPage} />
                  <PrivateRoute path="/checkout" component={CheckoutPage} />
                  <PrivateRoute path="/profile" component={ProfilePage} />
                  <Route path="/auth-success" component={AuthSuccess} />
                  {/* Puedes agregar más rutas según sea necesario */}
                </Switch>
              </main>
              <ChatWidget />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
