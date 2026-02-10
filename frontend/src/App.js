import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Athletes from './pages/Athletes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/athletes" element={<Athletes />} />
            </Routes>
          </main>
          
          <footer className="footer">
            <div className="footer-content">
              <h3>GYMNOVA SHOP</h3>
              <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '1.1rem' }}>
                Votre partenaire en matériel de gymnastique professionnel
              </p>
              <div className="footer-divider"></div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-lg)',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#127942;</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>FIG Certified</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#128666;</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>48h Shipping</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#128737;&#65039;</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>2-Year Warranty</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#128274;</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>Secure Payment</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                &copy; 2024 Gymnova Shop - Projet BTS SIO SLAM - Tous droits r&eacute;serv&eacute;s
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
