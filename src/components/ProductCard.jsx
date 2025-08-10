import React from 'react';

const ProductCard = ({ product, onProductSelect }) => {
  return (
    <button className="product-card" onClick={() => onProductSelect(product)}>
      <h3>{product.name}</h3>
      {/* Eğer tek fiyat varsa göster, yoksa gösterme */}
      {product.price && <p>{product.price.toLocaleString('tr-TR')} TL</p>}
    </button>
  );
};

export default ProductCard;