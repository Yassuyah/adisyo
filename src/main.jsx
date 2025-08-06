import React from 'react';
import ReactDOM from 'react-dom/client';
// DİKKAT: BrowserRouter yerine HashRouter import ediyoruz
import { HashRouter } from 'react-router-dom'; 
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* DİKKAT: BrowserRouter yerine HashRouter kullanıyoruz */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);