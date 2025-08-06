import React, { createContext, useState, useContext, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  return useContext(MenuContext);
};

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuData = await window.electron.ipcRenderer.invoke('get-menu');
        setMenu(menuData);
      } catch (error) {
        console.error("Menü verisi alınırken hata:", error);
      }
    };
    fetchMenu();
  }, []);

  const updateMenu = (newMenu) => {
    setMenu(newMenu);
    window.electron.ipcRenderer.send('update-menu', newMenu);
  };

  const value = {
    menu,
    updateMenu,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};