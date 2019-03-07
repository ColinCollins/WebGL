let OBJDoc = require('./OBJDoc');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Normal;\n'+
                    'attribute vec4 a_Color;\n'+
                    'attribute vec2 a_TexCoord;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    '   vec3 lightDirection = vec3(-0.35, 0.35, 0.87);\n'+
                    '   gl_Position = u_MvpMatrix * a_Position; \n'+
                    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+
                    '   float nDotL = max(dot(normal, lightDirection), 0.0);\n'+
                    '   v_Color = vec4(a_Color.rgb * nDotL, a_Color.a);\n'+
                    '   v_TexCoord = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'varying vec4 v_Color;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'void main() {\n' +
                    'vec4 color = texture2D(u_Sampler, v_TexCoord);\n'+
                    'gl_FragColor = color * v_Color;\n'+
                    '}\n';

window.onload = main;
const objPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark_42.obj';
const texPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\maps\\42.png';

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    let program = initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE)
    gl.enable(gl.DEPTH_TEST);
    // custom program
    program.a_Position = getAttribProp(gl, 'a_Position', program);
    program.a_Normal = getAttribProp(gl, 'a_Normal', program);
    program.a_Color = getAttribProp(gl, 'a_Color', program);
    program.a_TexCoord = getAttribProp(gl, 'a_TexCoord', program);

    // uniform
    program.u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program);
    program.u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix', program);
    program.u_Sampler = getUniformProp(gl, 'u_Sampler', program);

    let model = initVertexBuffers(gl, program);
    if (!model) {
        console.log(`Can't ready the empty cache area`);
        return;
    }

    let viewProjMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(
        0.0, 20.0, 20.0,
        0.0, 10.0, 0.0,
        0.0, 1.0, 0.0
    );
    // add image loading

    let image = new Image();
    image.src = texPath;
    image.onload = function () {
        initTexture(gl, program, image);
        // 处理数据, 并将数据写入缓冲区
        readOBJFile(objPath, 10, true);

        let currentAngle = 0.0;
        let tick = function () {
            currentAngle = animate(currentAngle);
            draw(gl, gl.program, currentAngle, viewProjMatrix, model);
            requestAnimationFrame(tick);
        }
        tick();
    }
}

function initTexture (gl, program, image) {
    let texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(program.u_Sampler, 0);
}

let g_modelMatrix = new Matrix4();
let g_mvpMatrix = new Matrix4();
let g_normalMatrix = new Matrix4();
// model
function draw (gl, program, angle,  viewProjMatrix, model) {
    // 判断数据文件 obj mtl 完全解析
    if (g_objDoc !== null && g_objDoc.isMTLComplete()) {
        g_drawingInfo = onReadComplete(gl, model, g_objDoc);
        g_objDoc = null;
    }

    if (!g_drawingInfo) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 设置旋转
    g_modelMatrix.setRotate(angle, 0.0, 1.0, 0.0);
    //    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
    //    g_modelMatrix.rotate(angle, 0.0, 0.0, 1.0);

    // 计算 normal
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function initVertexBuffers (gl, program) {
    let o = new Object();
    o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
    o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
    o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
    o.texBuffer = createEmptyArrayBuffer(gl, program.a_TexCoord, 2, gl.FLOAT);
    o.indexBuffer = gl.createBuffer();

    return o;
}

function createEmptyArrayBuffer (gl, a_attribute, num, type) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return buffer;
}

function readOBJFile (fileName, scale, reverse) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 404) {
            onReadOBJFile(request.responseText, fileName, scale, reverse);
        }
    }
    request.open('GET', fileName, true); // get 请求
    request.send();
}

let g_objDoc = null; // OBJ 文件中的文本
let g_drawingInfo = null; // 用以绘制三维模型信息

function onReadOBJFile (fileString, fileName, scale, reverse) {
    let objDoc = new OBJDoc(fileName); // 创建 OBJDoc 对象
    let result = objDoc.parse(fileString, scale, reverse);

    if (!result) {
        g_objDoc = null;
        g_drawingInfo = null;
        console.log("OBJ file parsing error.");
        return;
    }

    g_objDoc = objDoc;
}

function onReadComplete (gl, model, objDoc) {
    let drawingInfo = objDoc.getDrawingInfo();

    // 数据写入缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.texCoords, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);

    return drawingInfo;
}

let angle_step = 30.0;
let last = new Date();

function animate (angle) {
    let now = new Date();
    let elapse = now - last;
    last = now;
    let newAngle = angle + (angle_step * elapse) / 2000.0;
    return newAngle % 360;
}

// #region InitShader
function initShaders0 (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
    return initProgram(gl, vertexShader, fragShader);
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