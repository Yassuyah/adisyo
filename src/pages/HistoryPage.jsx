import React, { useState, useEffect } from 'react';

// Artık fs ve path'e burada ihtiyacımız yok, tamamen kaldırıldı.

const HistoryPage = () => {
    const [lastTenSales, setLastTenSales] = useState([]);

    useEffect(() => {
        // Veriyi Electron'un ana sürecinden asenkron olarak iste
        const fetchSalesHistory = async () => {
            try {
                // 'get-sales' kanalı üzerinden tüm satışları alıyoruz
                const salesData = await window.electron.ipcRenderer.invoke('get-sales');
                // Satışları en yeniden eskiye sırala ve ilk 10'unu al
                const lastTen = salesData.reverse().slice(0, 10);
                setLastTenSales(lastTen);
            } catch (error) {
                console.error("Satış geçmişi alınırken hata:", error);
            }
        };

        fetchSalesHistory();
    }, []);

    return (
        <div className="history-page">
            <h1>Son Satışlar (En Son 10 İşlem)</h1>
            <div className="history-list-container">
                <div className="history-list-header">
                    <span>Tarih</span>
                    <span className="products-col">Ürünler</span>
                    <span>Ödeme Tipi</span>
                    <span>Tutar</span>
                </div>
                <div className="history-list-body">
                    {lastTenSales.length > 0 ? (
                        lastTenSales.map(sale => (
                            <div key={sale.id} className="history-list-row">
                                <span>{new Date(sale.date).toLocaleString('tr-TR')}</span>
                                <span className="products-col">
                                    {sale.items.map(item => item.name).join(', ')}
                                </span>
                                <span>{sale.paymentMethod}</span>
                                <span>{sale.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">Henüz satış kaydı yok.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;