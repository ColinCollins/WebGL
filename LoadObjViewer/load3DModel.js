const fs = require('fs');

function loadOBJ (path) {
    let obj = {
        vertexData: null,
        normalData: null,
        textureData: null,
        // vertex, texture, normal f-> 数据 s index 索引 num
        indexData: null
    }

}
/**
 * Ns 高光权重
 * Ki 光学密度
 * d 透明度
 * illum 光照模型
 * Ka 环境光
 * Kd 漫反射
 * Ks 高光
 * new Matrix
 */
var mtl = {
    ambient: null,
    diffuse: null,
    highLight: null
}

function loadMTL (path) {
    let result = fs.readFileSync(path, {
        encoding: 'utf8'
    });

    let lines = result.match(/.+[\n\r]/g);
    for (let i = 0; i < lines.length; i++) {
        
    }
}

function loadTexture (path, callback) {
    if (!path || fs.existsSync(path)) {
        console.warn(`Can't find image res to load`);
        return null;
    }

    if (!callback) {
        console.warn(`Suggestting you to add a callback`);
        return;
    }

    let image = new Image();
    image.onload = function () {
        callback(image);    
    }

    image.src = path;
}