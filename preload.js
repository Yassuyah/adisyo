// Güvenli köprü: Renderer <-> Main
// Win7/Win10 uyumu için ek bir şey yapmana gerek yok; contextIsolation açık.

const { contextBridge, ipcRenderer } = require('electron')

// Sık kullanılan pencere aksiyonları
contextBridge.exposeInMainWorld('api', {
  closeApp:    () => ipcRenderer.send('window-close'),
  minimizeApp: () => ipcRenderer.send('window-minimize')
})

// İzin verilen kanallar (whitelist)
const SEND_CHANNELS = [
  'print-receipt',
  'log-sale',
  'update-menu',
  'update-customer-display'
]

const INVOKE_CHANNELS = [
  'get-sales',
  'get-menu'
]

const ON_CHANNELS = [
  'cart-updated' // müşteri ekranına veri akışı
]

// Renderer tarafına güvenli bir ipc API yüzeyi veriyoruz.
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    // .send(channel, data)
    send: (channel, data) => {
      if (SEND_CHANNELS.includes(channel)) {
        ipcRenderer.send(channel, data)
      } else {
        // Sessizce yutmak yerine istersen console.warn bırakabilirsin
        // console.warn('[preload] send: blocked channel', channel)
      }
    },

    // .invoke(channel, ...args) -> Promise
    invoke: (channel, ...args) => {
      if (INVOKE_CHANNELS.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args)
      } else {
        // console.warn('[preload] invoke: blocked channel', channel)
        return Promise.reject(new Error(`Blocked IPC invoke on channel: ${channel}`))
      }
    },

    // .on(channel, listener)
    on: (channel, listener) => {
      if (ON_CHANNELS.includes(channel)) {
        const subscription = (_event, ...args) => listener(...args)
        ipcRenderer.on(channel, subscription)
        // Aboneliği sonradan kaldırabilmek için bir "unsubscribe" döndürelim
        return () => {
          ipcRenderer.removeListener(channel, subscription)
        }
      } else {
        // console.warn('[preload] on: blocked channel', channel)
        return () => {}
      }
    },

    // İsteğe bağlı: tek seferlik dinleyici
    once: (channel, listener) => {
      if (ON_CHANNELS.includes(channel)) {
        ipcRenderer.once(channel, (_event, ...args) => listener(...args))
      }
    },

    // İsteğe bağlı: dinleyici kaldırma
    removeListener: (channel, listener) => {
      if (ON_CHANNELS.includes(channel)) {
        ipcRenderer.removeListener(channel, listener)
      }
    }
  }
})
