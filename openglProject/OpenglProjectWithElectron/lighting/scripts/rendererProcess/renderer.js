const { ipcRenderer } = require('electron');
const menu = require('../windowUtil/menu');

main();
function main() {
    ipcRenderer.send('init-start');
    menu.initMenuButton();
}
// glsl 加载
ipcRenderer.on('load-shader-source', (e, sources) => {
    InitGL();

    sources.shaderSources.forEach( value => {
        new Program(value.name, value.vShaderSource, value.fShaderSource);
    });

    ipcRenderer.send('shader-init-finished');
});

function InitGL() {
    window.canvas = $('#webgl')[0];
    window.canvasWidth = canvas.width;
    window.canvasHeight = canvas.Height;
    window.gl = getWebGLContext(canvas);
}

// 这里也可以用闭包的写法进行尝试
/*
    ipcRenderer.on('load-images', (e, sources) => {
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
    });
*/

// image 加载
ipcRenderer.on('load-images', (e, sources) => {
    let imagesCount = sources.imagesData.length;
    let images = sources.imagesData;
    // 不确定 image 是否会被替代
    for (var i = 0; i < imagesCount; i++) {
        new rawTexture(images[i].name, images[i].src, checkForFinished);
    }
});

function checkForFinished (curCount, maxCount) {
    if (curCount == maxCount) {
        console.log(`load finished`);
        ipcRenderer.send('texture-init-finished');
    }

    return;
}


ipcRenderer.on('init-success', (e) => {
    $('.tips').css('color', 'green').text("Ready");
});