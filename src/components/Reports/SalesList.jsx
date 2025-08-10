import React, { useState, useMemo } from 'react';

const SalesList = ({ allSales }) => {
  const [expandedSaleId, setExpandedSaleId] = useState(null);
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
  
  const filteredSales = useMemo(() => {
    return filterSales(allSales, activeFilter);
  }, [allSales, activeFilter]);

  const toggleSaleDetails = (saleId) => {
    setExpandedSaleId(currentId => (currentId === saleId ? null : saleId));
  };

  const sortedSales = [...filteredSales].reverse();

  return (
    <div className="report-widget">
      <div className="report-widget-header">
        <h3>Detaylı Satış Kayıtları</h3>
        <div className="date-filters">
          <button className={activeFilter === 'today' ? 'active' : ''} onClick={() => setActiveFilter('today')}>Bugün</button>
          <button className={activeFilter === 7 ? 'active' : ''} onClick={() => setActiveFilter(7)}>Son 7 Gün</button>
          <button className={activeFilter === 30 ? 'active' : ''} onClick={() => setActiveFilter(30)}>Son 30 Gün</button>
          <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>Tümü</button>
        </div>
      </div>
      <div className="sales-list-container">
        <div className="sales-list-header">
          <span>Tarih</span>
          <span>Ödeme Tipi</span>
          <span>Toplam Tutar</span>
        </div>
        <div className="sales-list-body">
          {sortedSales.length > 0 ? (
            sortedSales.map(sale => (
              <div key={sale.id}>
                <div className="sales-list-row" onClick={() => toggleSaleDetails(sale.id)}>
                  <span>{new Date(sale.date).toLocaleString('tr-TR')}</span>
                  <span>{sale.paymentMethod}</span>
                  <span>{sale.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                </div>
                {expandedSaleId === sale.id && (
                  <div className="sale-details">
                    <h4>Adisyon Detayları:</h4>
                    <ul>
                      {sale.items.map(item => (
                        <li key={item.id}>
                          {item.quantity} x {item.name} - <span>{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">Bu zaman aralığında veri yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesList;