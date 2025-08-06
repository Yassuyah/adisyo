import React, { useState, useEffect } from 'react';

const CustomerDisplayPage = () => {
    const [cart, setCart] = useState({ items: [], finalTotal: 0 });

    useEffect(() => {
        // Electron'dan gelen 'cart-updated' mesajını dinle
        window.electron.ipcRenderer.on('cart-updated', (cartData) => {
            setCart(cartData);
        });
    }, []);

    return (
        <div className="customer-display">
            {/* YENİ: Sol üste marka eklendi */}
            <div className="brand-top-left">Portre Coffee</div>

            <div className="customer-content">
                <div className="customer-cart">
                    <div className="customer-cart-header">
                        <h2>Siparişiniz</h2>
                        <h2>Tutar</h2>
                    </div>
                    <div className="customer-cart-items">
                        {cart.items.length > 0 ? (
                            cart.items.map(item => (
                                <div className="customer-cart-item" key={item.id}>
                                    <span>{item.quantity} x {item.name}</span>
                                    <span>{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                                </div>
                            ))
                        ) : (
                            <div className="welcome-message">
                                <h1>HOŞ GELDİNİZ</h1>
                            </div>
                        )}
                    </div>
                </div>
                <div className="customer-total">
                    <h1>TOPLAM: {cart.finalTotal.toLocaleString('tr-TR')} TL</h1>
                </div>
            </div>

            {/* YENİ: Sağ alta alt marka eklendi */}
            <div className="brand-bottom-right">Egepos</div>
        </div>
    );
};

export default CustomerDisplayPage;