import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';

// Tarihi YYYY-MM-DD formatına çeviren yardımcı fonksiyon
const toISODateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

// Rapor hesaplamalarını yapan ana ve detaylı fonksiyon
const calculateZReport = (salesForDate, menu) => {
    const KDV_ORANI = 0.10; // %10 KDV

    let totalItems = 0;
    const paymentTotals = { 'NAKİT': 0, 'KREDİ KARTI': 0, 'SODEXO': 0, 'MULTINET': 0, 'İKRAM': 0, total: 0 };
    const categoryTotals = {};
    menu.forEach(cat => categoryTotals[cat.category] = { count: 0, total: 0 });
    const hourlyTotals = {};
    for (let i = 0; i < 24; i += 2) {
        const slot = `${i.toString().padStart(2, '0')}-${(i + 2).toString().padStart(2, '0')}`;
        hourlyTotals[slot] = { count: 0, total: 0 };
    }
    const discountDetails = {
        10: { count: 0, amount: 0 },
        15: { count: 0, amount: 0 }
    };
    let totalDiscounts = 0;
    
    salesForDate.forEach(sale => {
        const paymentMethodKey = sale.paymentMethod.toUpperCase();
        paymentTotals[paymentMethodKey] = (paymentTotals[paymentMethodKey] || 0) + sale.totalAmount;
        paymentTotals.total += sale.totalAmount;
        
        if (sale.discountPercentage > 0) {
            discountDetails[sale.discountPercentage].count++;
            discountDetails[sale.discountPercentage].amount += sale.discountAmount;
            totalDiscounts += sale.discountAmount;
        }

        const saleHour = new Date(sale.date).getHours();
        for (const slot in hourlyTotals) {
            const startHour = parseInt(slot.split('-')[0]);
            if (saleHour >= startHour && saleHour < startHour + 2) {
                hourlyTotals[slot].total += sale.totalAmount;
                hourlyTotals[slot].count++;
                break;
            }
        }

        sale.items.forEach(item => {
            totalItems += item.quantity;
            const baseName = item.name.split(' (')[0];
            let itemCategory = 'Diğer';
            for (const cat of menu) {
                if (cat.products.some(p => p.name === baseName)) {
                    itemCategory = cat.category;
                    break;
                }
            }
            if (!categoryTotals[itemCategory]) categoryTotals[itemCategory] = { count: 0, total: 0 };
            categoryTotals[itemCategory].count += item.quantity;
            categoryTotals[itemCategory].total += item.price * item.quantity;
        });
    });

    const grossSales = paymentTotals.total + totalDiscounts;
    const netSales = paymentTotals.total;
    const kdvAmount = netSales - (netSales / (1 + KDV_ORANI));

    return {
        reportDate: new Date(salesForDate[0].date).toLocaleDateString('tr-TR'),
        totalItems,
        totalDiscounts,
        grossSales,
        netSales,
        kdvAmount,
        transactionCount: salesForDate.length,
        averageBill: salesForDate.length > 0 ? netSales / salesForDate.length : 0,
        paymentTotals,
        categoryTotals,
        hourlyTotals,
        discountDetails,
    };
};

const ZReportGenerator = ({ allSales }) => {
    const { menu } = useMenu();
    const [selectedDate, setSelectedDate] = useState(toISODateString(new Date()));
    const [reportData, setReportData] = useState(null);

    const generateReport = () => {
        const targetDate = new Date(selectedDate);
        const salesForDate = allSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getFullYear() === targetDate.getFullYear() &&
                   saleDate.getMonth() === targetDate.getMonth() &&
                   saleDate.getDate() === targetDate.getDate();
        });

        if (salesForDate.length === 0) {
            setReportData(null);
            alert("Seçilen tarih için satış verisi bulunamadı.");
            return;
        }
        
        const calculatedData = calculateZReport(salesForDate, menu);
        setReportData(calculatedData);
    };

    const printReport = () => {
        if (!reportData) return;
        
        const p = (text = '', width = 0) => text.toString().padEnd(width, ' ');
        const pr = (text = 0, width = 0) => text.toString().padStart(width, ' ');
        
        const receiptData = [
            { type: 'text', value: 'Genel Satis Raporu', style: { fontWeight: "700", textAlign: 'center', fontSize: "22px"} },
            { type: 'text', value: `Calisma Gunu: ${reportData.reportDate}`, style: {textAlign: 'center'} },
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Urun Satisi              Adet     Tutar', style: { fontWeight: "700"}},
            { type: 'text', value: `${p('Menu Kalemi',20)} ${pr(reportData.totalItems,4)}  ${pr(reportData.grossSales.toFixed(2),10)}`, style: {}},
            { type: 'text', value: `${p('Toplam Ind.',20)} ${pr('', 4)} -${pr(reportData.totalDiscounts.toFixed(2),10)}`, style: {}},
            { type: 'text', value: '--------------------------------', style: {}},
            { type: 'text', value: `${p('NET SATIS', 20)} ${pr('', 4)}  ${pr(reportData.netSales.toFixed(2), 10)}`, style: {}},
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Cek Islemleri', style: { fontWeight: "700"}},
            { type: 'text', value: `${p('Acilan Hesa.',18)} ${pr(reportData.transactionCount, 4)}`, style: {}},
            { type: 'text', value: `${p('Kapanan Hesa.',18)} ${pr(reportData.transactionCount, 4)}`, style: {}},
            { type: 'text', value: `${p('Hesap Ort.',18)} ${pr('', 4)}   ${pr(reportData.averageBill.toFixed(2), 10)}`, style: {}},
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Vergi Detaylari', style: {fontWeight: '700'}},
            { type: 'text', value: `${p(`KDV %10 Brut`,20)}         ${pr((reportData.netSales / 1.10).toFixed(2),10)}`, style: {}},
            { type: 'text', value: `${p(`KDV %10 KDV`,20)}          ${pr(reportData.kdvAmount.toFixed(2),10)}`, style: {}},
            { type: 'text', value: `${p(`KDV %10 Net`,20)}          ${pr(reportData.netSales.toFixed(2),10)}`, style: {}},
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Islem Periyotlari', style: { fontWeight: "700"}},
            ...Object.entries(reportData.hourlyTotals).filter(([,data]) => data.count > 0).map(([period, data]) => ({
                type: 'text', value: `${p(period, 18)} ${pr(data.count, 3)}   ${pr(data.total.toFixed(2), 10)}`
            })),
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Odemeler', style: { fontWeight: "700"}},
            ...Object.entries(reportData.paymentTotals).filter(([key,]) => key !== 'total').map(([name, total]) => ({
                type: 'text', value: `${p(name, 18)}       ${pr(total.toFixed(2), 10)}`
            })),
            { type: 'text', value: '--------------------------------', style: {}},
            { type: 'text', value: `${p('TOPLAM', 18)}       ${pr(reportData.paymentTotals.total.toFixed(2), 10)}`, style: {fontWeight: '700'}},
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Indirimler', style: {fontWeight: '700'}},
            ...Object.entries(reportData.discountDetails).filter(([,data]) => data.count > 0).map(([perc, data]) => ({
                type: 'text', value: `${p(`%${perc} Indirim`, 18)} ${pr(data.count, 3)}  -${pr(data.amount.toFixed(2), 10)}`
            })),
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: 'Ana Grup', style: { fontWeight: "700"}},
            ...Object.entries(reportData.categoryTotals).filter(([,data]) => data.count > 0).map(([name, data]) => ({
                type: 'text', value: `${p(name.slice(0, 16), 18)} ${pr(data.count, 3)}   ${pr(data.total.toFixed(2), 10)}`
            })),
            { type: 'text', value: '================================', style: {}},
            { type: 'text', value: `Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}`, style: {textAlign: 'center', fontSize: '12px'}},
        ];

        window.electron.ipcRenderer.send('print-receipt', receiptData);
    };

    return (
        <div className="report-widget">
            <div className="report-widget-header">
                <h3>Genel Satış Raporu (Z Raporu)</h3>
            </div>
            <div className="z-report-controls">
                <p>Lütfen raporunu oluşturmak istediğiniz günü seçin:</p>
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={toISODateString(new Date())}
                />
                <button onClick={generateReport}>Rapor Oluştur</button>
            </div>

            {reportData && (
                <div className="z-report-preview">
                    <h4>Rapor Önizlemesi (`${reportData.reportDate}`)</h4>
                    <p>Hesaplanan verileri aşağıda görebilirsiniz. "Yazdır" butonu, bu verileri fiş formatında basacaktır.</p>
                    <pre>{JSON.stringify(reportData, null, 2)}</pre>
                    <button onClick={printReport} className="print-btn">Yazdır</button>
                </div>
            )}
        </div>
    );
};

export default ZReportGenerator;