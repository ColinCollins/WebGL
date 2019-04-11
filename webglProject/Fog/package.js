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

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec4 a_Normal;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'uniform vec3 u_Eye;\n'+    // The eye  point (world coordinates)
                    'uniform vec3 u_LightPosition;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying float v_Dist;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'vec3 vertexPosition = normalize(vec3(u_LightPosition - vec3(u_ModelMatrix * a_Position)));\n'+
                    'vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+
                    'float nDotL = max(dot(vertexPosition, normal), 0.0);\n'+
                    'vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n'+
                    'vec3 ambient = u_AmbientLight * a_Color.rgb;\n'+
                    'v_Dist = distance(vec3(u_ModelMatrix * a_Position), u_Eye);\n'+
                    'v_Color = vec4(diffuse + ambient, a_Color.a);\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec3 u_FogColor;\n'+
                    'uniform vec2 u_FogDist;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying float v_Dist;\n'+
                    'void main() {\n' +
                    'float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y, u_FogDist.x), 0.0, 1.0);\n'+
                    'vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);\n'+
                    'gl_FragColor = vec4(color, v_Color.a);\n'+
                    '}\n';

window.onload = main;
let ANGLE_STEP = 2;
let angle = 40.0;

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    gl.enable(gl.DEPTH_TEST);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    let a_Normal = getAttribProp(gl, 'a_Normal');

    let u_LightPosition = getUniformProp(gl, 'u_LightPosition');
    gl.uniform3fv(u_LightPosition, new Vector3([30.0, 67.0, 25.0]).elements);

    let u_LightColor = getUniformProp(gl, 'u_LightColor');
    gl.uniform3fv(u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);

    let u_AmbientLight = getUniformProp(gl, 'u_AmbientLight');
    gl.uniform3fv(u_AmbientLight, new Vector3([0.4, 0.4, 0.4]).elements);

    let u_FogColor = getUniformProp(gl, 'u_FogColor');
    let u_FogDist = getUniformProp(gl, 'u_FogDist');
    let u_Eye = getUniformProp(gl, 'u_Eye');

    let fogColor = new Float32Array([247 / 255, 220 / 255, 111 / 255]);
    let fogDist = new Float32Array([55, 80]); // ??
    let eye = new Float32Array([25, 65, 35]);
    gl.uniform3fv(u_FogColor, fogColor);
    gl.uniform2fv(u_FogDist, fogDist);
    gl.uniform3fv(u_Eye, eye);
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');
    let mvpMatrix = new Matrix4().setPerspective(80.0, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(
        eye[0], eye[1], eye[2],
        0.0, 2.0, 0.0,
        0.0, 1.0, 0.0
    );

    let u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix');
    let modelMatrix = new Matrix4().setScale(10, 10, 10).rotate(angle, 1.0, 0.0, 0.0);
    let tempMatrix = new Matrix4().set(mvpMatrix);
    tempMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, tempMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    let u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix');
    let normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    bindAttribData(gl, Data.initVerticesData(), a_Position, gl.FLOAT, 3);
    bindAttribData(gl, Data.initColorData(), a_Color, gl.FLOAT, 3);
    bindAttribData(gl, Data.initNormalizeData(), a_Normal, gl.FLOAT, 3);

    // create the indices
    let indices = initIndexBuffer(gl);
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);

    document.onkeydown = function (event) {
        keydown(event, gl, u_FogDist, fogDist);
        modelMatrix = new Matrix4().setScale(10, 10, 10).rotate(angle, 1.0, 0.0, 0.0);
        let tempMatrix = new Matrix4().set(mvpMatrix);
        tempMatrix.multiply(modelMatrix);

        gl.uniformMatrix4fv(u_MvpMatrix, false, tempMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        normalMatrix.setInverseOf(modelMatrix).transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
        gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    }
}

function keydown (event, gl, u_FogDist, fogDist) {
    switch (event.keyCode) {
        case 40:
        // Down Arrow
            fogDist[1] -= ANGLE_STEP;
            break;
        case 37:
        // Left Arrow
            fogDist[0] -= ANGLE_STEP;
            break;
        case 38:
        // Up Arrow
            fogDist[1] += ANGLE_STEP;
            break;
        case 39:
        // Right Arrow
            fogDist[0] += ANGLE_STEP;
            break;
        case 81:
        // Q
            angle -= ANGLE_STEP;
            break;
        case 69:
        // E
            angle += ANGLE_STEP;
            break;
    }
    console.log(angle);
    gl.uniform2fv(u_FogDist, fogDist);
}

function initIndexBuffer (gl) {
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    let indices = Data.initIndexData();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indices;
}

function initShaders0 (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);

    let flag = initProgram(gl, vertexShader, fragShader);
    if (!flag) {
        console.error('init Shader error');
        return false;
    }
    return true;
}

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
        return false;
    }

    gl.validateProgram(program);
    let validated = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    if (!validated) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`int program validate error: ${msg}`);
        return false;
    }

    gl.useProgram(program);
    gl.program = program;
    return true;
}



// bind Attribute data with indices
function bindAttribData (gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

function getAttribProp (gl, name) {
    let prop = gl.getAttribLocation(gl.program, name);
    if (prop < 0) {
        console.error('attribute init failed.');
        return null;
    }
    return prop;
}

function getUniformProp (gl, name) {
    let prop = gl.getUniformLocation(gl.program, name);
    if(!prop) {
        console.error('uniform init failed.');
        return null;
    }
    return prop;
}
},{"./data":1}]},{},[2]);
