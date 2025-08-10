import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  // DÜZELTME 1: openCashDrawer fonksiyonu doğru yere, useEffect'in dışına taşındı.
  const openCashDrawer = () => {
    const drawerKickData = [{ type: 'cash' }];
    window.electron.ipcRenderer.send('print-receipt', drawerKickData);
    console.log("Kasa açma komutu gönderildi.");
  };

  // Sepet her değiştiğinde müşteri ekranını güncelle
  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const finalTotal = subtotal - discountAmount;

    window.electron.ipcRenderer.send('update-customer-display', {
        items: cartItems,
        subtotal,
        discountAmount,
        finalTotal
    });
  }, [cartItems, discount]); // DÜZELTME 2: useEffect'in kapanışı doğru bir şekilde yapıldı.

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) => {
        const itemInCart = prevItems.find((item) => item.id === itemId);
        if (itemInCart?.quantity === 1) {
            return prevItems.filter((item) => item.id !== itemId);
        }
        return prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
  };

  const applyDiscount = (percentage) => {
    setDiscount(percentage);
  };

  const clearDiscount = () => {
    setDiscount(0);
  };

  const completeSale = (paymentMethod) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const finalTotal = subtotal - discountAmount;
    
    const saleRecord = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cartItems,
        subtotal: subtotal,
        discountPercentage: discount,
        discountAmount: discountAmount,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod,
    };

    window.electron.ipcRenderer.send('log-sale', saleRecord);
    
    const receiptData = [
        { type: 'text', value: 'EGE POS', style: { fontWeight: "700", textAlign: 'center', fontSize: "24px"} },
        { type: 'text', value: `Tarih: ${new Date().toLocaleString('tr-TR')}`, style: {textAlign: 'center'} },
        { type: 'text', value: '--------------------------------', style: {}},
        ...cartItems.map(item => ({
            type: 'text',
            value: `${item.quantity} x ${item.name}`,
            style: {textAlign: 'left', fontSize: "16px"}
        })),
        { type: 'text', value: '--------------------------------', style: {}},
        { type: 'text', value: `ARA TOPLAM: ${subtotal.toLocaleString('tr-TR')} TL`, style: { textAlign: 'right', fontSize: "16px"} },
        ...(discount > 0 ? [{ type: 'text', value: `INDIRIM (%${discount}): -${discountAmount.toLocaleString('tr-TR')} TL`, style: { textAlign: 'right', fontSize: "16px"} }] : []),
        { type: 'text', value: `TOPLAM: ${finalTotal.toLocaleString('tr-TR')} TL`, style: { fontWeight: "700", textAlign: 'right', fontSize: "20px"} },
        { type: 'text', value: `Odeme: ${paymentMethod}`, style: { textAlign: 'right'} },
        { type: 'text', value: 'Afiyet Olsun!', style: { textAlign: 'center', marginTop: '10px', marginBottom: '10px'} },
    ];
    
    window.electron.ipcRenderer.send('print-receipt', receiptData);

    if (paymentMethod === 'Nakit') {
        setTimeout(openCashDrawer, 100);
    }

    clearCart();
  };


  const value = {
    cartItems,
    discount,
    addToCart,
    removeFromCart,
    clearCart,
    decreaseQuantity,
    completeSale,
    applyDiscount,
    clearDiscount,
    openCashDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};