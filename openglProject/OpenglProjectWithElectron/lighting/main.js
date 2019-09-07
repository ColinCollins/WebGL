// Modules to control application life and create native browser window
const { app, ipcMain } = require('electron');
const mainWindow = require('./scripts/Renderer/mainWindow');
// nodejs module only could use in the mainjs
const fs = require('fs');

// Quick flush electron, but remember to note this before build package
require('electron-reload')(__dirname);

app.on('ready', mainWindow.createMainWindow);

ipcMain.on('init-success', (e) => {
    let vshaderSource = fs.readFileSync(`${__dirname}/glsl/vertexShader.glsl`, { encoding: 'utf8' });
    let fshaderSource = fs.readFileSync(`${__dirname}/glsl/fragmentShader.glsl`, { encoding: 'utf8' });

    let lightVertexShaderSource = fs.readFileSync(`${__dirname}/glsl/lightCubeVertexShader.glsl`, { encoding: 'utf8' });
    let lightFragmentShaderSource = fs.readFileSync(`${__dirname}/glsl/lightCubeFragmentShader.glsl`, { encoding: 'utf8' });
    // 反向传递
    e.sender.send('load shader source', {
        vshaderSource: vshaderSource,
        fshaderSource: fshaderSource,
        lightVertexShaderSource: lightVertexShaderSource,
        lightFragmentShaderSource: lightFragmentShaderSource
    });

    console.log('send source to render');
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {

    if (mainWindow === null) {
        mainWindow.createMainWindow()
    }
})