import React, { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';
import { useMenu } from '../context/MenuContext'; // useMenu hook'unu import et

const MenuPage = ({ onProductSelect }) => {
  const { menu } = useMenu(); // Veriyi context'ten al
  const [activeCategory, setActiveCategory] = useState('');

  // Menü yüklendiğinde ilk kategoriyi aktif yap
  if (menu.length > 0 && activeCategory === '') {
    setActiveCategory(menu[0].category);
  }

  if (menu.length === 0) {
    return <div>Menü yükleniyor...</div>;
  }

  const activeProducts = menu.find(
    (cat) => cat.category === activeCategory
  )?.products || [];

  return (
    <div className="menu-page-layout">
      <CategoryTabs
        categories={menu.map((c) => c.category)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ProductList products={activeProducts} onProductSelect={onProductSelect} />
    </div>
  );
};

export default MenuPage;