import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailySalesChart = ({ sales }) => {
    const processData = () => {
        const dailyData = {};
        sales.forEach(sale => {
            const date = new Date(sale.date).toLocaleDateString('tr-TR');
            if (!dailyData[date]) {
                dailyData[date] = { name: date, Nakit: 0, 'Kredi Kartı': 0, Toplam: 0 };
            }
            dailyData[date][sale.paymentMethod] += sale.totalAmount;
            dailyData[date].Toplam += sale.totalAmount;
        });
        return Object.values(dailyData);
    };

    const data = processData();

    return (
        <div className="chart-container">
            <h3>Günlük Satış Grafiği</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString('tr-TR')} TL`} />
                    <Legend />
                    <Bar dataKey="Nakit" stackId="a" fill="#28a745" />
                    <Bar dataKey="Kredi Kartı" stackId="a" fill="#007bff" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailySalesChart;