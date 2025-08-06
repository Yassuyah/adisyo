import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import CustomerDisplayPage from './pages/CustomerDisplayPage';


function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            <Route path="/customer-display" element={<CustomerDisplayPage />} /> {/* YENİ YOL */}
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
      <VariantModal product={selectedProduct} onClose={handleCloseModal} />
    </>
  );
}
 
 // Kasiyer (POS) tarafı için tüm normal route’lar
function POSRoutes() {
  return (
    <>
      <Header />
      <VariantModal />
      <Routes>
        <Route path="/" element={<Navigate to="/menu" />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Cart />
    </>
  );
}

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <Routes>
          {/* 2. monitörde tam ekran müşteri ekranı */}
          <Route
            path="/customer-display"
            element={<CustomerDisplayPage />}
          />

          {/* Diğer tüm yollar kasiyer (POS) */}
          <Route path="/*" element={<POSRoutes />} />
        </Routes>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;