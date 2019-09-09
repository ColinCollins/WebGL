// Modules to control application life and create native browser window
const { app, ipcMain } = require('electron');
const mainWindow = require('./scripts/rendererProcess/Renderer/mainWindow');
// nodejs module only could use in the mainjs
const fs = require('fs');

let AssetCtrl = require('./scripts/mainProcess/AssetsCtrl');

// Quick flush electron, but remember to note this before build package
require('electron-reload')(__dirname);

app.on('ready', mainWindow.createMainWindow);

const glslPath = `${__dirname}/glsl/`;
// sort excute and this process is async
ipcMain.on('init-start', (e) => {
    checkForFold(glslPath);

    let vshaderSource = fs.readFileSync(`${glslPath}vertex_LightMapTest.glsl`, { encoding: 'utf8' });
    let fshaderSource = fs.readFileSync(`${glslPath}fragment_LightMapTest.glsl`, { encoding: 'utf8' });

    let colorCubeVertexShaderSource = fs.readFileSync(`${glslPath}vertex_colorCube.glsl`, { encoding: 'utf8' });
    let colorCubeFragShaderSource = fs.readFileSync(`${glslPath}fragment_colorCube.glsl`, { encoding: 'utf8' });

    // init image
    AssetCtrl.preloadImagesPath();
    e.sender.send('load-relative-images', {
        imagesPath: AssetCtrl.imagesPath
    });

    // init shader
    e.sender.send('load-shader-source', {
        vshaderSource: vshaderSource,
        fshaderSource: fshaderSource,
        colorCubeVertexShaderSource: colorCubeVertexShaderSource,
        colorCubeFragShaderSource: colorCubeFragShaderSource
    });

});
// init all sprite success
ipcMain.on('sprite-init-finished', () => {

});

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