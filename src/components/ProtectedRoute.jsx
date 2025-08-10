import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  // Giriş yapmışsa, istenen sayfayı göster
  return children;
};

export default ProtectedRoute;