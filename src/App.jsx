// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Cart from './components/Cart';
import MenuPage from './pages/MenuPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';
import AdminHomePage from './pages/AdminHomePage';
import LoginPage from './pages/LoginPage';
import HistoryPage from './pages/HistoryPage';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/ProtectedRoute';
import VariantModal from './components/VariantModal';
import { CartProvider, useCart } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import CustomerDisplayPage from './pages/CustomerDisplayPage';

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1) Eğer /customer-display rotasındaysak, direkt müşteri ekranını göster
  if (location.pathname === '/customer-display') {
    return <CustomerDisplayPage />;
  }

  // 2) Aksi halde POS arayüzü
  const hideCartOnPages = ['/admin', '/history', '/login', '/reports', '/payment'];
  const showCart = !hideCartOnPages.some(path => location.pathname.startsWith(path));

  const handleProductSelect = (product) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
    } else {
      addToCart({ id: product.id, name: product.name, price: product.price });
    }
  };

  const handleCloseModal = () => setSelectedProduct(null);

  const handleLogin = () => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <>
      <div className={showCart ? "app-container" : "app-container-full-width"}>
        <Header isAdmin={isAdmin} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MenuPage onProductSelect={handleProductSelect} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route
              path="/reports"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <AdminHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {showCart && <Cart />}
      </div>

      <VariantModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onSelect={(variant) => {
          addToCart({ id: variant.id, name: variant.name, price: variant.price });
          setSelectedProduct(null);
        }}
      />
    </>
  );
}

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </MenuProvider>
  );
}

export default App;