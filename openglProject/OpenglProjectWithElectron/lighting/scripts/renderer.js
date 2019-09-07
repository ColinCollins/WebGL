const { ipcRenderer } = require('electron');

main();
function main() {
    ipcRenderer.send('init-success');
}

ipcRenderer.on('load shader source', (e, sources) => {
    $('.tips').css('color', 'green').text("Ready");
    InitCanvas(sources);
});

function InitCanvas(sources) {
    window.canvas = $('#webgl')[0];
    window.canvasWidth = canvas.width;
    window.canvasHeight = canvas.Height;
    window.gl = getWebGLContext(canvas);
}