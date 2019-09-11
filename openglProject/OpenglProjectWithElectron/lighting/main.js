// Modules to control application life and create native browser window
const { app, ipcMain } = require('electron');
const mainWindow = require('./scripts/rendererProcess/Renderer/mainWindow');

let AssetCtrl = require('./scripts/mainProcess/AssetsCtrl');


// Quick flush electron, but remember to note this before build package
require('electron-reload')(__dirname);

app.on('ready', mainWindow.createMainWindow);

// sort excute and this process is async
ipcMain.on('init-start', (e) => {
    // init image
    let images = AssetCtrl.preloadImagesRes();
    // imagesPath => []
    e.sender.send('load-images', {
        imagesData: images
    });

    let shaders = AssetCtrl.preloadShaderRes();
    // init shader
    e.sender.send('load-shader-source', {
       shaderSources: shaders
    });
});

// init all texture success
ipcMain.on('texture-init-finished', (e) => {
    AssetCtrl.imagesInit = true;
    checkInitSuccess(e);
});

ipcMain.on('shader-init-finished', (e) => {
    AssetCtrl.shaderInit = true;
    checkInitSuccess(e);
});

// init success
function checkInitSuccess (e) {
    if (AssetCtrl.imagesInit && AssetCtrl.shaderInit) {
        e.sender.send('init-success');
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {

    if (mainWindow === null) {
        mainWindow.createMainWindow()
    }
});