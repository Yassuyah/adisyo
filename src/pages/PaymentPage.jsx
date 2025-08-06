import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { cartItems, completeSale, applyDiscount, discount, clearDiscount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    // Sepet boşsa, kullanıcıyı ana menüye geri yönlendir
    navigate('/');
    return null;
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const finalTotal = subtotal - discountAmount;

  const handleCompleteSale = (paymentMethod) => {
    completeSale(paymentMethod);
    navigate('/'); // Satış tamamlanınca ana menüye dön
  };

  return (
    <div className="payment-page">
      <div className="payment-summary">
        <h1>Ödeme Ekranı</h1>
        <div className="price-details">
          <div className="price-row">
            <span>Ara Toplam</span>
            <span>{subtotal.toLocaleString('tr-TR')} TL</span>
          </div>
          {discount > 0 && (
            <div className="price-row discount">
              <span>İndirim (%{discount})</span>
              <span>- {discountAmount.toLocaleString('tr-TR')} TL</span>
            </div>
          )}
          <div className="price-row total">
            <span>Genel Toplam</span>
            <span>{finalTotal.toLocaleString('tr-TR')} TL</span>
          </div>
        </div>
      </div>
      <div className="payment-options">
        <div className="option-group">
          <h2>İndirimler</h2>
          <button className="btn-discount" onClick={() => applyDiscount(10)}>%10 İndirim</button>
          <button className="btn-discount" onClick={() => applyDiscount(15)}>%15 İndirim</button>
          <button className="btn-discount-clear" onClick={clearDiscount}>İndirimi Kaldır</button>
        </div>
        <div className="option-group">
          <h2>Ödeme Yöntemleri</h2>
          <button className="btn-payment-type" onClick={() => handleCompleteSale('Nakit')}>Nakit</button>
          <button className="btn-payment-type" onClick={() => handleCompleteSale('Kredi Kartı')}>Kredi Kartı</button>
          <button className="btn-payment-type" onClick={() => handleCompleteSale('Sodexo')}>Sodexo</button>
          <button className="btn-payment-type" onClick={() => handleCompleteSale('Multinet')}>Multinet</button>
          <button className="btn-payment-type btn-treat" onClick={() => handleCompleteSale('İkram')}>İkram</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;