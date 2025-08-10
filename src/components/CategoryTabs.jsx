import React from 'react';

const CategoryTabs = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${category === activeCategory ? 'active' : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;