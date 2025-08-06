import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onProductSelect }) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
      ))}
    </div>
  );
};

export default ProductList;