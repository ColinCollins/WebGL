const { ipcRenderer } = require('electron');
const Shader = require('./Assets/shaderObj');
const Sprite = require('./Assets/spriteObj');

main();
function main() {
    ipcRenderer.send('init-start');
}

ipcRenderer.on('load-shader-source', (e, sources) => {
    InitGL();
    new Shader()
});

function InitGL() {
    window.canvas = $('#webgl')[0];
    window.canvasWidth = canvas.width;
    window.canvasHeight = canvas.Height;
    window.gl = getWebGLContext(canvas);
}

// 这里也可以用闭包的写法进行尝试
/* ipcRenderer.on('load-relative-res', (e, sources) => {
    let imagesCount = sources.imagesPath.length;

    // close 
    function closePackTest () {
        let finishedCount = 0;
        checkForFinished(++finishedCount, imageCount);
    }

    for (var i = 0; i < imagesCount; i++) {
        let image = new Image();
        image.onload = closePackTest;
        image.src = sources.imagesPath[i];
    }
}); */

let images = [];
ipcRenderer.on('load-relative-images', (e, sources) => {
    let imagesCount = sources.imagesPath.length;
    let finishedCount = 0;

    for (var i = 0; i < imagesCount; i++) {
        let image = new Image();
        image.onload = () => {
            checkForFinished(++finishedCount, imageCount);
        };
        image.src = sources.imagesPath[i];
    }
});

function checkForFinished (curCount, maxCount) {
    if (curCount == maxCount) {
        console.log(`load finished`);
        ipcRenderer.send('sprite-init-finished');
    }

    return;
}


ipcRenderer.on('init-success', (e) => {
    $('.tips').css('color', 'green').text("Ready");
    // res loading for ready and relative
});