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
    gl.enable(gl.DEPTH_TEST);
    program.a_Position = getAttribProp(gl, program, 'a_Position');
    program.a_Normal = getAttribProp(gl, program, 'a_Normal');
    // uniform
    program.u_MvpMatrix = getUniformProp(gl, program, 'u_MvpMatrix');
    program.u_ModelMatrix = getUniformProp(gl, program, 'u_ModelMatrix');
    program.u_NormalMatrix = getUniformProp(gl, program, 'u_NormalMatrix');
    program.u_ViewPosition = getUniformProp(gl, program, 'u_ViewPosition');
    // light
    program.u_material = {
        ambient: getUniformProp(gl, program, 'u_material.ambient'),
        diffuse: getUniformProp(gl, program, 'u_material.diffuse'),
        specular: getUniformProp(gl, program, 'u_material.specular'),
        shininess: getUniformProp(gl, program, 'u_material.shininess')
    };
    program.u_light = {
        position: getUniformProp(gl, program, 'u_light.position'),
        ambient: getUniformProp(gl, program, 'u_light.ambient'),
        diffuse: getUniformProp(gl, program, 'u_light.diffuse'),
        specular: getUniformProp(gl, program, 'u_light.specular')
    }

    bindAttribData(gl, Data.initVerticesData(), program.a_Position, gl.FLOAT, 3);
    bindAttribData(gl, Data.initNormalizeData(), program.a_Normal, gl.FLOAT, 3);

    gl.uniform3fv(program.u_light.position, new Vector3([0, -2.0, 10.0]).elements);
    gl.uniform3fv(program.u_material.ambient, new Vector3([1.0, 0.5, 0.31]).elements);
    gl.uniform3fv(program.u_material.diffuse, new Vector3([1.0, 0.5, 0.31]).elements)
    gl.uniform3fv(program.u_material.specular, new Vector3([0.5, 0.5, 0.5]).elements);

    let mvpMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 0.1, 100);
    mvpMatrix.lookAt(
        2.0, 5.0, 15.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );

    let modelMatrix = new Matrix4().setScale(3, 3, 3).rotate(40.0, 0.0, 1.0, 0.0);
    let tempMatrix = new Matrix4().set(mvpMatrix).multiply(modelMatrix);
    let normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();

    gl.uniformMatrix4fv(program.u_MvpMatrix, false, tempMatrix.elements);
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);
    gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);

    gl.uniform3fv(program.u_ViewPosition, new Vector3([2.0, 5.0, 15.0]).elements);

    // indices
    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    let lastTime = new Date();
    let step1 = 0;
    let step2 = 0;
    let step3 = 0;
    let shininess = 0;
    let angle = 0.0, angle_step = 30;
    // 执行。。。
    function tick () {
        let currentTime = new Date();
        let elapseTime = (currentTime - lastTime) / 5000;
        angle = angle + (angle_step * elapseTime) * 30;
        //console.log(elapseTime);
        lastTime = currentTime;
        step1 += elapseTime * 2.0;
        step2 += elapseTime * 0.7;
        step3 += elapseTime * 1.3;
        shininess += elapseTime * 10;
        let red = Math.sin(step1);
        let green = Math.sin(step2);
        let blue = Math.sin(step3);
        let color = new Vector3([red, green, blue]);
        let diffuseColor = new Vector3([red * 0.5, green * 0.5, blue * 0.5]);
        let ambientColor = new Vector3([red * 0.1, green * 0.1, blue * 0.1]);
        gl.uniform1f(program.u_material.shininess, shininess  % 72);
        // 降低
        gl.uniform3fv(program.u_light.ambient, diffuseColor.elements);
        gl.uniform3fv(program.u_light.diffuse, ambientColor.elements);
        gl.uniform3fv(program.u_light.specular, new Vector3([1.0, 1.0, 1.0]).elements);

        modelMatrix = new Matrix4().setScale(3, 3, 3).rotate(angle, 0.0, 1.0, 0.0);
        tempMatrix = new Matrix4().set(mvpMatrix).multiply(modelMatrix);
        normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();

        gl.uniformMatrix4fv(program.u_MvpMatrix, false, tempMatrix.elements);
        gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);
        gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);

        //console.log(`${red}: ${green}: ${blue}`);
        gl.uniform3fv(program.u_LightColor, color.elements);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
        gl.clear(gl.COLOR_BIT_BUFFER);
        window.requestAnimationFrame(tick);
    }
    tick();
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

const latitudeBands = 30;  // 纬线
const longitudeBands = 30; // 经线
// radius = 1;
const radius = 2;
// normals 
function createSphere (points, normals, textureMap) {
    for (let i = 0; i <= latitudeBands; i++) {
        // 计算 theta 角度
        let theta = i * Math.PI / latitudeBands;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);
        for (let j = 0; j <= longitudeBands; j++) {
            let phi = j * 2 * Math.PI / longitudeBands;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            // 计算 x, y, z
            let x = radius * cosPhi * sinTheta;
            let y = radius * cosTheta;
            let z = radius * sinPhi * sinTheta;

            // 根据经纬度获取 uv
            let u = j / longitudeBands;
            let v = i / latitudeBands;

            points.push(x);
            points.push(y);
            points.push(z);

            textureMap.push(u);
            textureMap.push(v);
        }
    }
    // 单独计算 Normal， 以一个 triangle ABC 为单位， 从 points 中获取需要的顶点信息，叉积公式计算法向量方向，相同一个面要记录相同的法向量。
    // 计算一次传入四次, 利用对边计算 cross, Vector3 不存在 cross 函数，需要后续的补充

    // not finished
    /* for (let i = 0; i < points.length; i++) {

    } */

    let indexData = [];
    for (let i = 0; i < latitudeBands; i++) {
        for (let j = 0; j < longitudeBands; j++) {
            let A = (i * (longitudeBands + 1)) + j;
            // 下一行
            let B = A + longitudeBands + 1;
            let C = A + 1;
            let D = B + 1;

            indexData.push(A);
            indexData.push(B);
            indexData.push(C);
            // 保持逆时针，绘制同向
            indexData.push(B);
            indexData.push(D);
            indexData.push(C);
        }
    }

    return indexData;
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
},{"./data":1}]},{},[2]);
