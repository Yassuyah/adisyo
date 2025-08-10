import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-home-container">
      <h1>Admin Paneli</h1>
      <div className="admin-menu-buttons">
        <button onClick={() => navigate('/admin/products')}>
          Ürünleri Güncelle
        </button>
        <button onClick={() => navigate('/reports')}>
          Raporları Görüntüle
        </button>
      </div>
    </div>
  );
};

export default AdminHomePage;