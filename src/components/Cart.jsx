import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart, openCashDrawer } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (cartItems.length > 0) {
      navigate('/payment');
    }
  };

  return (
    <aside className="cart">
      <div className="cart-header">
        <h2>Adisyon</h2>
        <button onClick={clearCart} className="btn-cancel-order">Adisyon İptal</button>
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Sepetiniz boş.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="item-controls">
                <button onClick={() => decreaseQuantity(item.id)} className="quantity-btn">-</button>
                <span className="item-quantity">{item.quantity}</span>
                <button onClick={() => addToCart(item)} className="quantity-btn">+</button>
                <button onClick={() => removeFromCart(item.id)} className="trash-btn">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <h3>Ara Toplam: {subtotal.toLocaleString('tr-TR')} TL</h3>
        
        {/* YENİ KASA AÇ BUTONU BÖLÜMÜ */}
        <div className="cash-drawer-section">
            <button onClick={openCashDrawer} className="btn-open-drawer">KASA AÇ</button>
        </div>

        <div className="payment-buttons">
            <button 
                onClick={handlePayment} 
                className="btn-main-payment" 
                disabled={cartItems.length === 0}
            >
                ÖDEME
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Cart;