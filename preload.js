const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  closeApp:    () => ipcRenderer.send('window-close'),
  minimizeApp: () => ipcRenderer.send('window-minimize')
})

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // Yeni 'update-customer-display' kanalını ekledik
      let validChannels = ['print-receipt', 'log-sale', 'update-menu', 'update-customer-display'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    invoke: (channel) => {
      let validChannels = ['get-sales', 'get-menu'];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel);
      }
    },
    // YENİ: Müşteri ekranının dinleyeceği kanal
    on: (channel, func) => {
      let validChannels = ['cart-updated'];
      if (validChannels.includes(channel)) {
        // Güvenlik için sadece veriyi gönderiyoruz, event objesini değil
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  },
});