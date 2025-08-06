import React, { useState, useEffect, useMemo } from 'react';
import SalesSummary from '../components/Reports/SalesSummary';
import DailySalesChart from '../components/Reports/DailySalesChart';
import TopProducts from '../components/Reports/TopProducts';
import SalesList from '../components/Reports/SalesList';
import ZReportGenerator from '../components/Reports/ZReportGenerator'; // Yeni bileşeni import et

const ReportsPage = () => {
    const [allSales, setAllSales] = useState([]);
    const [activeReport, setActiveReport] = useState(null);
    const [summaryFilter, setSummaryFilter] = useState('today');

    useEffect(() => {
      const fetchSales = async () => {
        try {
          const salesData = await window.electron.ipcRenderer.invoke('get-sales');
          setAllSales(salesData);
        } catch (error) {
          console.error("Satış verisi alınırken hata:", error);
        }
      };
      fetchSales();
    }, []);

    const summaryFilteredSales = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (summaryFilter === 'today') return allSales.filter(sale => new Date(sale.date) >= today);
        if (summaryFilter === 'all') return allSales;
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - summaryFilter);
        return allSales.filter(sale => new Date(sale.date) >= cutoffDate);
    }, [allSales, summaryFilter]);

    if (!activeReport) {
        return (
            <div className="report-home-container">
                <h1>Raporlar Menüsü</h1>
                <div className="admin-menu-buttons">
                    <button onClick={() => setActiveReport('summary')}>Satış Özetleri</button>
                    <button onClick={() => setActiveReport('topProducts')}>En Çok Satanlar</button>
                    <button onClick={() => setActiveReport('salesList')}>Detaylı Satışlar</button>
                    <button onClick={() => setActiveReport('zReport')} style={{backgroundColor: '#ff6f00'}}>Genel Satış Raporu</button>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-page">
            <button className="back-to-menu-btn" onClick={() => setActiveReport(null)}>
                &larr; Raporlar Ana Menüsüne Geri Dön
            </button>
            
            <div className="report-content">
                {activeReport === 'summary' && (
                    <div className="report-widget">
                        <div className="report-widget-header">
                            <h3>Satış Özetleri</h3>
                            <div className="date-filters">
                                <button className={summaryFilter === 'today' ? 'active' : ''} onClick={() => setSummaryFilter('today')}>Bugün</button>
                                <button className={summaryFilter === 7 ? 'active' : ''} onClick={() => setSummaryFilter(7)}>Son 7 Gün</button>
                                <button className={summaryFilter === 30 ? 'active' : ''} onClick={() => setSummaryFilter(30)}>Son 30 Gün</button>
                                <button className={summaryFilter === 'all' ? 'active' : ''} onClick={() => setSummaryFilter('all')}>Tümü</button>
                            </div>
                        </div>
                        <SalesSummary sales={summaryFilteredSales} />
                        <div className="reports-grid">
                            <DailySalesChart sales={summaryFilteredSales} />
                        </div>
                    </div>
                )}
                {activeReport === 'topProducts' && <TopProducts allSales={allSales} />}
                {activeReport === 'salesList' && <SalesList allSales={allSales} />}
                {activeReport === 'zReport' && <ZReportGenerator allSales={allSales} />}
            </div>
        </div>
    );
};

export default ReportsPage;