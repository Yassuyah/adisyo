import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Şifre kontrolü
    if (password === '1111') {
      onLogin(); // App.jsx'teki state'i güncelle
      navigate('/admin'); // Admin ana sayfasına yönlendir
    } else {
      setError('Hatalı şifre, lütfen tekrar deneyin.');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Admin Girişi</h1>
        <p>Lütfen devam etmek için şifrenizi girin.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          autoFocus
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default LoginPage;