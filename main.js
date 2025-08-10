const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { PosPrinter } = require('electron-pos-printer');

// Eski GPU/Win7 uyumu için donanım hızlandırmayı kapatalım
app.disableHardwareAcceleration();

// Global referanslarımız
let mainWindow;
let customerWindow;

const userDataPath = app.getPath('userData');
const salesLogPath = path.join(userDataPath, 'sales-log.json');
const menuDataPath = path.join(userDataPath, 'menu-data.json');
const initialMenuPath = path.join(__dirname, 'src/data/menu.json');

function createWindows() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false, // frameless pencere
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = !app.isPackaged;
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist/index.html')}`; // base: './' olduğu için çalışır

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Müşteri ekranı
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0);

  if (externalDisplay) {
    customerWindow = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      width: externalDisplay.bounds.width,
      height: externalDisplay.bounds.height,
      frame: false,
      fullscreen: true,
      alwaysOnTop: true,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });
  } else {
    // İkinci ekran yoksa test için küçük pencere
    customerWindow = new BrowserWindow({
      width: 800,
      height: 600,
      parent: mainWindow,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });
  }

  const customerUrl = isDev
    ? 'http://localhost:5173/#/customer-display'
    : `file://${path.join(__dirname, 'dist/index.html')}#/customer-display`;

  customerWindow.loadURL(customerUrl);

  mainWindow.on('closed', () => {
    if (customerWindow) customerWindow.close();
  });
}

// İki pencere arası veri aktarımı
ipcMain.on('update-customer-display', (event, cartData) => {
  if (customerWindow) {
    customerWindow.webContents.send('cart-updated', cartData);
  }
});

ipcMain.on('print-receipt', (event, data) => {
  const printerName = 'EPSON TM-T20II';
  const options = {
    preview: true,
    margin: '0 0 0 0',
    copies: 1,
    printerName: printerName,
    timeOutPerLine: 400,
    silent: true
  };
  PosPrinter.print(data, options)
    .then(() => console.log('Yazdırma/Önizleme başarılı!'))
    .catch(error => console.error('Yazdırma/Önizleme hatası:', error));
});

ipcMain.on('log-sale', (event, saleData) => {
  try {
    let sales = [];
    if (fs.existsSync(salesLogPath)) {
      sales = JSON.parse(fs.readFileSync(salesLogPath, 'utf-8'));
    }
    sales.push(saleData);
    fs.writeFileSync(salesLogPath, JSON.stringify(sales, null, 2));
  } catch (error) {
    console.error('Satış dosyasına yazılırken hata oluştu:', error);
  }
});

ipcMain.handle('get-sales', async () => {
  try {
    if (fs.existsSync(salesLogPath)) {
      return JSON.parse(fs.readFileSync(salesLogPath, 'utf-8'));
    }
    return [];
  } catch (error) {
    console.error('Satış dosyası okunurken hata oluştu:', error);
    return [];
  }
});

ipcMain.handle('get-menu', async () => {
  try {
    if (fs.existsSync(menuDataPath)) {
      return JSON.parse(fs.readFileSync(menuDataPath, 'utf-8'));
    } else {
      const menuData = JSON.parse(fs.readFileSync(initialMenuPath, 'utf-8'));
      fs.writeFileSync(menuDataPath, JSON.stringify(menuData, null, 2));
      return menuData;
    }
  } catch (error) {
    console.error('Menü okunurken hata:', error);
    try {
      // son çare: yine paketten oku
      return JSON.parse(fs.readFileSync(initialMenuPath, 'utf-8'));
    } catch {
      return [];
    }
  }
});

ipcMain.on('update-menu', (event, newMenuData) => {
  try {
    fs.writeFileSync(menuDataPath, JSON.stringify(newMenuData, null, 2));
  } catch (error) {
    console.error('Menü dosyasına yazılırken hata oluştu:', error);
  }
});

ipcMain.on('window-close', event => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.on('window-minimize', event => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
