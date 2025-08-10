import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';

// Yeni ürün ekleme formunun başlangıç hali
const initialNewProductState = {
  name: '',
  hasVariants: false,
  price: 0,
  variants: { Small: 0, Medium: 0, Large: 0 },
};

const AdminPanel = () => {
  const { menu, updateMenu } = useMenu();
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Hangi kategoriye ürün eklendiğini takip etmek için state
  const [addingToCategoryIndex, setAddingToCategoryIndex] = useState(null);
  // Yeni ürün formunun verilerini tutmak için state
  const [newProduct, setNewProduct] = useState(initialNewProductState);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newMenu = [...menu, { category: newCategoryName, products: [] }];
    updateMenu(newMenu);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (categoryNameToDelete) => {
    if (window.confirm(`'${categoryNameToDelete}' kategorisini silmek istediğinize emin misiniz? İçindeki tüm ürünler de silinecektir.`)) {
      const newMenu = menu.filter(cat => cat.category !== categoryNameToDelete);
      updateMenu(newMenu);
    }
  };

  // Mevcut bir ürünün ismini veya tekil fiyatını güncellemek için
  const handleProductChange = (categoryIndex, productIndex, field, value) => {
    const newMenu = JSON.parse(JSON.stringify(menu)); // Derin kopya
    newMenu[categoryIndex].products[productIndex][field] = value;
    updateMenu(newMenu);
  };
  
  // Yeni ürün formundaki değişiklikleri state'e yansıtma
  const handleNewProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("variant-")) {
      const size = name.split("-")[1];
      setNewProduct(prev => ({
        ...prev,
        variants: { ...prev.variants, [size]: value }
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Yeni ürünü kaydetme
  const handleSaveNewProduct = (categoryIndex) => {
    if (newProduct.name.trim() === '') {
        alert("Ürün adı boş olamaz!");
        return;
    }

    const productToAdd = {
      id: Date.now(), // Basit benzersiz ID
      name: newProduct.name,
    };

    if (newProduct.hasVariants) {
      productToAdd.variants = [
        { size: 'Small', price: Number(newProduct.variants.Small) },
        { size: 'Medium', price: Number(newProduct.variants.Medium) },
        { size: 'Large', price: Number(newProduct.variants.Large) },
      ];
    } else {
      productToAdd.price = Number(newProduct.price);
    }

    const newMenu = JSON.parse(JSON.stringify(menu));
    newMenu[categoryIndex].products.push(productToAdd);
    updateMenu(newMenu);

    // Formu kapat ve sıfırla
    setAddingToCategoryIndex(null);
    setNewProduct(initialNewProductState);
  };

  const handleDeleteProduct = (categoryIndex, productIndex) => {
     const newMenu = [...menu];
     newMenu[categoryIndex].products.splice(productIndex, 1);
     updateMenu(newMenu);
  };

  return (
    <div className="admin-panel">
      <h1>Menü Yönetimi</h1>
      
      <div className="admin-section">
        <h2>Kategoriler</h2>
        <div className="category-add-form">
          <input 
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Yeni Kategori Adı"
          />
          <button onClick={handleAddCategory}>Kategori Ekle</button>
        </div>
      </div>

      {menu.map((category, catIndex) => (
        <div key={catIndex} className="admin-section category-editor">
          <div className="category-header">
            <h3>{category.category}</h3>
            <button onClick={() => handleDeleteCategory(category.category)} className="delete-btn">Kategoriyi Sil</button>
          </div>
          
          <div className="product-table">
            {/* ... mevcut ürün listesi ... */}
            {category.products.map((product, prodIndex) => (
              <div key={prodIndex} className="table-row">
                <input 
                  type="text" 
                  value={product.name}
                  onChange={(e) => handleProductChange(catIndex, prodIndex, 'name', e.target.value)}
                />
                {product.variants ? (
                  <span className="variant-inputs">
                    {product.variants.map(v => `${v.size}: ${v.price} TL`).join(' / ')}
                  </span>
                ) : (
                  <input 
                    type="number"
                    value={product.price}
                    onChange={(e) => handleProductChange(catIndex, prodIndex, 'price', Number(e.target.value))}
                  />
                )}
                <button onClick={() => handleDeleteProduct(catIndex, prodIndex)} className="delete-btn">Sil</button>
              </div>
            ))}
          </div>

          {/* YENİ ÜRÜN EKLEME FORMU BURADA */}
          {addingToCategoryIndex === catIndex ? (
            <div className="new-product-form">
              <h4>Yeni Ürün Ekle</h4>
              <input type="text" name="name" placeholder="Ürün Adı" value={newProduct.name} onChange={handleNewProductFormChange} />
              
              <div className="checkbox-wrapper">
                <input type="checkbox" name="hasVariants" id={`hasVariants-${catIndex}`} checked={newProduct.hasVariants} onChange={handleNewProductFormChange} />
                <label htmlFor={`hasVariants-${catIndex}`}>Farklı boyutları var mı?</label>
              </div>

              {newProduct.hasVariants ? (
                <div className="variant-price-inputs">
                  <input type="number" name="variant-Small" placeholder="Small Fiyatı" value={newProduct.variants.Small} onChange={handleNewProductFormChange}/>
                  <input type="number" name="variant-Medium" placeholder="Medium Fiyatı" value={newProduct.variants.Medium} onChange={handleNewProductFormChange}/>
                  <input type="number" name="variant-Large" placeholder="Large Fiyatı" value={newProduct.variants.Large} onChange={handleNewProductFormChange}/>
                </div>
              ) : (
                <input type="number" name="price" placeholder="Fiyat" value={newProduct.price} onChange={handleNewProductFormChange}/>
              )}

              <div className="form-actions">
                <button onClick={() => handleSaveNewProduct(catIndex)} className="save-btn">Kaydet</button>
                <button onClick={() => setAddingToCategoryIndex(null)} className="cancel-btn">İptal</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingToCategoryIndex(catIndex)} className="add-product-btn">Bu Kategoriye Ürün Ekle</button>
          )}

        </div>
      ))}
    </div>
  );
};

export default AdminPanel;