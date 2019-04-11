const Data = require('./data');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec2 a_TexCoord;\n' +
                    'attribute vec4 a_Normal;\n'+
                    'uniform mat4 u_ProjMatrix;\n'+
                    'varying vec2 v_TexCoord0;\n'+
                    'varying vec2 v_TexCoord1;\n'+
                    'void main () {\n' +
                    'gl_Position = u_ProjMatrix * a_Position; \n'+
                    'v_TexCoord0 = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform sampler2D u_Sampler0;\n'+
                    'varying vec2 v_TexCoord0;\n'+
                    'void main() {\n' +
                    'vec4 color = texture2D(u_Sampler0, v_TexCoord0);\n'+
                    'gl_FragColor = color;\n'+
                    '}\n';

window.onload = main;

let OFFSCREEN_WIDTH = 256;
let OFFSCREEN_HEIGHT = 256;

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    gl.enable(gl.DEPTH_TEST);

    let image = new Image();
    // onComplete 传入 image
    image.onload = onComplete;
    image.src = 'file:///E:/GitStone/WebGL/res/psb.jpg';

    let fbo = initFramebufferObject(gl);
    // 透视矩阵
    let viewProjMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(
        0.0, 2.0, 3.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    // framebufferObj 透视矩阵
    let viewProjMatrixFBO = new Matrix4().setPerspective(40.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
    viewProjMatrixFBO.lookAt(
        2.0, 3.0, 5.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    
    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    let u_Sampler0 = getUniformProp(gl, 'u_Sampler0');
    function onComplete () {
        console.log('src load complete.');
        initNewTexture(gl, u_Sampler0, image, 0);
        draw(gl, canvas, fbo, u_Sampler0, viewProjMatrix, viewProjMatrixFBO, indices);
    }
}

function initFramebufferObject (gl) {
    let frameBuffer, texture, depthBuffer;
    // create frameBuffer
    frameBuffer = gl.createFramebuffer();
    texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // 主要是因为 texImage2D 的传参不同，所以单独写了一份出来没有列入 initNewTexture, 但是可以精简合并的到时候
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    frameBuffer.texture = texture;

    // 创建渲染缓冲区对象，并且设置尺寸与参数
    depthBuffer=  gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    // 将纹理和渲染缓冲区对象关联到帧缓冲区对象上
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // 检查帧缓冲区是否设置正常
    let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (e !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('framebuffer init failed.');
        return;
    }

    return frameBuffer;
}

function draw (gl, canvas, fbo, u_Sampler, viewProjMatrix, viewProjMatrixFBO, indices) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    
    // 为帧缓冲区准备，实际上是指定了当前的对象的 width，height 上的 pixel 数量。
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    gl.clearColor(0.2, 0.2, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 绘制立方体
    drawTextureCube(gl, u_Sampler, viewProjMatrixFBO, indices);
    // 下面是实际 canvas 绘制
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // viewport 表示实际当前区域的 pixel 数量 
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 传入 texture piexl 数据
    drawTexturePlane(gl, u_Sampler, viewProjMatrix);
}

function drawTextureCube (gl, u_Sampler, viewProjMatrixFBO, indices) {
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_TexCoord0 = getAttribProp(gl, 'a_TexCoord');

    bindAttribData(gl, Data.initVerticesData(), a_Position, gl.FLOAT, 3);
    bindAttribData(gl, Data.initTexCoordVertex(), a_TexCoord0, gl.FLOAT, 2);

    let u_ProjMatrix = getUniformProp(gl, 'u_ProjMatrix');
    let modelMatrix = new Matrix4().setRotate(40.0, 0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_ProjMatrix, false, viewProjMatrixFBO.elements);
    gl.uniform1i(u_Sampler, 0);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function drawTexturePlane (gl, u_Sampler0, viewProjMatrix) {
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_TexCoord = getAttribProp(gl, 'a_TexCoord');

    let verticesTexCoords = initPlaneVertexBuffers();
    let size = verticesTexCoords.BYTES_PER_ELEMENT;
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    //  prop, (vec){Numer}, type, default(webgl), offset, initOffset
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 5, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, size * 5, size * 3);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);
    let u_ProjMatrix = getUniformProp(gl, 'u_ProjMatrix');
    gl.uniformMatrix4fv(u_ProjMatrix, false, viewProjMatrix.elements);

    gl.uniform1i(u_Sampler0, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);
}

function initNewTexture (gl, u_Sampler, image, num) {
    let texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, num);

    return texture;
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
// init the plane texture vertex
// init the plane texture vertex
function initPlaneVertexBuffers () {
    return new Float32Array([
        -0.5, 0.5, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0, 0.0,
        0.5, 0.5, 0.0, 1.0, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.0
    ]);
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