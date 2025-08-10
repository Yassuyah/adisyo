import React, { useState, useMemo } from 'react';

const TopProducts = ({ allSales }) => {
  const [activeFilter, setActiveFilter] = useState('today');

  const filterSales = (sourceData, filterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (filterType === 'today') return sourceData.filter(sale => new Date(sale.date) >= today);
    if (filterType === 'all') return sourceData;
    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - filterType);
    return sourceData.filter(sale => new Date(sale.date) >= cutoffDate);
  };

  const topProducts = useMemo(() => {
    const filteredSales = filterSales(allSales, activeFilter);
    const productCounts = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const baseName = item.name.split(' (')[0];
        productCounts[baseName] = (productCounts[baseName] || 0) + item.quantity;
      });
    });
    return Object.entries(productCounts).sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [allSales, activeFilter]);

  return (
    <div className="report-widget">
      <div className="report-widget-header">
        <h3>En Çok Satan Ürünler</h3>
        <div className="date-filters">
          <button className={activeFilter === 'today' ? 'active' : ''} onClick={() => setActiveFilter('today')}>Bugün</button>
          <button className={activeFilter === 7 ? 'active' : ''} onClick={() => setActiveFilter(7)}>Son 7 Gün</button>
          <button className={activeFilter === 30 ? 'active' : ''} onClick={() => setActiveFilter(30)}>Son 30 Gün</button>
          <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>Tümü</button>
        </div>
      </div>
      {topProducts.length > 0 ? (
        <ol className="top-products-list">
          {topProducts.map(([name, count]) => (
            <li key={name}>
              <span>{name}</span>
              <span>{count} adet</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="no-data">Bu zaman aralığında veri yok.</p>
      )}
    </div>
  );
};

export default TopProducts;