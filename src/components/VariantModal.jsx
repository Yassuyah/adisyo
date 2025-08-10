import React from 'react';
import { useCart } from '../context/CartContext';

const VariantModal = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const handleVariantClick = (variant) => {
    addToCart({
      id: `${product.id}-${variant.size}`, // Sepet için benzersiz ID
      name: `${product.name} (${variant.size})`,
      price: variant.price,
    });
    onClose(); // Seçim yapıldıktan sonra modal'ı kapat
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{product.name}</h2>
        <p>Lütfen bir boyut seçin:</p>
        <div className="variant-buttons">
          {product.variants.map((variant) => (
            <button key={variant.size} onClick={() => handleVariantClick(variant)}>
              {variant.size} - {variant.price} TL
            </button>
          ))}
        </div>
        <button className="close-btn" onClick={onClose}>
          Kapat
        </button>
      </div>
    </div>
  );
};

export default VariantModal;