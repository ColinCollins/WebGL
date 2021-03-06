(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const SHADOW_VSHADER_SOURCE = 
                            'attribute vec4 a_Position;\n'+
                            'uniform mat4 u_MvpMatrix;\n'+
                            'void main () { \n'+
                            'gl_Position = u_MvpMatrix * a_Position;\n'+
                            '}';

const SHADOW_FSHADER_SOURCE = 
                            'precision mediump float;\n'+
                            'void main () {\n'+
                            // 通过 gl_FragCoord 记录坐标系 z 轴。 gl_FragCoord 是内置变量，用于保存片元坐标
                            'gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);\n'+
                            '}\n';

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec4 a_Normal;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_MvpMatrixFromLight;\n'+
                    'varying vec4 v_PositionFromLight;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n'+
                    'v_Color = a_Color;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform sampler2D u_ShadowMap;\n'+
                    'varying vec4 v_PositionFromLight;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    // 归一化，计算当前对象的深度值，以及获取当前对象的纹理 uv 坐标. 公式是固定的，通过这种方式获取对象 0 ~ 1 内容
                    // (v_PositionFromLight.xyz / v_PositionFromLight.w) -> [-1, 1]
                    'vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;\n'+
                    'vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n'+
                    'float depth = rgbaDepth.r;\n'+
                    // 0.005 用于清除马赫带阴影绘制误差
                    'float visibility = (shadowCoord.z > depth) ? 0.7 : 1.0;\n'+
                    'gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n'+
                    '}\n';

window.onload = main;
let OFFSCREEN_WIDTH = 1024, OFFSCREEN_HEIGHT = 1024;
let LIGHT_X = 0.0;
let LIGHT_Y = 7.0;
let LIGHT_Z = 2.0;

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    // custom program
    gl.enable(gl.DEPTH_TEST);
    let shadowProgram = initShaders0(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
    let normalProgram = initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    //#region region-data
    // plane data
    let pVertexData = new Float32Array([
        2.5, 0.0, 2.5,
        -2.5, 0.0, 2.5,
        -2.5, 0.0, -2.5,
        2.5, 0.0, -2.5
    ]);
    let pColorData = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
    ]);
    let pIndexData = new Uint8Array([0, 1, 2,   0, 2, 3]);
    // tVertexData data
    let tVertexData = new Float32Array([
        -0.2, 3.0, -0.8,
        -1.0, 3.0, 1.0,
        1.0, 3.0, 1.0
    ]);
    let tColorData = new Float32Array([
        1.0, 0.5, 0.0, 1.0, 0.5, 0.0, 1.0, 0.0, 0.0
    ]);
    let tIndexData = new Uint8Array([0, 1, 2]);
    //#endregion
    
    // 初始化 缓冲区（FBO）
    let fbo = initFramebufferObject(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    let viewProjMatrixFromLight = new Matrix4(); // 为阴影贴图准备
    viewProjMatrixFromLight.setPerspective(40.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
    viewProjMatrixFromLight.lookAt(
        LIGHT_X, LIGHT_Y, LIGHT_Z,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    
    let viewProjMatrix = new Matrix4().setPerspective(45.0, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(
        0.0, 7.0, 9.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    // 当前旋转角度
    let currentAngle = 0.0;
    // 三角形矩阵
    let mvpMatrixFromLight_t = new Matrix4();
    // 投影平面矩阵
    let mvpMatrixFromLight_p = new Matrix4();

    normalProgram.u_ShadowMap = getUniformProp(gl, 'u_ShadowMap', normalProgram);
    normalProgram.a_Color = getAttribProp(gl, 'a_Color', normalProgram);
    normalProgram.u_MvpMatrixFromLight = getUniformProp(gl, 'u_MvpMatrixFromLight', normalProgram);

    let tick = function () {
        currentAngle = animate(currentAngle);
        // 将绘制目标切换成帧缓冲区
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        // 准备生成纹理贴图
        gl.useProgram(shadowProgram);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
        // 绘制操作生成纹理贴图
        drawTriangle(gl, shadowProgram, tVertexData, tIndexData, currentAngle, viewProjMatrixFromLight);
        mvpMatrixFromLight_t.set(g_mvpMatrix);
        drawPlane(gl, shadowProgram, pVertexData, pIndexData, viewProjMatrixFromLight);
        mvpMatrixFromLight_p.set(g_mvpMatrix);

       // 将绘制目标切换为颜色缓冲区
       gl.bindFramebuffer(gl.FRAMEBUFFER, null);
       gl.useProgram(normalProgram); // 正常绘制
       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
       gl.viewport(0, 0, canvas.width, canvas.height);
       // u_sampler
       gl.uniform1i(normalProgram.u_ShadowMap, 0); // 传递 gl.TEXTURE0
       bindAttribData(gl, tColorData, normalProgram.a_Color, gl.FLOAT, 3);
       // 传入 mvpMatrixFormLight
       gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);
       drawTriangle(gl, normalProgram, tVertexData, tIndexData, currentAngle, viewProjMatrix);
       mvpMatrixFromLight_t.set(g_mvpMatrix);
       bindAttribData(gl, pColorData, normalProgram.a_Color, gl.FLOAT, 3);
       gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
       drawPlane(gl, normalProgram, pVertexData, pIndexData, viewProjMatrix);
       mvpMatrixFromLight_p.set(g_mvpMatrix);
       window.requestAnimationFrame(tick, canvas);
    }
    tick();
}

let g_mvpMatrix = new Matrix4();

function drawTriangle (gl, program, data, indices, angle, mvpMatrix) {
    let a_Position = getAttribProp(gl, 'a_Position', program);
    bindAttribData(gl, data, a_Position, gl.FLOAT, 3);
    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program);
    let modelMatrix = new Matrix4().setRotate(angle, 0, 1.0, 0);
    mvpMatrix.multiply(modelMatrix);
    g_mvpMatrix.set(mvpMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    drawElement(gl, indices);
}

function drawPlane (gl, program, data, indices, mvpMatrix) {
    let a_Position = getAttribProp(gl, 'a_Position', program);
    bindAttribData(gl, data, a_Position, gl.FLOAT, 3);
    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program);
    g_mvpMatrix.set(mvpMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    drawElement(gl, indices);
}

function drawElement (gl, indices) {
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function initFramebufferObject (gl) {
    let framebuffer, texture, depthBuffer;
    framebuffer = gl.createFramebuffer();
    texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // texParameteri  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // make the texture catch more pixel
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    framebuffer.texture = texture;
    // 创建渲染缓冲区对象，设置参数与尺寸
    depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    // 声明存储空间
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    // 绑定 framebuffer and renderbuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);    
    if (e !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('framebuffer init failed');
        return;
    }
    return framebuffer;
}
// #region initShader
function initShaders0 (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);

    return initProgram(gl, vertexShader, fragShader);;
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

var angle_step = 5;
var last = +new Date();
function animate(angle) {
    var now = +new Date();
    var elapsed = now - last;
    last = now;
    var newAngle = angle + (angle_step*elapsed) / 60000.0;
    return newAngle % 360;
}

// bind Attribute data with indices
function bindAttribData (gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

function getAttribProp (gl, name, program) {
    let prop = gl.getAttribLocation(program, name);
    if (prop < 0) {
        console.error('attribute init failed.');
        return null;
    }
    return prop;
}

function getUniformProp (gl, name, program) {
    let prop = gl.getUniformLocation(program, name);
    if(!prop) {
        console.error('uniform init failed.');
        return null;
    }
    return prop;
}
},{}]},{},[1]);
