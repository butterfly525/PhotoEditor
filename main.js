const path = require('path');

const url = require('url');
const {
    app,
    BrowserWindow, Menu
} = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1500,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Необязательно, но может быть полезно для некоторых случаев использования
            enableRemoteModule: true, // Необязательно, но может быть полезно для некоторых случаев использования
        },
        icon: __dirname + "/images/website.png"
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    const menu = Menu.buildFromTemplate([])
    Menu.setApplicationMenu(menu)
 win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    })

}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
})