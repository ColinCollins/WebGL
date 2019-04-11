const Data = require('./data');

window.onload = main;
const vertexShaderFile = 'E:\\GitStone\\WebGL\\Material\\glsl\\vertexShader.glsl';
const fragmentShaderFile = 'E:\\GitStone\\WebGL\\Material\\glsl\\fragmentShader.glsl';

let canvas = document.getElementById('webgl');
function main() {
    let gl = getWebGLContext(canvas);
    let p = new Promise(function (resolve, reject) {
        let obj = {
            gl: gl,
            vertexType: gl.VERTEX_SHADER,
            fragType: gl.FRAGMENT_SHADER,
            vertexFilePath: vertexShaderFile,
            fragFilePath: fragmentShaderFile,
            vertexShader: null,
            fragShader: null
        }
        resolve(obj);
    })
    .then(readVertexShaderFile)
    .then(readFragmentShaderFile)
    .then(initScene)
    .catch(function (reason) {
        console.log(`Failed: ${reason}`);
    });
}
// 考虑不同的图形需要不同的 program, 目前以实现效果优先，不要求切换 program，烦
function initScene (obj) {
    let program = null
    let gl = obj.gl;
    if (obj.vertexShader && obj.fragShader) {
        program = initProgram(gl, obj.vertexShader, obj.fragShader);
        console.log(program);
    }
    else {
        console.error(`Scene init failed`);
        return;
    }
    // custom code
}

// 不需要 server
function readVertexShaderFile (obj) {
    let request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState === 4 ) {
                if( request.status !== 404) {
                    obj.vertexShader = loadShader(obj.gl, obj.vertexType, request.responseText);
                    resolve(obj);
                }
                else {
                    reject(request.status);
                }
            }
        }
        request.open('GET', obj.vertexFilePath); // get 请求
        request.send();
    });
}

function readFragmentShaderFile (obj) {
    let request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
            if (request.readyState === 4 ) {
                if( request.status !== 404) {
                    obj.fragShader = loadShader(obj.gl, obj.fragType, request.responseText);
                    resolve(obj);
                }
                else {
                    reject(request.status);
                }
            }
        }
        request.open('GET', obj.fragFilePath); // get 请求
        request.send();
    });
}
// #region shader
function loadShader (gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // 解析
    let compiled  = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let msg = gl.getShaderInfoLog(shader);
        console.log(`shader init Error: ${msg}`);
        return;
    }
    let shaderTarget = gl.getShaderParameter(shader, gl.SHADER_TYPE);
    if (shaderTarget) console.log(`shader init: ${shaderTarget}`);
    return shader;
}

function initProgram (gl, vertexShader, fragShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`init program link error: ${msg}`);
        return null;
    }

    gl.validateProgram(program);
    let validated = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    if (!validated) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`int program validate error: ${msg}`);
        return null;
    }

    gl.useProgram(program);
    gl.program = program;

    return program;
}
// #endregion

// bind Attribute data with indices
function bindAttribData (gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

function getAttribProp (gl, program, name) {
    let prop = gl.getAttribLocation(program, name);
    if (prop < 0) {
        console.error('attribute init failed.');
        return null;
    }
    return prop;
}

function getUniformProp (gl, program, name) {
    let prop = gl.getUniformLocation(program, name);
    if(!prop) {
        console.error('uniform init failed.');
        return null;
    }
    return prop;
}