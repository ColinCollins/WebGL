let globby = require('globby');
let path = require('path')
const fs = require('fs');
let mainUtils = require('./mainProcessUtils');

// image
exports.imagesInit = false;

function imageObj (name, src) {
    this.name = name;
    this.src = src;
}

// need callback
exports.preloadImagesRes = function preloadImagesRes () {
    let paths = globby.sync([`./res/**/*.png`, `./res/**/*.jpg`], {
        absolute: true
    });
    for (let i = 0; i < paths.length; i++) {
        let data = path.parse(paths[i]);
        paths[i] = new imageObj(data.name, paths[i]);
    }

    return paths;
}

exports.textsInit = false;
// ----



exports.shaderInit = false;
const glslPath = `${process.cwd()}/glsl/`;

function shaderObj (name, vShaderSource, fShaderSource) {
    this.name = name;
    this.vShaderSource = vShaderSource;
    this.fShaderSource = fShaderSource;
}

exports.preloadShaderRes = function () {
    mainUtils.checkFoldExist(glslPath);
    let paths = globby.sync('./glsl/', {absolute: true});
    let shaderMap = new Map();

    for (let i = 0; i < paths.length; i++) {
        let data = path.parse(paths[i]);
        let name = path.basename(data.dir);

        if (!shaderMap.has(name)) {
            shaderMap.set(name, new shaderObj(name));
        }

        if (data.name.match(/vertex/)) {
            shaderMap.get(name).vShaderSource = fs.readFileSync(paths[i], {encoding: 'utf8'});
        }

        if (data.name.match(/fragment/)) {
            shaderMap.get(name).fShaderSource = fs.readFileSync(paths[i], {encoding: 'utf8'});
        }
    }

    // electron 传递 map 无法在 ipcRender 获取
    let shaders = [];
    shaderMap.forEach( (value, key, map) => {
        shaders.push(value);
    });

    return shaders;
}