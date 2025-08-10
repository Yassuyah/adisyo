import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = ({ isAdmin, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">EGE POS</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
          Menü
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
          Geçmiş
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
          Admin
        </NavLink>

        {/* Eğer admin giriş yapmışsa Çıkış Yap butonunu göster */}
        {isAdmin && (
            <button onClick={onLogout} className="logout-btn">Çıkış Yap</button>
        )}
      </nav>
    </header>
  );
};

export default Header;