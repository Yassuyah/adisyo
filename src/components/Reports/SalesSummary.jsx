import React from 'react';

const SalesSummary = ({ sales }) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSales = sales.length;
  const cashSales = sales.filter(s => s.paymentMethod === 'Nakit').reduce((sum, sale) => sum + sale.totalAmount, 0);
  const cardSales = sales.filter(s => s.paymentMethod === 'Kredi Kartı').reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="summary-cards">
      <div className="card">
        <h4>Toplam Ciro</h4>
        <p>{totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
      </div>
      <div className="card">
        <h4>Toplam Satış Adedi</h4>
        <p>{totalSales}</p>
      </div>
      <div className="card">
        <h4>Nakit</h4>
        <p>{cashSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
      </div>
      <div className="card">
        <h4>Kredi Kartı</h4>
        <p>{cardSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
      </div>
    </div>
  );
};

export default SalesSummary;