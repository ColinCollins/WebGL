(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function initIndexData () {
    return new Uint8Array([
        0, 1, 2, 0, 2, 3,   // front
        4, 5, 6, 4, 6, 7,   // right
        8, 9, 10, 8, 10, 11,    // top
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // bottom
        20, 21, 22, 20, 22, 23  // back
    ]);
}

function initNormalizeData () {
    return new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    ]);
}

function initVertexColorData () {
    return new Float32Array([
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
    ]);
}

function initVertices () {
    return new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);
}

function initTexCoordVertices () {
    return new Float32Array([
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ]);
}

module.exports = {
    initIndexData: initIndexData,
    initVerticesData: initVertices,
    initColorData: initVertexColorData,
    initNormalizeData: initNormalizeData,
    initTexCoordVertex: initTexCoordVertices
}
},{}],2:[function(require,module,exports){
const Data = require('./data');

window.onload = main;

// 从页面获取需要定义全路径
const vertexShaderFile = 'D:\\GitStone\\WebGL\\openglProject\\LightMaps\\glsl\\vertexShader.glsl';
const fragmentShaderFile = 'D:\\GitStone\\WebGL\\openglProject\\LightMaps\\glsl\\fragmentShader.glsl';
let canvas = document.getElementById('webgl');
function main() {
    let gl = getWebGLContext(canvas);
    new Promise(function (resolve, reject) {
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


// init scene

function initScene (obj) {
    let program = null;
    let gl = obj.gl;

    if (obj.vertexShader && obj.fragShader) {
        program = initProgram(gl, obj.vertexShader, obj.fragShader);
        console.log(program);
    }
    else {
        console.error(`Scene init failed`);
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    // attribute
    program.a_Position = getAttribProp(gl, program, 'a_Position');
    program.a_Normal = getAttribProp(gl, program, 'a_Normal');

    // uniform
    program.u_MvpMatrix = getUniformProp(gl, program, 'u_MvpMatrix');
    program.u_ModelMatrix = getUniformProp(gl, program, 'u_ModelMatrix');
    program.u_NormalMatrix = getUniformProp(gl, program, 'u_NormalMatrix');
    program.u_ViewPosition = getUniformProp(gl, program, 'u_ViewPosition');
    program.u_LightColor = getUniformProp(gl, program, 'u_LightColor');
    // material
    program.u_material = {
        ambient: getUniformProp(gl, program, 'u_material.ambient'),
        diffuse: getUniformProp(gl, program, 'u_material.diffuse'),
        specular: getUniformProp(gl, program, 'u_material.specular'),
        shininess: getUniformProp(gl, program, 'u_material.shininess')
    };

    // light
    program.u_light = {
        position: getUniformProp(gl, program, 'u_light.position'),
        ambient: getUniformProp(gl, program, 'u_light.ambient'),
        diffuse: getUniformProp(gl, program, 'u_light.diffuse'),
        specular: getUniformProp(gl, program, 'u_light.specular')
    };

    bindAttribData(gl, Data.initVerticesData(), program.a_Position, gl.FLOAT, 3);
    bindAttribData(gl, Data.initNormalizeData(), program.a_Normal, gl.FLOAT, 3);
    // set material
    gl.uniform3fv(program.u_material.ambient, new Vector3([1.0, 0.5, 0.31]).elements);
    gl.uniform3fv(program.u_material.diffuse, new Vector3([1.0, 0.5, 0.31]).elements)
    gl.uniform3fv(program.u_material.specular, new Vector3([0.5, 0.5, 0.5]).elements);
    gl.uniform1f(program.u_material.shininess, 20.0);
    // matrix
    let mvpMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 0.1, 100);
    mvpMatrix.lookAt(
        2.0, 5.0, 15.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    let modelMatrix, tempMatrix, normalMatrix = null;

    rotate(gl, program, 40.0, mvpMatrix, modelMatrix, tempMatrix, normalMatrix);
    // view position
    gl.uniform3fv(program.u_ViewPosition, new Vector3([2.0, 5.0, 15.0]).elements);

    // bind index data
    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // set light
    let lightColor = new Vector3([1.0, 1.0, 1.0]);
    let diffuse = new Vector3([1.0, 1.0, 1.0]);
    let ambient = new Vector3([1.0, 0.5, 0.31]);
    let specular = new Vector3([1.0, 1.0, 1.0]);

    gl.uniform3fv(program.u_light.position, new Vector3([0, 2.0, 5.0]).elements);
    gl.uniform3fv(program.u_light.diffuse, diffuse.elements);
    gl.uniform3fv(program.u_light.ambient, ambient.elements);
    gl.uniform3fv(program.u_light.specular, specular.elements);

    gl.uniform3fv(program.u_LightColor, lightColor.elements);

    let lastTime = new Date();
    let angle_step = 30.0;
    let angle = 0;
    function tick() {
        let currentTime = new Date();
        let elapseTime = (currentTime - lastTime) / 5000;
        angle = angle + (angle_step * elapseTime) * 20;
        lastTime = currentTime;

        rotate(gl, program, angle, mvpMatrix, modelMatrix, tempMatrix, normalMatrix);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
        // gl.clear(gl.COLOR_BIT_BUFFER);
        window.requestAnimationFrame(tick);
    }

    tick();
}

function rotate (gl, program, angle, mvpMatrix, modelMatrix, tempMatrix, normalMatrix) {
    modelMatrix = new Matrix4().setScale(3, 3, 3).rotate(angle, 0.0, 1.0, 0.0);
    tempMatrix = new Matrix4().set(mvpMatrix).multiply(modelMatrix);
    normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();

    gl.uniformMatrix4fv(program.u_MvpMatrix, false, tempMatrix.elements);
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);
}
},{"./data":1}]},{},[2]);
